<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		isAuthenticated,
		logout,
		listCertificates,
		submitKey,
		revokeKey,
		getCACertificate,
		type Certificate,
		type CACertInfo,
		type KeySubmitResult
	} from '$lib/devportal/api';

	let loading = $state(true);
	let certs = $state<Certificate[]>([]);
	let caInfo = $state<CACertInfo | null>(null);
	let pageError = $state('');

	let activeTab = $state<'generate' | 'upload'>('generate');

	let generatedPrivKey = $state('');
	let generatedPubKey = $state('');
	let generating = $state(false);
	let copyDone = $state(false);
	let genResult = $state<KeySubmitResult | null>(null);
	let genError = $state('');
	let submittingGen = $state(false);

	let uploadPubKey = $state('');
	let uploadResult = $state<KeySubmitResult | null>(null);
	let uploadError = $state('');
	let submittingUpload = $state(false);

	let revokingId = $state<number | null>(null);
	let revokeError = $state('');

	onMount(async () => {
		if (!isAuthenticated()) {
			goto('/developer/login', { replaceState: true });
			return;
		}
		await loadData();
	});

	async function loadData() {
		loading = true;
		pageError = '';
		try {
			const [certsData, ca] = await Promise.all([listCertificates(), getCACertificate()]);
			certs = certsData;
			caInfo = ca;
		} catch (e: unknown) {
			if (e instanceof Error && e.message === 'SESSION_EXPIRED') {
				goto('/developer/login', { replaceState: true });
				return;
			}
			pageError = e instanceof Error ? e.message : 'Failed to load data';
		} finally {
			loading = false;
		}
	}

	async function generateKeyPair() {
		generating = true;
		generatedPrivKey = '';
		generatedPubKey = '';
		genResult = null;
		genError = '';

		try {
			const keyPair = await crypto.subtle.generateKey(
				{ name: 'ECDSA', namedCurve: 'P-256' },
				true,
				['sign', 'verify']
			);
			const [privDer, pubDer] = await Promise.all([
				crypto.subtle.exportKey('pkcs8', keyPair.privateKey),
				crypto.subtle.exportKey('spki', keyPair.publicKey)
			]);
			const toPem = (der: ArrayBuffer, label: string) => {
				const b64 = btoa(String.fromCharCode(...new Uint8Array(der)));
				const lines = b64.match(/.{1,64}/g)!.join('\n');
				return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`;
			};
			generatedPrivKey = toPem(privDer, 'PRIVATE KEY');
			generatedPubKey = toPem(pubDer, 'PUBLIC KEY');
		} finally {
			generating = false;
		}
	}

	async function copyPrivateKey() {
		await navigator.clipboard.writeText(generatedPrivKey);
		copyDone = true;
		setTimeout(() => (copyDone = false), 2000);
	}

	function downloadPrivateKey() {
		const blob = new Blob([generatedPrivKey], { type: 'application/x-pem-file' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'developer_private_key.pem';
		a.click();
		URL.revokeObjectURL(url);
	}

	async function submitGeneratedKey() {
		if (!generatedPubKey) return;
		submittingGen = true;
		genError = '';
		genResult = null;
		try {
			genResult = await submitKey(generatedPubKey, 'generated');
			await loadData();
		} catch (e: unknown) {
			genError = e instanceof Error ? e.message : 'Submission failed';
		} finally {
			submittingGen = false;
		}
	}

	async function submitUploadedKey() {
		if (!uploadPubKey.trim()) return;
		submittingUpload = true;
		uploadError = '';
		uploadResult = null;
		try {
			uploadResult = await submitKey(uploadPubKey.trim(), 'uploaded');
			uploadPubKey = '';
			await loadData();
		} catch (e: unknown) {
			uploadError = e instanceof Error ? e.message : 'Submission failed';
		} finally {
			submittingUpload = false;
		}
	}

	async function handleRevoke(certId: number) {
		if (!confirm('Revoke this certificate? This cannot be undone.')) return;
		revokingId = certId;
		revokeError = '';
		try {
			await revokeKey(certId);
			await loadData();
		} catch (e: unknown) {
			revokeError = e instanceof Error ? e.message : 'Revocation failed';
		} finally {
			revokingId = null;
		}
	}

	function handleLogout() {
		logout();
		goto('/developer/login');
	}

	function downloadCACert() {
		if (!caInfo) return;
		const blob = new Blob([caInfo.certificate_pem], { type: 'application/x-pem-file' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'starforge_dev_ca.pem';
		a.click();
		URL.revokeObjectURL(url);
	}

	function certStatus(cert: Certificate): 'active' | 'revoked' | 'expired' {
		if (cert.is_revoked) return 'revoked';
		if (new Date(cert.expires_at) < new Date()) return 'expired';
		return 'active';
	}

	function fmtDate(iso: string): string {
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Dashboard — Starforge Developer Portal</title>
</svelte:head>

<div class="dev-page">
	<div class="dev-page-header">
		<div>
			<span class="section-label">Developer Portal</span>
			<h1 class="dev-page-title">Dashboard</h1>
		</div>
		<button class="dev-logout" onclick={handleLogout}>Logout</button>
	</div>

	{#if pageError}
		<div class="dev-error" style="margin-bottom: 24px;">{pageError}</div>
	{/if}

	{#if loading}
		<div class="dev-loading">Loading…</div>
	{:else}
		<!-- Key Management -->
		<div class="dev-card">
			<h2 class="dev-card-title">Key Management</h2>

			<div class="dev-tab-bar">
				<button
					type="button"
					class="dev-tab-btn"
					class:active={activeTab === 'generate'}
					onclick={() => (activeTab = 'generate')}
				>
					Generate on Portal
				</button>
				<button
					type="button"
					class="dev-tab-btn"
					class:active={activeTab === 'upload'}
					onclick={() => (activeTab = 'upload')}
				>
					Upload My Own Key
				</button>
			</div>

			{#if activeTab === 'generate'}
				<p class="dev-hint">
					Generate an ECDSA P-256 key pair in your browser. Your private key never leaves your
					device.
				</p>

				<div class="dev-generate-btn">
					<button
						type="button"
						class="btn-primary"
						onclick={generateKeyPair}
						disabled={generating}
					>
						{generatedPrivKey ? 'Regenerate Key Pair' : 'Generate Key Pair'}
					</button>
				</div>

				{#if generatedPrivKey}
					<div class="dev-key-warning">
						<strong>Private Key — copy or download this now. It will not be shown again.</strong>
					</div>

					<label class="dev-label" for="priv-key-display">Private Key (PEM)</label>
					<textarea
						class="dev-textarea private-key"
						id="priv-key-display"
						rows={6}
						readonly
						value={generatedPrivKey}
					></textarea>

					<div class="dev-key-actions">
						<button type="button" class="btn-amber" onclick={copyPrivateKey}>
							Copy Private Key
						</button>
						{#if copyDone}
							<span class="copy-confirm">Copied!</span>
						{/if}
						<button type="button" class="btn-ghost-sm" onclick={downloadPrivateKey}>
							Download Private Key
						</button>
					</div>

					<label class="dev-label" for="pub-key-gen">Public Key (PEM) — sent to server</label>
					<textarea
						class="dev-textarea public-key"
						id="pub-key-gen"
						rows={5}
						readonly
						value={generatedPubKey}
					></textarea>

					{#if genError}
						<div class="dev-error">{genError}</div>
					{/if}

					{#if genResult}
						<div class="dev-success">
							Certificate issued — serial {genResult.serial_number.slice(0, 16)}…
						</div>
					{/if}

					<button
						type="button"
						class="btn-primary"
						onclick={submitGeneratedKey}
						disabled={submittingGen}
					>
						{submittingGen ? 'Submitting…' : 'Submit Public Key & Get Certificate'}
					</button>
				{/if}
			{:else}
				<p class="dev-hint">
					Paste your PEM-encoded ECDSA P-256 public key below (e.g. from
					<code>robotapp-cli keygen</code>). Your private key stays on your device.
				</p>

				<label class="dev-label" for="upload-pub-key">Public Key (PEM)</label>
				<textarea
					class="dev-textarea"
					id="upload-pub-key"
					rows={8}
					bind:value={uploadPubKey}
					placeholder="-----BEGIN PUBLIC KEY-----&#10;MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE...&#10;-----END PUBLIC KEY-----"
				></textarea>

				{#if uploadError}
					<div class="dev-error">{uploadError}</div>
				{/if}

				{#if uploadResult}
					<div class="dev-success">
						Certificate issued — serial {uploadResult.serial_number.slice(0, 16)}…
					</div>
				{/if}

				<button
					type="button"
					class="btn-primary"
					onclick={submitUploadedKey}
					disabled={submittingUpload || !uploadPubKey.trim()}
				>
					{submittingUpload ? 'Submitting…' : 'Upload Public Key & Get Certificate'}
				</button>
			{/if}
		</div>

		<!-- Certificates -->
		<div class="dev-card">
			<h2 class="dev-card-title">My Certificates</h2>

			{#if revokeError}
				<div class="dev-error">{revokeError}</div>
			{/if}

			{#if certs.length === 0}
				<p class="dev-empty">
					No certificates yet. Generate a key pair or upload a public key above to get started.
				</p>
			{:else}
				<div class="dev-table-wrap">
					<table class="dev-table">
						<thead>
							<tr>
								<th>Serial</th>
								<th>Issued</th>
								<th>Expires</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each certs as cert (cert.id)}
								{@const status = certStatus(cert)}
								<tr>
									<td class="mono">{cert.serial_number.slice(0, 16)}…</td>
									<td>{fmtDate(cert.issued_at)}</td>
									<td>{fmtDate(cert.expires_at)}</td>
									<td>
										{#if status === 'active'}
											<span class="dev-badge dev-badge-active">Active</span>
										{:else if status === 'revoked'}
											<span class="dev-badge dev-badge-revoked">Revoked</span>
										{:else}
											<span class="dev-badge dev-badge-expired">Expired</span>
										{/if}
									</td>
									<td>
										<div class="dev-table-actions">
											{#if !cert.is_revoked}
												<button
													type="button"
													class="btn-danger-sm"
													disabled={revokingId === cert.id}
													onclick={() => handleRevoke(cert.id)}
												>
													{revokingId === cert.id ? 'Revoking…' : 'Revoke'}
												</button>
											{/if}
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>

		<!-- CA Certificate -->
		{#if caInfo}
			<div class="dev-card dev-card-ca">
				<h2 class="dev-card-title">Dev CA Certificate</h2>
				<p class="dev-hint">
					The CA certificate used to sign all developer certificates. Install this to verify
					developer-signed artifacts (<code>robotapp-cli install-cert --ca &lt;file&gt;</code>).
				</p>

				<div class="dev-key-actions">
					<button type="button" class="btn-primary" onclick={downloadCACert}>
						Download CA Certificate
					</button>
				</div>

				<p class="dev-label" style="margin-bottom: 6px;">
					SHA-256 Fingerprint
				</p>
				<p class="dev-fingerprint">{caInfo.fingerprint_sha256}</p>

				<details class="dev-pem-details" style="margin-top: 20px;">
					<summary class="dev-pem-summary">View PEM</summary>
					<pre class="dev-pem-pre">{caInfo.certificate_pem}</pre>
				</details>
			</div>
		{/if}
	{/if}
</div>
