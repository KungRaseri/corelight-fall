-- Query to check for duplicate quests and storylines
-- Run this in your database to see what duplicates exist

SELECT title, COUNT(*) as count
FROM quest
GROUP BY title
HAVING COUNT(*) > 1
ORDER BY count DESC, title;

-- Also check storylines
SELECT title, COUNT(*) as count  
FROM storyline
GROUP BY title
HAVING COUNT(*) > 1
ORDER BY count DESC, title;

-- View all quests with their storylines
SELECT 
  q.id,
  q.title as quest_title,
  s.title as storyline_title,
  q."order",
  q.prerequisite_quest_ids
FROM quest q
LEFT JOIN storyline s ON q.storyline_id = s.id
ORDER BY s.title, q."order";
