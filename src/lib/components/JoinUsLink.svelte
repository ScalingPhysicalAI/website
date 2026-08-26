<script lang="ts">
	let { className = '', label = 'Contact Us' }: { className?: string; label?: string } = $props();
</script>

<a href="mailto:vipulsaini594@gmail.com,vipul@starforgerobotics.com" class={className}>
	{label}
</a>
