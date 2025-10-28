import { db } from '../index.js';
import {
	user,
	attribute,
	region,
	location,
	faction,
	userRole,
	characterAttribute,
	characterAchievement,
	characterFacility,
	characterRecipe,
	characterFaction,
	characterItem,
	characterLocation,
	characterResource,
	characterStatusEffect,
	session,
	role,
	permission,
	rolePermission,
	character
} from '../schema/index.js';

export async function resetDatabase() {
	console.log('🔄 Resetting database...');
	await db.delete(characterAchievement);
	await db.delete(characterFacility);
	await db.delete(characterFaction);
	await db.delete(characterItem);
	await db.delete(characterLocation);
	await db.delete(characterRecipe);
	await db.delete(characterResource);
	await db.delete(characterAttribute);
	await db.delete(characterStatusEffect);
	await db.delete(character);

	await db.delete(userRole);
	await db.delete(rolePermission);

	await db.delete(permission);
	await db.delete(role);
	await db.delete(attribute);
	await db.delete(region);
	await db.delete(location);
	await db.delete(faction);
	await db.delete(session);

	await db.delete(user);
	console.log('✅ Database reset.');
}
