import type { Attribute, CharacterAttribute } from '$lib/server/db/types';
import { writable } from 'svelte/store';

export const characterAttributes = writable<{ attribute: Attribute, characterAttribute: CharacterAttribute }[]>([]);

export function setCharacterAttributes(attributes: { attribute: Attribute, characterAttribute: CharacterAttribute }[]) {
    characterAttributes.set(attributes);
}

export function updateCharacterAttribute(attributeId: number, newValue: number) {
    characterAttributes.update((attributes) => {
        const attributeIndex = attributes.findIndex(({ characterAttribute }) => characterAttribute.attributeId === attributeId);
        if (attributeIndex !== -1) {
            attributes[attributeIndex].characterAttribute.value = newValue;
        }
        return attributes;
    });
}
