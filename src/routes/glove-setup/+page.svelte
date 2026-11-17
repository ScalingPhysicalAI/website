<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { ImprovSession, bluetoothAvailable, type Network } from '$lib/glove/improv';

	// Setting a glove up needs Bluetooth, which browsers only allow on a secure
	// page - so it happens here. Watching the glove needs a plain local
	// connection, which a secure page is not allowed to make - so that happens
	// on the glove's own address. This page is the handover between the two.
	type Step = 'idle' | 'connecting' | 'network' | 'joining' | 'done';
	type Saved = { name: string; url: string; added: number };

	let step = $state<Step>('idle');
	let error = $state('');
	// What the glove is doing right now, shown under the form rather than
	// instead of it: the form stays usable even if a step is slow or fails.
	let busy = $state('');
	let note = $state('');
	let session: ImprovSession | null = null;
	let deviceName = $state('');
	let networks = $state<Network[]>([]);
	let ssid = $state('');
	let password = $state('');
	let manualSsid = $state(false);
	let urls = $state<string[]>([]);
	let saved = $state<Saved[]>([]);
	let supported = $state(true);

	const STORE = 'starforge.gloves';
	// The glasses setup page reads this to save typing the same network twice.
	// The name only: a password is not ours to keep.
	const WIFI = 'starforge.wifi';

	onMount(() => {
		supported = bluetoothAvailable();
		try {
			saved = JSON.parse(localStorage.getItem(STORE) ?? '[]');
		} catch {
			saved = [];
		}
	});

	function remember(name: string, url: string) {
		saved = [{ name, url, added: Date.now() }, ...saved.filter((g) => g.url !== url)];
		localStorage.setItem(STORE, JSON.stringify(saved));
	}

	function forget(url: string) {
		saved = saved.filter((g) => g.url !== url);
		localStorage.setItem(STORE, JSON.stringify(saved));
	}

	async function start() {
		error = '';
		note = '';
		step = 'connecting';
		busy = 'Connecting…';
		try {
			session = await ImprovSession.request();
		} catch (e) {
			busy = '';
			// Dismissing the browser's device picker is not an error worth showing.
			if (e instanceof Error && e.name === 'NotFoundError') {
				step = 'idle';
				return;
			}
			error = e instanceof Error ? e.message : String(e);
			step = 'idle';
			return;
		}
		// Connected: show the form straight away. Everything below only fills
		// it in, so a glove that will not list its networks can still be set up
		// by typing the name.
		deviceName = session.name;
		manualSsid = true;
		step = 'network';
		busy = 'Reading the glove…';
		const info = await session.info();
		if (info) deviceName = info.name;
		await rescan();
	}

	async function rescan() {
		if (!session) return;
		note = '';
		busy = 'Looking for networks…';
		try {
			networks = await session.scan();
			if (networks.length) {
				manualSsid = false;
				ssid = ssid || networks[0].ssid;
			} else {
				note = 'The glove saw no networks. Type the name instead.';
			}
		} catch (e) {
			networks = [];
			note = (e instanceof Error ? e.message : String(e)) + ' Type the network name instead.';
		} finally {
			busy = '';
		}
	}

	async function join() {
		if (!session || !ssid) return;
		error = '';
		step = 'joining';
		try {
			urls = await session.provision(ssid, password);
			password = '';
			if (urls.length) remember(deviceName, urls[0]);
			try {
				localStorage.setItem(WIFI, JSON.stringify(ssid));
			} catch {
				// Storage switched off changes nothing about the glove being set up.
			}
			step = 'done';
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
			step = 'network';
		} finally {
			busy = '';
		}
	}

	function cancel() {
		session?.disconnect();
		session = null;
		step = 'idle';
		password = '';
		busy = '';
		note = '';
	}

	// Four bars from the usual -95..-35 dBm range.
	const bars = (rssi: number) => Math.max(1, Math.min(4, Math.round((rssi + 95) / 15)));
</script>

<svelte:head>
	<title>Set up a glove | STARFORGE</title>
	<meta
		name="description"
		content="Put a Starforge glove on your Wi-Fi network over Bluetooth, then open its own address for the live 3D hand."
	/>
</svelte:head>

<header class="hero">
	<div class="hero-inner">
		<span class="hero-tag">glove</span>
		<h1>Set up a glove</h1>
		<p class="sub">
			Hand the glove your Wi-Fi network over Bluetooth. When it joins, it tells this page where it
			is, and everything after that &mdash; the live 3D hand, joint angles, settings, firmware
			&mdash; comes from the glove itself at that address.
		</p>
	</div>
</header>

