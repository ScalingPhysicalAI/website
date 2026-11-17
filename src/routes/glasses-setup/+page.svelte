<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import {
		GlassesSession,
		bluetoothAvailable,
		ipFromUrl,
		isIpv4,
		type Reply,
		type Side
	} from '$lib/glasses/nus';

	// The glasses are set up the way the glove is - over Bluetooth, from a
	// secure page, because that is the only place a browser allows it. The one
	// extra thing they need is somewhere to send what they see: a glove's
	// address on the same network. From then on the glasses talk to the glove
	// directly and the glove's own page shows the lot; nothing comes back here.
	type Step = 'idle' | 'connecting' | 'form' | 'sending' | 'sent';
	type Glove = { name: string; url: string; added: number };
	type Done = { name: string; side: Side; ip: string; at: number };

	const GLOVES = 'starforge.gloves'; // written by the glove setup page
	const WIFI = 'starforge.wifi'; // the network name last used, never the password
	const DONE = 'starforge.glasses';

	let supported = $state(true);
	let gloves = $state<Glove[]>([]);
	let target = $state(''); // the glove IP the glasses will send to
	let manualIp = $state(false);

	let step = $state<Step>('idle');
	let error = $state('');
	let busy = $state('');
	let note = $state('');
	let session: GlassesSession | null = null;
	let deviceName = $state('');
	let deviceSide = $state<Side>('unknown');
	let deviceInfo = $state<Reply | null>(null);
	let ssid = $state('');
	let password = $state('');
	let done = $state<Done[]>([]);

	onMount(() => {
		supported = bluetoothAvailable();
		gloves = read<Glove[]>(GLOVES, []);
		done = read<Done[]>(DONE, []);
		ssid = read<string>(WIFI, '');
		// The glove set up most recently is the one being worked on.
		const first = gloves.map((g) => ipFromUrl(g.url)).find((ip) => ip);
		if (first) target = first;
		else manualIp = true;
	});

	function read<T>(key: string, fallback: T): T {
		try {
			const raw = localStorage.getItem(key);
			return raw === null ? fallback : (JSON.parse(raw) as T);
		} catch {
			return fallback;
		}
	}

	function write(key: string, value: unknown) {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch {
			// A browser with storage switched off still sets glasses up fine.
		}
	}

	const ready = $derived(isIpv4(target));
	const otherSide = $derived(
		deviceSide === 'left' ? 'right' : deviceSide === 'right' ? 'left' : null
	);
	const label = (side: Side) => (side === 'left' ? 'Left' : side === 'right' ? 'Right' : 'Glasses');
	const sentTo = (side: Side) => done.find((d) => d.side === side);

	async function start() {
		error = '';
		note = '';
		deviceInfo = null;
		step = 'connecting';
		busy = 'Connecting…';
		try {
			session = await GlassesSession.request();
		} catch (e) {
			busy = '';
			step = 'idle';
			// Dismissing the browser's device picker is not an error worth showing.
			if (e instanceof Error && e.name === 'NotFoundError') return;
			error = message(e);
			return;
		}
		deviceName = session.name;
		deviceSide = session.side;
		step = 'form';
		busy = 'Reading the glasses…';
		try {
			deviceInfo = await session.info();
			const seen = deviceInfo.name ?? deviceInfo.device;
			if (typeof seen === 'string' && seen) deviceName = seen;
			const net = deviceInfo.ssid;
			if (typeof net === 'string' && net && !ssid) ssid = net;
		} catch {
			note = 'These glasses did not say what they are, which is fine - setup works anyway.';
		} finally {
			busy = '';
		}
	}

	async function send(withWifi: boolean) {
		if (!session || !ready) return;
		if (withWifi && !ssid) return;
		error = '';
		note = '';
		step = 'sending';
		busy = withWifi ? `Sending ${ssid} and ${target}…` : `Sending ${target}…`;
		try {
			const reply = withWifi
				? await session.wifi(ssid, password, target)
				: await session.appIp(target);
			const side = session.side === 'unknown' ? deviceSide : session.side;
			record({ name: deviceName, side, ip: target, at: Date.now() });
			if (withWifi) write(WIFI, ssid);
			password = '';
			note = summary(reply);
			step = 'sent';
			session.disconnect();
			session = null;
		} catch (e) {
			error = message(e);
			step = 'form';
		} finally {
			busy = '';
		}
	}

	function record(entry: Done) {
		done = [
			entry,
			...done.filter((d) => (d.side === 'unknown' ? d.name !== entry.name : d.side !== entry.side))
		];
		write(DONE, done);
	}

	/** What the board said back, when it says anything worth repeating. */
	function summary(reply: Reply): string {
		const bits: string[] = [];
		if (typeof reply.ip === 'string' && reply.ip) bits.push(`its own address is ${reply.ip}`);
		if (typeof reply.app_ip === 'string' && reply.app_ip) bits.push(`sending to ${reply.app_ip}`);
		return bits.length ? `The glasses answered: ${bits.join(', ')}.` : '';
	}

	function cancel() {
		session?.disconnect();
		session = null;
		step = 'idle';
		password = '';
		busy = '';
		note = '';
	}

	function again() {
		step = 'idle';
		deviceInfo = null;
		note = '';
	}

	function pick(ip: string) {
		target = ip;
		manualIp = false;
	}

	function message(e: unknown): string {
		return e instanceof Error ? e.message : String(e);
	}

	const ago = (at: number) => {
		const mins = Math.round((Date.now() - at) / 60000);
		if (mins < 1) return 'just now';
		if (mins < 60) return `${mins} min ago`;
		const hours = Math.round(mins / 60);
		return hours < 24 ? `${hours} h ago` : `${Math.round(hours / 24)} d ago`;
	};
