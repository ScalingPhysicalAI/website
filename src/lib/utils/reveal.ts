export function setupRevealObserver({ threshold = 0.1 }: { threshold?: number } = {}) {
	if (typeof window === 'undefined') return () => {};

	const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
	const observer = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					(e.target as HTMLElement).classList.add('visible');
					observer.unobserve(e.target);
				}
			}
		},
		{ threshold }
	);

	for (const r of reveals) observer.observe(r);
	return () => observer.disconnect();
}
