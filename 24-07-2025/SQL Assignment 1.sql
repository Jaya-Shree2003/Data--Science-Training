create database Personal_Fitness_Tracker;
use Personal_Fitness_Tracker;
--- Create Table
Create Table Exercise(
exercise_id  int Primary Key,
exercise_name Varchar (100),
category Varchar (100),
calories_burn_per_min decimal(5,2)
);
Create Table WorkoutLog(
log_id Int Primary Key,
exercise_id Int ,
date Date,
duration_min Int,
mood Varchar(100),
Foreign key(exercise_id) references Exercise(exercise_id)
);

--- Inserrting Values
INSERT INTO Exercise (exercise_id, exercise_name, category, calories_burn_per_min) VALUES
(1, 'Running', 'Cardio', 10.5),
(2, 'Push-Ups', 'Strength', 7.0),
(3, 'Yoga', 'Flexibility', 4.5),
(4, 'Cycling', 'Cardio', 9.2),
(5, 'Plank', 'Strength', 6.5);

INSERT INTO WorkoutLog (log_id, exercise_id, date, duration_min, mood) VALUES
-- Running
(1, 1, '2025-07-20', 30, 'Energized'),
(2, 1, '2025-07-22', 25, 'Tired'),

-- Push-Ups
(3, 2, '2025-07-19', 15, 'Normal'),
(4, 2, '2025-07-21', 20, 'Energized'),

-- Yoga
(5, 3, '2025-07-18', 40, 'Relaxed'),
(6, 3, '2025-07-20', 30, 'Normal'),

-- Cycling
(7, 4, '2025-07-17', 45, 'Energized'),
(8, 4, '2025-07-21', 30, 'Normal'),

-- Plank
(9, 5, '2025-07-19', 10, 'Tired'),
(10, 5, '2025-07-22', 12, 'Strong');
INSERT INTO WorkoutLog (log_id, exercise_id, date, duration_min, mood) VALUES
(11, 1, '2025-07-20', 45, 'Energized'),
(12, 2, '2025-07-22', 35, 'Tired');
--- Queries To Practise
--- Basic Queries
--- 1. Show all exercises under the “Cardio” category.
Select * from Exercise where category="Cardio";

--- 2. Show workouts done in the month of March 2025.
Select * from WorkoutLog where Month(Date) >=3 and Year(Date)=2025;

--- Calculations
--- 3. Calculate total calories burned per workout (duration × calories_burn_per_min).
Select e.exercise_id,e.exercise_name,w.log_id,(e.calories_burn_per_min*w.duration_min) as calories_burned
from Exercise e 
left join WorkoutLog w 
on e.exercise_id=w.exercise_id;

--- 4. Calculate average workout duration per category.
Select exercise_id,Avg(duration_min) from WorkoutLog group by(exercise_id);

--- JOIN + Aggregation
--- 5. List exercise name, date, duration, and calories burned using a join.
Select e.exercise_name, w.date,w.duration_min,e.calories_burn_per_min from Exercise e 
left join WorkoutLog w  
on e.exercise_id=w.exercise_id;
  
--- 6. Show total calories burned per day.
Select e.exercise_name,w.date,(e.calories_burn_per_min*w.duration_min) as calories_burned
from Exercise e 
left join WorkoutLog w 
on e.exercise_id=w.exercise_id
group by Date(Date),e.exercise_name;
 
--- Subqueries
--- 7. Find the exercise that burned the most calories in total.
Select e.exercise_id,e.exercise_name,(e.calories_burn_per_min*w.duration_min) as calories_burned
from Exercise e 
left join WorkoutLog w 
on e.exercise_id=w.exercise_id
order by calories_burned desc
Limit 1;

--- 8. List exercises never logged in the workout log.

Select E.exercise_name from exercise E left join WorkoutLog w on 
E.exercise_id=w.exercise_id where  w.log_id is null;

--- Conditional + Text Filters
--- 9. Show workouts where mood was “Tired” and duration > 30 mins.
Select e.exercise_id,e.exercise_name,w.mood,w.duration_min from WorkoutLog w 
join Exercise e on e.exercise_id=w.exercise_id
Where w.mood="Tired" and w.duration_min>=30;

--- 10. Update a workout log to correct a wrongly entered mood.
Update WorkoutLog set mood="Relaxed" where log_id=4;

--- Update & Delete
--- 11. Update the calories per minute for “Running”.
Update Exercise set calories_burn_per_min=45.2 where exercise_id=1;
--- 12. Delete all logs from February 2024.
Delete From WorkoutLog
WHERE date >= '2024-02-01' ;


