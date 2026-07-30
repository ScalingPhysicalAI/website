<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { isAuthenticated } from '$lib/devportal/api';

	onMount(() => {
		goto(isAuthenticated() ? '/developer/dashboard' : '/developer/login', {
			replaceState: true
		});
	});
</script>