</script>

<svelte:head>
	<title>Set up the glasses | STARFORGE</title>
	<meta
		name="description"
		content="Put the Starforge glasses on your Wi-Fi over Bluetooth and point them at a glove: the glasses send every frame to the glove, and the glove's own page shows it all."
	/>
</svelte:head>

<header class="hero">
	<div class="hero-inner">
		<span class="hero-tag">glasses</span>
		<h1>Set up the glasses</h1>
		<p class="sub">
			Hand each board your Wi-Fi network over Bluetooth, together with the address of the glove it
			should send to. From then on the glasses stream straight to the glove, and the glove's own
			page shows everything &mdash; the hand, and what the glasses see &mdash; in one place.
		</p>
	</div>
</header>

<main class="wrap">
	<section class="card">
		<h2>1. Where the data goes</h2>
		<p class="note">
			The glasses need the address of a glove that is already on your network. Set the glove up
			first on the <a href={resolve('/glove-setup')}>glove setup page</a> &mdash; it ends by telling you
			the address, and it is remembered here.
		</p>
		{#if gloves.length}
			<ul class="nets">
				{#each gloves as glove (glove.url)}
					{@const ip = ipFromUrl(glove.url)}
					<li>
						<button
							class="net"
							aria-pressed={!manualIp && !!ip && target === ip}
							disabled={!ip}
							onclick={() => ip && pick(ip)}
						>
							<span class="net-name">{glove.name}</span>
							<span class="muted">{ip ?? 'no usable address'}</span>
						</button>
					</li>
				{/each}
				<li>
					<button class="net" aria-pressed={manualIp} onclick={() => (manualIp = true)}>
						<span class="net-name muted">Another address&hellip;</span>
					</button>
				</li>
			</ul>
		{/if}
		{#if manualIp || !gloves.length}
			<label class="field">
				<span>Glove address</span>
				<input
					bind:value={target}
					placeholder="192.168.1.42"
					inputmode="decimal"
					autocomplete="off"
					spellcheck="false"
				/>
			</label>
			<p class="note">
				The plain IPv4 address, with no <code>http://</code> and no port. A
				<code>.local</code> name will not do: the glasses dial the address directly, with nothing to look
				names up for them.
			</p>
		{/if}
		{#if target && !ready}
			<p class="error">That is not an IPv4 address.</p>
		{:else if ready}
			<p class="note ok">The glasses will send everything to <strong>{target}</strong>.</p>
		{/if}
	</section>

	<section class="card">
		<h2>2. Each board over Bluetooth</h2>
		{#if !supported}
			<p class="note">
				This browser has no Web Bluetooth. Use Chrome or Edge on a desktop or Android; Safari and
				Firefox do not implement it.
			</p>
		{:else if step === 'idle'}
			<p class="note">
				There are two boards, <strong>Glasses-L</strong> and <strong>Glasses-R</strong>, and both
				need this. Do one, then press the button again for the other. A board only advertises while
				it is off Wi-Fi, so one that is already connected will not appear in the picker.
			</p>
			<button class="btn-primary" onclick={start} disabled={!ready}>Set up over Bluetooth</button>
			{#if !ready}
				<p class="note">Choose the glove address above first.</p>
			{/if}
		{:else if step === 'connecting'}
			<p class="note busy">{busy}</p>
		{:else if step === 'form' || step === 'sending'}
			<p class="note">
				Connected to <strong>{deviceName}</strong>{#if deviceSide !== 'unknown'}
					&nbsp;({label(deviceSide)}){/if}.
				{#if deviceInfo?.fw}<span class="muted">firmware {deviceInfo.fw}</span>{/if}
			</p>
			<label class="field">
				<span>Network name</span>
				<input bind:value={ssid} autocomplete="off" autocapitalize="off" spellcheck="false" />
			</label>
			<label class="field">
				<span>Password</span>
				<input type="password" bind:value={password} autocomplete="off" />
			</label>
			<label class="field">
				<span>Send to</span>
				<input value={target} readonly />
			</label>
			<div class="actions">
				<button
					class="btn-primary"
					onclick={() => send(true)}
					disabled={!ssid || step === 'sending'}
				>
					{step === 'sending' ? 'Sending…' : 'Join network and send'}
				</button>
				<button class="btn-ghost" onclick={cancel} disabled={step === 'sending'}>Cancel</button>
			</div>
			<p class="note">
				Already on this network and only the address needs changing?
				<button class="link" onclick={() => send(false)} disabled={step === 'sending'}>
					Send the address only
				</button>
			</p>
			{#if busy}<p class="note busy">{busy}</p>{/if}
		{:else if step === 'sent'}
			<p class="note ok">
				<strong>{deviceName}</strong> has the network and the glove's address. It joins on its own
				and stops advertising once it is on.
				{note}
			</p>
			<div class="actions">
				<button class="btn-primary" onclick={again}>
					{otherSide && !sentTo(otherSide) ? `Set up the ${otherSide} one` : 'Set up another'}
				</button>
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a
					class="btn-ghost open"
					href={`http://${target}/`}
					target="_blank"
					rel="noopener noreferrer"
				>
					Open the glove
				</a>
			</div>
		{/if}
		{#if note && step !== 'sent'}<p class="note">{note}</p>{/if}
		{#if error}<p class="error">{error}</p>{/if}
	</section>

	<section class="card">
		<h2>3. What is set up</h2>
		{#if done.length === 0}
			<p class="note">
				Boards you set up here are listed for next time. Nothing leaves this browser.
			</p>
		{:else}
			<ul class="saved">
				{#each done as board (board.name + board.side)}
					<li>
						<span class="saved-main">
							<strong>{label(board.side)}</strong>
							<span class="muted">{board.name} &rarr; {board.ip} &middot; {ago(board.at)}</span>
						</span>
						{#if board.ip !== target && ready}
							<span class="warn">points at another glove</span>
						{/if}
					</li>
				{/each}
			</ul>
			<p class="note">
				Both boards have to point at the same glove for the two views to line up. An address can
				change when your router hands out a new lease &mdash; if the glasses stop appearing on the
				glove, make it forget Wi-Fi and set it up again from here.
			</p>
		{/if}
	</section>

	<section class="card">
		<h2>Where the data goes, and why</h2>
		<p class="note">
			This page is served over https, and a browser will not let an https page open a plain
			connection to a device on your network &mdash; so the setup happens here, and the watching
			happens there. The glasses connect to the glove by IP and send it every frame; the glove's own
			page, same-origin with its own stream, shows the hand and what the glasses report side by
			side. Nothing about either passes through Starforge.
		</p>
		<p class="note">
			The same commands are available from a laptop with <code>tools/ble_client.py</code>, and the
			firmware and standalone viewers live in the
			<a href={resolve('/docs')}>developer docs</a>.
		</p>
	</section>
</main>

<style>
	.hero {
		padding: calc(var(--header-height, 96px) + 3rem) 1.5rem 2.5rem;
		border-bottom: 1px solid var(--border);
	}
	.hero-inner,
	.wrap {
		max-width: 46rem;
		margin: 0 auto;
	}
	.hero h1 {
		font-size: clamp(2rem, 5vw, 2.75rem);
		letter-spacing: -0.02em;
		margin: 0.5rem 0 0.75rem;
	}
	.sub,
	.note {
		color: var(--text-muted);
		line-height: 1.6;
	}
	.sub {
		font-size: 1.05rem;
		max-width: 38rem;
	}
	.wrap {
		padding: 2.5rem 1.5rem 5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.card {
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 1.5rem;
	}
	.card h2 {
		font-size: 1.05rem;
		margin: 0 0 0.75rem;
	}
	.note {
		font-size: 0.95rem;
		margin: 0 0 1rem;
	}
	.note:last-child {
		margin-bottom: 0;
	}
	.note.ok strong {
		color: var(--ink);
	}
	.actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}
	.actions :global(button),
	.actions .open {
		flex: 1 1 auto;
	}
	.open {
		display: inline-block;
		text-align: center;
		text-decoration: none;
		word-break: break-all;
	}
	.nets {
		list-style: none;
		margin: 0 0 1rem;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
	}
	.nets li + li {
		border-top: 1px solid var(--border);
	}
	.net {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		padding: 0.7rem 0.9rem;
		background: none;
		border: 0;
		font: inherit;
		color: inherit;
		cursor: pointer;
		text-align: left;
	}
	.net[aria-pressed='true'] {
		background: color-mix(in srgb, var(--accent) 10%, transparent);
	}
	.net:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}
	.net-name {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.muted {
		color: var(--text-muted);
	}
	.field {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}
	.field span {
		width: 8.5rem;
		color: var(--text-muted);
		font-size: 0.95rem;
	}
	.field input {
		flex: 1;
		min-width: 0;
		padding: 0.6rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 8px;
		font: inherit;
		background: #fff;
		color: var(--ink);
	}
	.field input[readonly] {
		background: color-mix(in srgb, var(--border) 25%, transparent);
	}
	.saved {
		list-style: none;
		margin: 0 0 1rem;
		padding: 0;
	}
	.saved li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.7rem 0;
		border-top: 1px solid var(--border);
	}
	.saved li:first-child {
		border-top: 0;
	}
	.saved-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
	}
	.saved-main span {
		font-size: 0.85rem;
		word-break: break-all;
	}
	.warn {
		font-size: 0.8rem;
		color: #8a5a00;
		white-space: nowrap;
	}
	.link {
		background: none;
		border: 0;
		color: var(--accent);
		font: inherit;
		cursor: pointer;
		padding: 0;
	}
	.busy {
		margin-top: 1rem;
	}
	.busy::after {
		content: '';
		display: inline-block;
		width: 0.6em;
		animation: dots 1.2s steps(4, end) infinite;
	}
	@keyframes dots {
		to {
			width: 0;
		}
	}
	.error {
		color: #b3261e;
		font-size: 0.95rem;
		margin: 1rem 0 0;
	}
</style>