<main class="wrap">
	<section class="card">
		<h2>1. Bluetooth</h2>
		{#if !supported}
			<p class="note">
				This browser has no Web Bluetooth. Use Chrome or Edge on a desktop or Android; Safari and
				Firefox do not implement it.
			</p>
		{:else if step === 'idle'}
			<p class="note">
				Power the glove on and keep it nearby. A glove that is already on a network does not
				advertise &mdash; press <strong>Forget Wi-Fi</strong> on its own page first.
			</p>
			<button class="btn-primary" onclick={start}>Set up over Bluetooth</button>
		{:else if step === 'connecting'}
			<p class="note busy">{busy}</p>
		{:else if step === 'network' || step === 'joining'}
			<p class="note">
				Connected to <strong>{deviceName}</strong>.
				{#if networks.length}
					<button class="link" onclick={rescan} disabled={!!busy}>Rescan</button>
				{/if}
			</p>
			{#if networks.length}
				<ul class="nets">
					{#each networks as net (net.ssid)}
						<li>
							<button
								class="net"
								aria-pressed={ssid === net.ssid && !manualSsid}
								onclick={() => {
									ssid = net.ssid;
									manualSsid = false;
								}}
							>
								<span class="net-name">{net.ssid}</span>
								{#if net.locked}<span class="lock" aria-label="password protected">&#128274;</span
									>{/if}
								<span class="bars" aria-label="{net.rssi} dBm">
									{#each [1, 2, 3, 4] as b (b)}
										<i class:on={b <= bars(net.rssi)} style="height:{b * 3 + 2}px"></i>
									{/each}
								</span>
							</button>
						</li>
					{/each}
					<li>
						<button class="net" aria-pressed={manualSsid} onclick={() => (manualSsid = true)}>
							<span class="net-name muted">Another network&hellip;</span>
						</button>
					</li>
				</ul>
			{/if}
			{#if manualSsid}
				<label class="field">
					<span>Network name</span>
					<input bind:value={ssid} autocomplete="off" autocapitalize="off" spellcheck="false" />
				</label>
			{/if}
			<label class="field">
				<span>Password</span>
				<input type="password" bind:value={password} autocomplete="off" />
			</label>
			<div class="actions">
				<button class="btn-primary" onclick={join} disabled={!ssid || step === 'joining'}>
					{step === 'joining' ? `Joining ${ssid}…` : 'Join network'}
				</button>
				<button class="btn-ghost" onclick={cancel} disabled={step === 'joining'}>Cancel</button>
			</div>
			{#if busy}<p class="note busy">{busy}</p>{/if}
			{#if note}<p class="note">{note}</p>{/if}
		{:else if step === 'done'}
			<p class="note">
				<strong>{deviceName}</strong> is on the network. Open it to see the hand:
			</p>
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="btn-primary open" href={urls[0]} target="_blank" rel="noopener noreferrer">
				Open {urls[0]}
			</a>
			{#if urls[1]}
				<p class="note">
					On a computer <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a href={urls[1]} target="_blank" rel="noopener noreferrer">{urls[1]}</a> works too; phones
					cannot resolve .local names.
				</p>
			{/if}
			<p class="note">
				Using the glasses with it? <a href={resolve('/glasses-setup')}>Set up the glasses</a> next &mdash;
				they are given this glove's address and send everything they see to it.
			</p>
			<button class="btn-ghost" onclick={() => (step = 'idle')}>Set up another</button>
		{/if}
		{#if error}<p class="error">{error}</p>{/if}
	</section>

	<section class="card">
		<h2>2. Your gloves</h2>
		{#if saved.length === 0}
			<p class="note">
				Gloves you set up here are listed for next time. Nothing leaves this browser.
			</p>
		{:else}
			<ul class="saved">
				{#each saved as glove (glove.url)}
					<li>
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a href={glove.url} target="_blank" rel="noopener noreferrer">
							<strong>{glove.name}</strong>
							<span class="muted">{glove.url}</span>
						</a>
						<button class="link" onclick={() => forget(glove.url)}>Remove</button>
					</li>
				{/each}
			</ul>
			<p class="note">
				An address can change when your router hands out a new lease. If a glove does not open, set
				it up again &mdash; or use the <code>.local</code> name on a computer.
			</p>
		{/if}
	</section>

	<section class="card">
		<h2>Why the data stays on the glove</h2>
		<p class="note">
			This page is served over https, and a browser will not let an https page open a plain
			connection to a device on your network. The glove is on your network with no certificate of
			its own, so it serves its own page over http, same-origin with its own stream: that is the one
			place a browser will happily show it. Nothing about the glove's motion passes through
			Starforge &mdash; the setup above is the only part that needs us, and only because Bluetooth
			needs a secure page.
		</p>
		<p class="note">
			Firmware and the standalone viewers live in the
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
	.actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}
	.actions :global(button) {
		flex: 1 1 auto;
	}
	.open {
		display: inline-block;
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
	.net-name {
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.muted {
		color: var(--text-muted);
	}
	.bars {
		display: flex;
		align-items: flex-end;
		gap: 2px;
		height: 14px;
	}
	.bars i {
		width: 3px;
		background: var(--text-muted);
		border-radius: 1px;
		opacity: 0.3;
	}
	.bars i.on {
		opacity: 1;
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
	.saved a {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		text-decoration: none;
		color: inherit;
		min-width: 0;
	}
	.saved a span {
		font-size: 0.85rem;
		word-break: break-all;
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
