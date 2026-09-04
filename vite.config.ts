import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		// fsevents silently stops delivering events for this project, so edits
		// stop reaching the browser until the server is restarted. Polling costs
		// a little CPU but never misses a write.
		watch: { usePolling: true, interval: 250 }
	}
});
