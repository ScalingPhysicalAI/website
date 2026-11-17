/**
 * Wi-Fi setup for a pair of glasses over Bluetooth, from the browser.
 *
 * The glasses speak JSON lines over the Nordic UART Service - the same
 * protocol tools/ble_client.py speaks from a laptop. Each board advertises as
 * Glasses-L or Glasses-R, and only while it is NOT on Wi-Fi: a board that has
 * joined a network stops advertising, which is also how you know setup took.
 *
 * Unlike the glove, the glasses need somewhere to send their data: an address
 * on the network that is listening for them. That is the glove - it serves its
 * own page, and the frames the glasses send land there - so every setup call
 * here carries the glove's IP as app_ip.
 *
 * Both boards need the same credentials and the same address. The browser's
 * device picker hands over one device at a time, so the page walks the user
 * through them one after the other.
 */

const NUS = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const RX = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // the board reads what we write
const TX = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // the board notifies on this one

// Nothing negotiates an MTU for us in the browser, and the smallest a board can
// offer carries 20 bytes, so every write is cut to that. A setup command is a
// few hundred bytes at most.
const CHUNK = 20;

/** The browser's Bluetooth API, typed down to the parts used here. */
interface BleCharacteristic {
	writeValue(value: BufferSource): Promise<void>;
	writeValueWithResponse?(value: BufferSource): Promise<void>;
	startNotifications(): Promise<unknown>;
	addEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void;
}
interface BleService {
	getCharacteristic(uuid: string): Promise<BleCharacteristic>;
}
interface BleServer {
	readonly connected: boolean;
	connect(): Promise<BleServer>;
	disconnect(): void;
	getPrimaryService(uuid: string): Promise<BleService>;
}
interface BleDevice {
	readonly name?: string;
	readonly gatt?: BleServer;
	addEventListener?(type: 'gattserverdisconnected', listener: () => void): void;
}
interface BluetoothLike {
	requestDevice(options: {
		filters: ({ namePrefix: string } | { services: string[] })[];
		optionalServices?: string[];
	}): Promise<BleDevice>;
}

function bluetooth(): BluetoothLike | null {
	if (typeof navigator === 'undefined') return null;
	return (navigator as Navigator & { bluetooth?: BluetoothLike }).bluetooth ?? null;
}

/** Whether this browser, on this page, can do Bluetooth setup at all. */
export function bluetoothAvailable(): boolean {
	return bluetooth() !== null;
}

/** Whatever a board answers with: the firmware decides the fields. */
export type Reply = Record<string, unknown>;

/** Which of the two boards this is, read off its advertised name. */
export type Side = 'left' | 'right' | 'unknown';

export function sideOf(name: string): Side {
	const tail = name.trim().slice('Glasses-'.length).toUpperCase();
	return tail.startsWith('L') ? 'left' : tail.startsWith('R') ? 'right' : 'unknown';
}

/** An IPv4 address, which is what a board can dial without a name server. */
export function isIpv4(value: string): boolean {
	const parts = value.trim().split('.');
	return (
		parts.length === 4 &&
		parts.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255) &&
		parts[0] !== '0'
	);
}

/** The address out of a glove's URL, if it is one the glasses could dial. */
export function ipFromUrl(url: string): string | null {
	try {
		const host = new URL(url).hostname;
		return isIpv4(host) ? host : null;
	} catch {
		return null;
	}
}

export class GlassesSession {
	private constructor(
		private readonly device: BleDevice,
		private readonly rx: BleCharacteristic
	) {}

	/** Lines that have arrived and not yet been claimed by a request. */
	private readonly lines: string[] = [];
	private waiting: ((line: string) => void) | null = null;
	private buffer = '';
	private gone = false;
	name = '';

	get side(): Side {
		return sideOf(this.name);
	}

	/**
	 * Shows the browser's device picker, then opens the board's UART service.
	 * Every step has a deadline: a Bluetooth stack that stalls should say so
	 * rather than leave the page waiting on it.
	 */
	static async request(): Promise<GlassesSession> {
		const ble = bluetooth();
		if (!ble) throw new Error('This browser has no Web Bluetooth. Use Chrome or Edge.');
		// By name for the boards that advertise one, by service for the rest -
		// the picker shows a device that matches either.
		const device = await ble.requestDevice({
			filters: [{ namePrefix: 'Glasses-' }, { services: [NUS] }],
			optionalServices: [NUS]
		});
		if (!device.gatt) throw new Error('That device has no Bluetooth connection to open.');
		const server = await deadline(device.gatt.connect(), 15000, 'connect to the glasses');
		const service = await deadline(server.getPrimaryService(NUS), 10000, 'find the setup service');
		const [rx, tx] = await deadline(
			Promise.all([service.getCharacteristic(RX), service.getCharacteristic(TX)]),
			10000,
			'open the setup service'
		);
		const session = new GlassesSession(device, rx);
		session.name = device.name ?? 'glasses';
		tx.addEventListener('characteristicvaluechanged', (event) => session.onData(valueOf(event)));
		await deadline(tx.startNotifications(), 10000, 'listen to the glasses');
		device.addEventListener?.('gattserverdisconnected', () => {
			session.gone = true;
			session.deliver(''); // wake a request that will now never be answered
		});
		return session;
	}

