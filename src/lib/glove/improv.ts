/**
 * Wi-Fi setup for a glove over Bluetooth, from the browser.
 *
 * The glove speaks Improv (improv-wifi.com): five GATT characteristics, no
 * pairing and no app. Web Bluetooth needs a secure page, which is why this
 * lives on the site rather than on the glove - the glove is plain http on the
 * local network, so it could never offer this itself. Once the glove is on a
 * network it serves its own page, and that is where its data stays: this
 * module's last act is to hand back the URL it reports.
 */

const SERVICE = '00467768-6228-2272-4663-277478268000';
const CHR = {
	state: '00467768-6228-2272-4663-277478268001',
	error: '00467768-6228-2272-4663-277478268002',
	command: '00467768-6228-2272-4663-277478268003',
	result: '00467768-6228-2272-4663-277478268004'
};
const CMD = { wifi: 0x01, identify: 0x02, info: 0x03, scan: 0x04 };

// What the glove says went wrong, in the words a person needs.
const ERRORS: Record<number, string> = {
	1: 'The glove did not understand that request.',
	2: 'This glove does not support that command.',
	3: 'The glove could not join that network. Check the password, and that it is 2.4 or 5GHz Wi-Fi it can see.',
	4: 'The glove refused: it is not in setup mode.',
	5: 'That name is not usable as a hostname.',
	255: 'The glove reported an unknown error.'
};

/** The browser's Bluetooth API, typed down to the parts used here. */
interface BleCharacteristic {
	readValue(): Promise<DataView>;
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
	requestDevice(options: { filters: { services: string[] }[] }): Promise<BleDevice>;
}

function bluetooth(): BluetoothLike | null {
	if (typeof navigator === 'undefined') return null;
	return (navigator as Navigator & { bluetooth?: BluetoothLike }).bluetooth ?? null;
}

/** Whether this browser, on this page, can do Bluetooth setup at all. */
export function bluetoothAvailable(): boolean {
	return bluetooth() !== null;
}

export interface Network {
	ssid: string;
	rssi: number;
	locked: boolean;
}

/** A glove, as it describes itself over Bluetooth. */
export interface GloveInfo {
	name: string;
	firmware: string;
	version: string;
}

type Pending = {
	command: number;
	resolve: (values: string[]) => void;
	reject: (error: Error) => void;
};

export class ImprovSession {
	private constructor(
		private readonly device: BleDevice,
		private readonly command: BleCharacteristic,
		private readonly result: BleCharacteristic,
		private readonly errorState: BleCharacteristic
	) {}

	private pending: Pending | null = null;
	private gone = false;
	name = '';

	/**
	 * Shows the browser's device picker, then opens the glove's service.
	 * Every step is given a deadline: a Bluetooth stack that stalls should
	 * say so rather than leave the page waiting.
	 */
	static async request(): Promise<ImprovSession> {
		const ble = bluetooth();
		if (!ble) throw new Error('This browser has no Web Bluetooth. Use Chrome or Edge.');
		const device = await ble.requestDevice({ filters: [{ services: [SERVICE] }] });
		if (!device.gatt) throw new Error('That device has no Bluetooth connection to open.');
		const server = await deadline(device.gatt.connect(), 15000, 'connect to the glove');
		const service = await deadline(
			server.getPrimaryService(SERVICE),
			10000,
			'find the setup service'
		);
		const [command, result, error] = await deadline(
			Promise.all([
				service.getCharacteristic(CHR.command),
				service.getCharacteristic(CHR.result),
				service.getCharacteristic(CHR.error)
			]),
			10000,
			'open the setup service'
		);
		const session = new ImprovSession(device, command, result, error);
		session.name = device.name ?? 'glove';

		// Results and errors normally arrive as notifications. Subscribing can
		// fail, and a notification can be missed, so rpc() also reads the same
		// characteristics while it waits - they hold the latest value either way.
		result.addEventListener('characteristicvaluechanged', (event) =>
			session.onResult(valueOf(event))
		);
		error.addEventListener('characteristicvaluechanged', (event) =>
			session.onError(valueOf(event).getUint8(0))
		);
		await Promise.allSettled([result.startNotifications(), error.startNotifications()]);
		addDisconnectListener(device, () => {
			session.gone = true;
			session.finish(null, new Error('The glove disconnected.'));
		});
		return session;
	}

	/** Firmware name, version and the glove's own name. Best effort. */
	async info(): Promise<GloveInfo | null> {
		try {
			const [firmware, version, , name] = await this.rpc(CMD.info, new Uint8Array(), 8000);
			this.name = name || this.name;
			return { name: this.name, firmware, version };
		} catch {
			return null; // an older glove, or one that did not answer this one
		}
	}

