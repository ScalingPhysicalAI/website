<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		title,
		onClose,
		children
	}: {
		open?: boolean;
		title: string;
		onClose?: () => void;
		children: Snippet;
	} = $props();

	let dialogEl: HTMLDivElement | undefined = $state();

	function close() {
		open = false;
		onClose?.();
	}

	function onBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}

	// Lock page scroll behind the sheet/modal while it's open, on both desktop
	// and mobile (iOS Safari ignores `overflow:hidden` on <body> alone unless
	// touch scrolling on the document is also blocked).
	$effect(() => {
		if (!open) return;
		const prevOverflow = document.documentElement.style.overflow;
		document.documentElement.style.overflow = 'hidden';
		dialogEl?.focus();
		return () => {
			document.documentElement.style.overflow = prevOverflow;
		};
	});
</script>

<svelte:window onkeydown={open ? onKeydown : undefined} />

{#if open}
	<div class="modal-backdrop" onclick={onBackdropClick} role="presentation">
		<div
			class="modal"
			bind:this={dialogEl}
			role="dialog"
			aria-modal="true"
			aria-label={title}
			tabindex="-1"
		>
			<div class="modal-bar">
				<span class="modal-handle" aria-hidden="true"></span>
				<div class="modal-head">
					<span class="modal-title">{title}</span>
					<button type="button" class="modal-close" onclick={close} aria-label="Close">
						&times;
					</button>
				</div>
			</div>
			<div class="modal-body">
				{@render children()}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 32px;
		background: rgba(20, 18, 16, 0.55);
		backdrop-filter: blur(2px);
		animation: modalFade 0.18s ease;
	}

	.modal {
		display: flex;
		flex-direction: column;
		width: min(820px, 100%);
		height: min(86vh, 920px);
		background: var(--bg, #fff);
		border: 2px solid var(--border-strong, rgba(20, 18, 16, 0.25));
		box-shadow: 0 32px 64px -24px rgba(20, 18, 16, 0.45);
		outline: none;
		animation: modalPop 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.modal-handle {
		display: none;
	}

	.modal-bar {
		flex-shrink: 0;
		border-bottom: 2px solid var(--border, rgba(20, 18, 16, 0.13));
	}

	.modal-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 18px 20px;
	}

	.modal-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 22px;
		letter-spacing: 0.03em;
		color: var(--ink, #141210);
	}

	.modal-close {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		flex-shrink: 0;
		font-size: 22px;
		line-height: 1;
		color: var(--ink, #141210);
		background: transparent;
		border: 2px solid var(--border-strong, rgba(20, 18, 16, 0.25));
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.modal-close:hover {
		border-color: var(--accent, #7a5e0f);
		color: var(--accent, #7a5e0f);
	}

	.modal-body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
	}

	@keyframes modalFade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes modalPop {
		from {
			opacity: 0;
			transform: scale(0.97) translateY(6px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	/* Below the desktop breakpoint the dialog becomes a bottom sheet: full
	   width, anchored to the bottom edge, with a drag-handle affordance - the
	   pattern users already expect on a phone instead of a floating card. */
	@media (max-width: 640px) {
		.modal-backdrop {
			align-items: flex-end;
			padding: 0;
		}

		.modal {
			width: 100%;
			height: 88vh;
			border-left: none;
			border-right: none;
			border-bottom: none;
			border-radius: 18px 18px 0 0;
			animation: modalSheetUp 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
		}

		.modal-handle {
			display: block;
			width: 40px;
			height: 4px;
			margin: 10px auto 0;
			border-radius: 2px;
			background: var(--border-strong, rgba(20, 18, 16, 0.25));
		}

		.modal-head {
			padding: 12px 16px 14px;
		}

		.modal-title {
			font-size: 19px;
		}

		@keyframes modalSheetUp {
			from {
				transform: translateY(100%);
			}
			to {
				transform: translateY(0);
			}
		}
	}
</style>
