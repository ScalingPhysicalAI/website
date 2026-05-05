<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { register, login, isAuthenticated } from '$lib/devportal/api';

	let name = $state('');
	let email = $state('');
	let orgName = $state('');
	let password = $state('');
	let tosAccepted = $state(false);
	let error = $state('');
	let loading = $state(false);

	onMount(() => {
		if (isAuthenticated()) goto('/developer/dashboard', { replaceState: true });
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!tosAccepted) {
			error = 'You must accept the Terms of Service';
			return;
		}
		error = '';
		loading = true;
		try {
			await register(name, email, orgName, password);
			await login(email, password);
			goto('/developer/dashboard');
		} catch (err: unknown) {
			error = err instanceof Error ? err.message : 'Registration failed';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Register — Starforge Developer Portal</title>
</svelte:head>

<section class="dev-auth-section">
	<div class="dev-auth-container">
		<span class="hero-tag">Developer Portal</span>
		<h1 class="dev-auth-title">Create Account</h1>

		{#if error}
			<div class="dev-error">{error}</div>
		{/if}

		<form class="dev-form" onsubmit={handleSubmit}>
			<label class="dev-label" for="name">Full Name</label>
			<input
				class="dev-input"
				id="name"
				type="text"
				bind:value={name}
				required
				autocomplete="name"
			/>

			<label class="dev-label" for="email">Email</label>
			<input
				class="dev-input"
				id="email"
				type="email"
				bind:value={email}
				required
				autocomplete="email"
			/>

			<label class="dev-label" for="org">Organization</label>
			<input
				class="dev-input"
				id="org"
				type="text"
				bind:value={orgName}
				required
				autocomplete="organization"
			/>

			<label class="dev-label" for="password">Password</label>
			<input
				class="dev-input"
				id="password"
				type="password"
				bind:value={password}
				required
				minlength={8}
				autocomplete="new-password"
			/>

			<div class="dev-checkbox-row">
				<input type="checkbox" id="tos" bind:checked={tosAccepted} />
				<label for="tos">I accept the Terms of Service</label>
			</div>

			<button class="btn-primary dev-submit" type="submit" disabled={loading}>
				{loading ? 'Creating account…' : 'Register'}
			</button>
		</form>

		<p class="dev-auth-alt">
			Already have an account? <a href="/developer/login">Login</a>
		</p>
	</div>
</section>