	/**
	 * Networks the glove can see, strongest first. The glove scans both the
	 * 2.4 and 5GHz bands, which takes it a few seconds.
	 */
	async scan(): Promise<Network[]> {
		const values = await this.rpc(CMD.scan, new Uint8Array(), 20000);
		const networks: Network[] = [];
		for (let i = 0; i + 2 < values.length; i += 3)
			networks.push({
				ssid: values[i],
				rssi: Number(values[i + 1]),
				locked: values[i + 2] === 'YES'
			});
		return networks;
	}

	/**
	 * Hands over the credentials and waits for the glove to be on the network.
	 * Resolves with the URLs it reports, the plain IP first - phones cannot
	 * resolve .local names, so that is the one to open.
	 */
	async provision(ssid: string, password: string): Promise<string[]> {
		const text = new TextEncoder();
		const s = text.encode(ssid);
		const p = text.encode(password);
		const data = new Uint8Array(2 + s.length + p.length);
		data[0] = s.length;
		data.set(s, 1);
		data[1 + s.length] = p.length;
		data.set(p, 2 + s.length);
		// The firmware gives the access point 20 seconds to answer before it
		// gives up, so wait longer than that.
		const urls = await this.rpc(CMD.wifi, data, 30000);
		this.disconnect(); // the glove is on Wi-Fi now; Bluetooth has done its job
		return urls.filter((url) => /^https?:\/\//.test(url));
	}

	identify(): Promise<void> {
		return this.send(CMD.identify, new Uint8Array());
	}

	disconnect() {
		if (this.device.gatt?.connected) this.device.gatt.disconnect();
	}

	// command | length | data | checksum, and the answer comes back the same way.
	private send(command: number, data: Uint8Array): Promise<void> {
		const packet = new Uint8Array(3 + data.length);
		packet[0] = command;
		packet[1] = data.length;
		packet.set(data, 2);
		packet[packet.length - 1] = packet.reduce((sum, byte) => sum + byte, 0) & 0xff;
		return this.command.writeValueWithResponse
			? this.command.writeValueWithResponse(packet)
			: this.command.writeValue(packet);
	}

	private rpc(command: number, data = new Uint8Array(), timeoutMs = 15000): Promise<string[]> {
		if (this.pending) return Promise.reject(new Error('The glove is still busy.'));
		if (this.gone) return Promise.reject(new Error('The glove disconnected.'));
		return new Promise<string[]>((resolve, reject) => {
			const timer = setTimeout(
				() => this.finish(null, new Error('The glove did not answer in time.')),
				timeoutMs
			);
			// Notifications are the fast path; polling the same characteristics
			// covers a subscription that silently did not take.
			const poll = setInterval(() => void this.readAnswer(), 900);
			const done = () => {
				clearTimeout(timer);
				clearInterval(poll);
			};
			this.pending = {
				command,
				resolve: (values) => {
					done();
					resolve(values);
				},
				reject: (error) => {
					done();
					reject(error);
				}
			};
			this.send(command, data).catch((e: Error) => this.finish(null, e));
		});
	}

	/** Reads the result and error characteristics, for when no notification came. */
	private async readAnswer() {
		if (!this.pending) return;
		try {
			const value = await this.result.readValue();
			if (value.byteLength >= 2) this.onResult(value);
			if (!this.pending) return;
			const error = await this.errorState.readValue();
			if (error.byteLength) this.onError(error.getUint8(0));
		} catch {
			// Reads can be refused while the stack is busy; the next tick retries.
		}
	}

	private finish(values: string[] | null, error: Error | null) {
		const pending = this.pending;
		if (!pending) return;
		this.pending = null;
		if (values) pending.resolve(values);
		else pending.reject(error ?? new Error('Setup failed.'));
	}

	private onResult(view: DataView) {
		const command = view.getUint8(0);
		const length = view.getUint8(1);
		const values: string[] = [];
		for (let i = 0; i < length; ) {
			const size = view.getUint8(2 + i);
			const bytes = new Uint8Array(size);
			for (let k = 0; k < size; k++) bytes[k] = view.getUint8(3 + i + k);
			values.push(new TextDecoder().decode(bytes));
			i += size + 1;
		}
		if (this.pending?.command === command) this.finish(values, null);
	}

	private onError(code: number) {
		if (code === 0) return; // cleared at the start of every command
		this.finish(null, new Error(ERRORS[code] ?? `The glove reported error ${code}.`));
	}
}

function valueOf(event: Event): DataView {
	return (event.target as unknown as { value: DataView }).value;
}

function addDisconnectListener(device: BleDevice, onGone: () => void) {
	device.addEventListener?.('gattserverdisconnected', onGone);
}

/** Rejects with something a person can act on if a step never finishes. */
function deadline<T>(work: Promise<T>, ms: number, what: string): Promise<T> {
	return Promise.race([
		work,
		new Promise<T>((_, reject) =>
			setTimeout(() => reject(new Error(`Took too long to ${what}. Try again, or restart it.`)), ms)
		)
	]);
}
