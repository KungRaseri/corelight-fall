import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import ModalTestWrapper from './ModalTestWrapper.svelte';

describe('Modal Component', () => {
	it('should not render when open is false', () => {
		const onClose = vi.fn();
		render(ModalTestWrapper, {
			open: false,
			onClose,
			content: 'Test content'
		});

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('should render when open is true', () => {
		const onClose = vi.fn();
		render(ModalTestWrapper, {
			open: true,
			onClose,
			content: 'Test content'
		});

		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(screen.getByText('Test content')).toBeInTheDocument();
	});

	it('should call onClose when backdrop is clicked', async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(ModalTestWrapper, {
			open: true,
			onClose,
			content: 'Test content'
		});

		const backdrop = screen.getByRole('dialog');
		await user.click(backdrop);

		expect(onClose).toHaveBeenCalled();
	});

	it('should call onClose when close button (✕) is clicked', async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(ModalTestWrapper, {
			open: true,
			onClose,
			content: 'Test content'
		});

		const closeButton = screen.getByRole('button', { name: '✕' });
		await user.click(closeButton);

		expect(onClose).toHaveBeenCalled();
	});

	it('should call onClose when Escape key is pressed on dialog', () => {
		const onClose = vi.fn();
		render(ModalTestWrapper, {
			open: true,
			onClose,
			content: 'Test content'
		});

		const dialog = screen.getByRole('dialog');
		dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

		expect(onClose).toHaveBeenCalled();
	});

	it('should call onClose when Enter key is pressed on dialog', () => {
		const onClose = vi.fn();
		render(ModalTestWrapper, {
			open: true,
			onClose,
			content: 'Test content'
		});

		const dialog = screen.getByRole('dialog');
		dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

		expect(onClose).toHaveBeenCalled();
	});

	it('should call onClose when Space key is pressed on dialog', () => {
		const onClose = vi.fn();
		render(ModalTestWrapper, {
			open: true,
			onClose,
			content: 'Test content'
		});

		const dialog = screen.getByRole('dialog');
		dialog.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

		expect(onClose).toHaveBeenCalled();
	});

	it('should not close when clicking modal content area', async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(ModalTestWrapper, {
			open: true,
			onClose,
			content: 'Test content'
		});

		const content = screen.getByText('Test content');
		await user.click(content);

		expect(onClose).not.toHaveBeenCalled();
	});

	it('should not close when pressing other keys', () => {
		const onClose = vi.fn();
		render(ModalTestWrapper, {
			open: true,
			onClose,
			content: 'Test content'
		});

		const dialog = screen.getByRole('dialog');
		dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
		dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

		expect(onClose).not.toHaveBeenCalled();
	});

	it('should have correct ARIA attributes', () => {
		const onClose = vi.fn();
		render(ModalTestWrapper, {
			open: true,
			onClose,
			content: 'Test content'
		});

		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
		expect(dialog).toHaveAttribute('tabindex', '0');
	});

	it('should render complex children content', () => {
		const onClose = vi.fn();
		render(ModalTestWrapper, {
			open: true,
			onClose,
			content: 'Complex content with multiple words'
		});

		expect(screen.getByText('Complex content with multiple words')).toBeInTheDocument();
	});

	it('should have proper z-index and backdrop styling', () => {
		const onClose = vi.fn();
		render(ModalTestWrapper, {
			open: true,
			onClose,
			content: 'Test content'
		});

		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveClass('z-50');
		expect(dialog).toHaveClass('bg-black/60');
	});
});
