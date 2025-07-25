CREATE DATABASE Travel_Planner;
USE Travel_PLanner;
--- Create Table
CREATE TABLE Destinations (
    destination_id INT PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    category VARCHAR(50), 
    avg_cost_per_day DECIMAL(10,2)
);

CREATE TABLE Trips (
    trip_id INT PRIMARY KEY,
    destination_id INT,
    traveler_name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2),
    FOREIGN KEY (destination_id) REFERENCES Destinations(destination_id)
);
--- Insert Data
INSERT INTO Destinations (destination_id, city, country, category, avg_cost_per_day) VALUES
(1, 'Goa', 'India', 'Beach', 3070.00),
(2, 'Paris', 'France', 'Historical', 3150.00),
(3, 'Cape Town', 'South Africa', 'Adventure', 2090.00),
(4, 'Tokyo', 'Japan', 'Historical', 4130.00),
(5, 'Queenstown', 'New Zealand', 'Nature', 1120.00),
(6, 'Barcelona', 'Spain', 'Beach', 1110.00);
DROP TABLE IF EXISTS Trips;



INSERT INTO Trips (trip_id, destination_id, traveler_name, start_date, end_date, budget) VALUES
(1, 1, 'Aarav Mehta', '2024-12-20', '2024-12-25', 4000.00),
(2, 2, 'Emma Watson', '2025-01-10', '2025-01-20', 16000.00),
(3, 3, 'Liam Smith', '2025-02-05', '2025-02-10', 6000.00),
(4, 4, 'Sakura Tanaka', '2025-03-01', '2025-03-07', 10000.00),
(5, 5, 'Noah Patel', '2025-03-15', '2025-03-22', 9000.00),
(6, 6, 'Sophia Singh', '2025-04-05', '2025-04-10', 7000.00),
(7, 2, 'Arjun Reddy', '2025-04-15', '2025-04-20', 12000.00),
(8, 1, 'Olivia Sharma', '2025-05-01', '2025-05-05', 35000.00),
(9, 5, 'Ethan Brown', '2025-06-01', '2025-06-10', 14000.00),
(10, 3, 'Maya Khan', '2025-06-15', '2025-06-20', 5000.00),
(11, 6, 'Rajiv Menon', '2025-07-01', '2025-07-05', 6000.00);

--- Query Tasks
--- Basic Queries
--- 1. Show all trips to destinations in “India”.
SELECT * FROM  Destinations WHERE country="India";

--- 2. List all destinations with an average cost below 3000.
SELECT  * FROM Destinations WHERE avg_cost_per_day < 3000;

--- Date & Duration
--- 3. Calculate the number of days for each trip.
SELECT * ,datediff(end_date,start_date) AS no_of_days FROM Trips; 

--- 4. List all trips that last more than 7 days.
SELECT * ,datediff(end_date,start_date) AS no_of_days FROM Trips WHERE datediff(end_date,start_date) >=7; 

--- JOIN + Aggregation
--- 5. List traveler name, destination city, and total trip cost (duration ×avg_cost_per_day).
SELECT t.traveler_name,d.city,(DATEDIFF(t.end_date, t.start_date) + 1) * d.avg_cost_per_day AS total_trip_cost
FROM Trips t
JOIN Destinations d ON t.destination_id = d.destination_id;



--- 6. Find the total number of trips per country.
SELECT d.country, COUNT(*) AS total_trips
FROM Trips t
JOIN Destinations d ON t.destination_id = d.destination_id
GROUP BY d.country;


--- Grouping & Filtering
--- 7. Show average budget per country.
SELECT d.country, AVG(t.budget) AS avg_budget
FROM Trips t
JOIN Destinations d ON t.destination_id = d.destination_id
GROUP BY d.country;


--- 8. Find which traveler has taken the most trips.
SELECT traveler_name, COUNT(*) AS trip_count
FROM Trips
GROUP BY traveler_name
ORDER BY trip_count DESC
LIMIT 1;


--- Subqueries
--- 9. Show destinations that haven’t been visited yet.
SELECT * 
FROM Destinations
WHERE destination_id NOT IN (
    SELECT DISTINCT destination_id FROM Trips
);


--- 10. Find the trip with the highest cost per day.
SELECT trip_id, traveler_name, budget / (DATEDIFF(end_date, start_date) + 1) AS cost_per_day
FROM Trips
ORDER BY cost_per_day DESC
LIMIT 1;

--- Update & Delete
--- 11. Update the budget for a trip that was extended by 3 days.
UPDATE Trips
SET budget = budget + (
    SELECT avg_cost_per_day * 3 
    FROM Destinations 
    WHERE Destinations.destination_id = Trips.destination_id
)
WHERE trip_id = 1;


--- 12. Delete all trips that were completed before Jan 1, 2023.
DELETE FROM Visits
WHERE visit_date < '2024-02-01';
