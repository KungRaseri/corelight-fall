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
	characterEquipment,
	session,
	role,
	permission,
	rolePermission,
	character,
	blogPost,
	item,
	choice,
	encounter,
	quest,
	storyline,
	phase,
	act,
	playerStoryProgress
} from '../schema/index.js';

export async function resetDatabase() {
	console.log('🔄 Resetting database...');
	
	// Delete character-related data first
	await db.delete(characterAchievement);
	await db.delete(characterFacility);
	await db.delete(characterFaction);
	await db.delete(characterEquipment);
	await db.delete(characterItem);
	await db.delete(characterLocation);
	await db.delete(characterRecipe);
	await db.delete(characterResource);
	await db.delete(characterAttribute);
	await db.delete(characterStatusEffect);
	await db.delete(character);

	// Delete story progress
	await db.delete(playerStoryProgress);

	// Delete story structure (child to parent order)
	await db.delete(choice);
	await db.delete(encounter);
	await db.delete(quest);
	await db.delete(storyline);
	await db.delete(phase);
	await db.delete(act);

	// Delete items and blog posts
	await db.delete(item);
	await db.delete(blogPost);

	// Delete user roles and permissions
	await db.delete(userRole);
	await db.delete(rolePermission);

	await db.delete(permission);
	await db.delete(role);
	
	// Delete gameplay data
	await db.delete(attribute);
	await db.delete(region);
	await db.delete(location);
	await db.delete(faction);
	
	// Delete sessions and users
	await db.delete(session);
	await db.delete(user);
	
	console.log('✅ Database reset.');
}