	/** Name, firmware and where the board currently sends its data. */
	info(): Promise<Reply> {
		return this.rpc({ cmd: 'info' }, 8000);
	}

	/**
	 * Hands over the network and the address to send to, in one command: the
	 * board saves both, then joins. The answer is an acknowledgement - the
	 * board is still joining when it arrives, and it stops advertising once it
	 * is on, so the proof is that it appears on the glove.
	 */
	wifi(ssid: string, key: string, appIp: string): Promise<Reply> {
		return this.rpc({ cmd: 'wifi', ssid, key, app_ip: appIp }, 15000);
	}

	/** Points a board at a different address without touching its Wi-Fi. */
	appIp(ip: string | null): Promise<Reply> {
		return this.rpc({ cmd: 'app_ip', ip }, 8000);
	}

	/** Drops the saved network, which brings this board back to setup. */
	forgetWifi(): Promise<Reply> {
		return this.rpc({ cmd: 'forget_wifi' }, 8000);
	}

	disconnect() {
		if (this.device.gatt?.connected) this.device.gatt.disconnect();
	}

	/** One command, one answer: the board replies to each in turn. */
	private async rpc(command: Record<string, unknown>, timeoutMs: number): Promise<Reply> {
		if (this.gone) throw new Error('The glasses disconnected.');
		if (this.waiting) throw new Error('The glasses are still busy.');
		const bytes = new TextEncoder().encode(JSON.stringify(command) + '\n');
		for (let i = 0; i < bytes.length; i += CHUNK) {
			const part = bytes.subarray(i, i + CHUNK);
			await (this.rx.writeValueWithResponse
				? this.rx.writeValueWithResponse(part)
				: this.rx.writeValue(part));
		}
		const line = await this.nextLine(timeoutMs);
		if (!line) throw new Error('The glasses disconnected.');
		let reply: Reply;
		try {
			reply = JSON.parse(line) as Reply;
		} catch {
			throw new Error(`The glasses answered with something unreadable: ${line.slice(0, 80)}`);
		}
		const error = reply.error ?? reply.err;
		if (typeof error === 'string' && error) throw new Error(describe(error));
		if (reply.ok === false)
			throw new Error(describe(String(reply.msg ?? 'the command was refused')));
		return reply;
	}

	private nextLine(timeoutMs: number): Promise<string> {
		const ready = this.lines.shift();
		if (ready !== undefined) return Promise.resolve(ready);
		return new Promise<string>((resolve, reject) => {
			const timer = setTimeout(() => {
				this.waiting = null;
				reject(new Error('The glasses did not answer in time. Try again, or restart them.'));
			}, timeoutMs);
			this.waiting = (line) => {
				clearTimeout(timer);
				this.waiting = null;
				resolve(line);
			};
		});
	}

	private onData(view: DataView) {
		this.buffer += new TextDecoder().decode(view);
		let cut = this.buffer.indexOf('\n');
		while (cut >= 0) {
			this.deliver(this.buffer.slice(0, cut).trim());
			this.buffer = this.buffer.slice(cut + 1);
			cut = this.buffer.indexOf('\n');
		}
	}

	private deliver(line: string) {
		if (!line && !this.gone) return; // a blank line between messages means nothing
		if (this.waiting) this.waiting(line);
		else if (line) this.lines.push(line);
	}
}

/** What a board reports went wrong, in words a person can act on. */
function describe(error: string): string {
	const known: Record<string, string> = {
		bad_json: 'The glasses did not understand that request.',
		unknown_cmd: 'These glasses do not support that command.',
		no_ssid: 'The network name was empty.',
		bad_ip: 'The glasses refused that address. It has to be a plain IPv4 address.',
		wifi_failed: 'The glasses could not join that network. Check the password.'
	};
	return known[error] ?? `The glasses reported: ${error}`;
}

function valueOf(event: Event): DataView {
	return (event.target as unknown as { value: DataView }).value;
}

/** Rejects with something a person can act on if a step never finishes. */
function deadline<T>(work: Promise<T>, ms: number, what: string): Promise<T> {
	return Promise.race([
		work,
		new Promise<T>((_, reject) =>
			setTimeout(
				() => reject(new Error(`Took too long to ${what}. Try again, or restart them.`)),
				ms
			)
		)
	]);
}
