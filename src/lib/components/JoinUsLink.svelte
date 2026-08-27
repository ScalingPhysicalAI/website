<script lang="ts">
	let { className = '', label = 'Contact Us' }: { className?: string; label?: string } = $props();
</script>

<a href="mailto:contact@starforgerobotics.com" class={className}>
	{label}
</a>
