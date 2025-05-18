import type { Attribute, Character, CharacterAttribute } from '$lib/server/db/types';
import { writable, type Writable } from 'svelte/store';

export const character: Writable<Character | null> = writable();

export function setCharacter(data: any) {
    character.set(data);
}

export function clearCharacter() {
    character.set(null);
}

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
