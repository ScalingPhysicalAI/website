<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { login, isAuthenticated } from '$lib/devportal/api';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	onMount(() => {
		if (isAuthenticated()) goto('/developer/dashboard', { replaceState: true });
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		loading = true;
		try {
			await login(email, password);
			goto('/developer/dashboard');
		} catch (err: unknown) {
			error = err instanceof Error ? err.message : 'Login failed';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Login — Starforge Developer Portal</title>
</svelte:head>

<section class="dev-auth-section">
	<div class="dev-auth-container">
		<span class="hero-tag">Developer Portal</span>
		<h1 class="dev-auth-title">Login</h1>

		{#if error}
			<div class="dev-error">{error}</div>
		{/if}

		<form class="dev-form" onsubmit={handleSubmit}>
			<label class="dev-label" for="email">Email</label>
			<input
				class="dev-input"
				id="email"
				type="email"
				bind:value={email}
				required
				autocomplete="email"
			/>

			<label class="dev-label" for="password">Password</label>
			<input
				class="dev-input"
				id="password"
				type="password"
				bind:value={password}
				required
				autocomplete="current-password"
			/>

			<button class="btn-primary dev-submit" type="submit" disabled={loading}>
				{loading ? 'Logging in…' : 'Login'}
			</button>
		</form>

		<p class="dev-auth-alt">
			Don't have an account? <a href="/developer/register">Register</a>
		</p>
	</div>
</section>
