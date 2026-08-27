<script lang="ts">
	import { resolve } from '$app/paths';

	// Never rendered: the load function always redirects. This exists only so the
	// old address is a real route for the prerenderer to emit a redirect for.
</script>

<title>Redirecting to preorder - STARFORGE</title>

<p>This page has moved to <a href={resolve('/buildo')}>/buildo</a>.</p>
