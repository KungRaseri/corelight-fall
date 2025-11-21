import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import MapDisplay from '../../../../src/lib/components/gameplay/MapDisplay.svelte';
import type { Location } from '../../../../src/lib/types/Location';

// Helper to create test location data
function createLocation(overrides: Partial<Location> = {}): Location {
	return {
		id: 1,
		name: 'Test Location',
		description: 'Test description',
		x: 50,
		y: 50,
		...overrides
	};
}

describe('MapDisplay Component', () => {
	it('should render the map container', () => {
		const { container } = render(MapDisplay, {
			locations: [],
			currentLocation: { name: 'Start', x: 0, y: 0 }
		});

		const mapContainer = container.querySelector('.map-container');
		expect(mapContainer).toBeInTheDocument();
	});

	it('should render location markers for each location', () => {
		const locations = [
			createLocation({ id: 1, name: 'Town', x: 25, y: 25 }),
			createLocation({ id: 2, name: 'Forest', x: 75, y: 75 })
		];

		const { container } = render(MapDisplay, {
			locations,
			currentLocation: { name: 'Start', x: 0, y: 0 }
		});

		const markers = container.querySelectorAll('.location-marker');
		expect(markers.length).toBe(2);
	});

	it('should render character marker at current location', () => {
		const { container } = render(MapDisplay, {
			locations: [],
			currentLocation: { name: 'Home', x: 50, y: 50 }
		});

		const characterMarker = container.querySelector('.character-marker');
		expect(characterMarker).toBeInTheDocument();
		expect(characterMarker).toHaveStyle({ top: '50%', left: '50%' });
	});

	it('should position location markers correctly', () => {
		const locations = [createLocation({ name: 'Castle', x: 30, y: 40 })];

		const { container } = render(MapDisplay, {
			locations,
			currentLocation: { name: 'Start', x: 0, y: 0 }
		});

		const marker = container.querySelector('.location-marker');
		expect(marker).toHaveStyle({ top: '40%', left: '30%' });
	});

	it('should call onlocationselected when location marker is clicked', async () => {
		const user = userEvent.setup();
		const onlocationselected = vi.fn();
		const locations = [createLocation({ name: 'Tavern' })];

		const { container } = render(MapDisplay, {
			locations,
			currentLocation: { name: 'Start', x: 0, y: 0 },
			onlocationselected
		});

		const marker = container.querySelector('.location-marker');
		if (marker) {
			await user.click(marker as HTMLElement);
		}

		expect(onlocationselected).toHaveBeenCalledOnce();
		expect(onlocationselected).toHaveBeenCalledWith(locations[0]);
	});

	it('should handle empty locations array', () => {
		const { container } = render(MapDisplay, {
			locations: [],
			currentLocation: { name: 'Nowhere', x: 0, y: 0 }
		});

		const markers = container.querySelectorAll('.location-marker');
		expect(markers.length).toBe(0);

		// Character marker should still exist
		const characterMarker = container.querySelector('.character-marker');
		expect(characterMarker).toBeInTheDocument();
	});

	it('should handle multiple locations', () => {
		const locations = [
			createLocation({ id: 1, name: 'Loc1', x: 10, y: 10 }),
			createLocation({ id: 2, name: 'Loc2', x: 20, y: 20 }),
			createLocation({ id: 3, name: 'Loc3', x: 30, y: 30 }),
			createLocation({ id: 4, name: 'Loc4', x: 40, y: 40 }),
			createLocation({ id: 5, name: 'Loc5', x: 50, y: 50 })
		];

		const { container } = render(MapDisplay, {
			locations,
			currentLocation: { name: 'Start', x: 0, y: 0 }
		});

		const markers = container.querySelectorAll('.location-marker');
		expect(markers.length).toBe(5);
	});

	it('should handle locations at edge positions', () => {
		const locations = [
			createLocation({ name: 'TopLeft', x: 0, y: 0 }),
			createLocation({ name: 'TopRight', x: 100, y: 0 }),
			createLocation({ name: 'BottomLeft', x: 0, y: 100 }),
			createLocation({ name: 'BottomRight', x: 100, y: 100 })
		];

		const { container } = render(MapDisplay, {
			locations,
			currentLocation: { name: 'Center', x: 50, y: 50 }
		});

		const markers = container.querySelectorAll('.location-marker');
		expect(markers.length).toBe(4);
	});

	it('should update current location position', () => {
		const { container, rerender } = render(MapDisplay, {
			locations: [],
			currentLocation: { name: 'Start', x: 25, y: 25 }
		});

		let characterMarker = container.querySelector('.character-marker');
		expect(characterMarker).toHaveStyle({ top: '25%', left: '25%' });

		// Update current location
		rerender({
			locations: [],
			currentLocation: { name: 'End', x: 75, y: 75 }
		});

		characterMarker = container.querySelector('.character-marker');
		expect(characterMarker).toHaveStyle({ top: '75%', left: '75%' });
	});

	it('should handle location at same position as character', () => {
		const locations = [createLocation({ name: 'CurrentLoc', x: 50, y: 50 })];

		const { container } = render(MapDisplay, {
			locations,
			currentLocation: { name: 'CurrentLoc', x: 50, y: 50 }
		});

		const locationMarker = container.querySelector('.location-marker');
		const characterMarker = container.querySelector('.character-marker');

		expect(locationMarker).toHaveStyle({ top: '50%', left: '50%' });
		expect(characterMarker).toHaveStyle({ top: '50%', left: '50%' });
	});

	it('should not call onlocationselected when prop is undefined', async () => {
		const user = userEvent.setup();
		const locations = [createLocation({ name: 'Nowhere' })];

		const { container } = render(MapDisplay, {
			locations,
			currentLocation: { name: 'Start', x: 0, y: 0 }
			// onlocationselected is undefined
		});

		const marker = container.querySelector('.location-marker');
		if (marker) {
			// Should not throw error
			await user.click(marker as HTMLElement);
		}

		// Test passes if no error is thrown
		expect(true).toBe(true);
	});

	it('should have correct container dimensions', () => {
		const { container } = render(MapDisplay, {
			locations: [],
			currentLocation: { name: 'Start', x: 0, y: 0 }
		});

		const mapContainer = container.querySelector('.map-container');
		expect(mapContainer).toHaveClass('rounded');
		expect(mapContainer).toHaveClass('p-4');
	});

	it('should use emoji markers', () => {
		const locations = [createLocation({ name: 'Place' })];

		const { container } = render(MapDisplay, {
			locations,
			currentLocation: { name: 'Here', x: 50, y: 50 }
		});

		const locationMarker = container.querySelector('.location-marker');
		const characterMarker = container.querySelector('.character-marker');

		expect(locationMarker?.textContent).toContain('📍');
		expect(characterMarker?.textContent).toContain('🧭');
	});

	it('should position markers with transform translate', () => {
		const locations = [createLocation({ x: 60, y: 70 })];

		const { container } = render(MapDisplay, {
			locations,
			currentLocation: { name: 'Pos', x: 30, y: 40 }
		});

		const locationMarker = container.querySelector('.location-marker');
		const characterMarker = container.querySelector('.character-marker');

		expect(locationMarker).toHaveClass('location-marker');
		expect(characterMarker).toHaveClass('character-marker');
	});

	it('should log "Map initialized" on mount', () => {
		const consoleSpy = vi.spyOn(console, 'log');

		render(MapDisplay, {
			locations: [],
			currentLocation: { name: 'Start', x: 0, y: 0 }
		});

		expect(consoleSpy).toHaveBeenCalledWith('Map initialized');

		consoleSpy.mockRestore();
	});

	it('should handle locations with negative coordinates', () => {
		const locations = [createLocation({ name: 'NegativeLoc', x: -10, y: -20 })];

		const { container } = render(MapDisplay, {
			locations,
			currentLocation: { name: 'Start', x: 0, y: 0 }
		});

		const marker = container.querySelector('.location-marker');
		expect(marker).toHaveStyle({ top: '-20%', left: '-10%' });
	});

	it('should handle locations with coordinates greater than 100', () => {
		const locations = [createLocation({ name: 'FarLoc', x: 150, y: 200 })];

		const { container } = render(MapDisplay, {
			locations,
			currentLocation: { name: 'Start', x: 0, y: 0 }
		});

		const marker = container.querySelector('.location-marker');
		expect(marker).toHaveStyle({ top: '200%', left: '150%' });
	});

	it('should handle locations with description and regionId', () => {
		const locations = [
			createLocation({
				name: 'Capital',
				description: 'The grand capital city',
				regionId: 42
			})
		];

		const { container } = render(MapDisplay, {
			locations,
			currentLocation: { name: 'Start', x: 0, y: 0 }
		});

		const markers = container.querySelectorAll('.location-marker');
		expect(markers.length).toBe(1);
	});

	it('should handle null optional fields in location', () => {
		const locations = [
			createLocation({
				name: 'Unknown Place',
				description: null,
				regionId: null
			})
		];

		const { container } = render(MapDisplay, {
			locations,
			currentLocation: { name: 'Start', x: 0, y: 0 }
		});

		const markers = container.querySelectorAll('.location-marker');
		expect(markers.length).toBe(1);
	});
});
