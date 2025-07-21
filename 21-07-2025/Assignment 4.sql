CREATE DATABASE Movie_System;
USE Movie_System;
 

CREATE TABLE movies (
    movie_id INT PRIMARY KEY,
    title VARCHAR(100),
    genre VARCHAR(50),
    release_year INT,
    rental_rate DECIMAL(5,2)
);

CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    city VARCHAR(50)
);

CREATE TABLE rentals (
    rental_id INT PRIMARY KEY,
    customer_id INT,
    movie_id INT,
    rental_date DATE,
    return_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

--  Data Insertion

INSERT INTO movies (movie_id, title, genre, release_year, rental_rate) VALUES
(1, 'Harry Potter and the Sorcerer\'s Stone', 'Fantasy', 2001, 3.99),
(2, 'Harry Potter and the Chamber of Secrets', 'Fantasy', 2002, 3.99),
(3, 'The Chronicles of Narnia: The Lion, the Witch and the Wardrobe', 'Fantasy', 2005, 4.49),
(4, 'Frozen', 'Animation', 2013, 4.99),
(5, 'Moana', 'Animation', 2016, 4.99);


INSERT INTO customers (customer_id, name, email, city) VALUES
(1, 'Amit Sharma', 'amit.sharma@example.com', 'Delhi'),
(2, 'Neha Joshi', 'neha.joshi@example.com', 'Mumbai'),
(3, 'Arjun Mehta', 'arjun.mehta@example.com', 'Bangalore'),
(4, 'Divya Nair', 'divya.nair@example.com', 'Hyderabad'),
(5, 'Vikram Iyer', 'vikram.iyer@example.com', 'Chennai');

INSERT INTO rentals (rental_id, customer_id, movie_id, rental_date, return_date) VALUES
(1, 2, 1, '2025-07-01', '2025-07-03'),
(2, 4, 2, '2025-07-02', '2025-07-04'),
(3, 5, 3, '2025-07-03', NULL), 
(4, 3, 4, '2025-07-04', '2025-07-06'),
(5, 1, 5, '2025-07-05', '2025-07-07'),
(6, 2, 3, '2025-07-06', '2025-07-08'),
(7, 1, 1, '2025-07-07', '2025-07-08'), 
(8, 3, 2, '2025-07-08', '2025-07-10');

-- SECTION 3: Query Execution
-- 1. Retrieve all movies rented by a customer named 'Amit Sharma'.
SELECT  m.title FROM rentals r JOIN
customers c ON c.customer_id=r.customer_id
JOIN movies m ON m.movie_id=r.movie_id 
WHERE c.name="Amit Sharma";

-- 2. Show the details of customers from 'Bangalore'.
SELECT * FROM customers
WHERE city = 'Bangalore';

-- 3. List all movies released after the year 2020.
SELECT * FROM movies
WHERE release_year > 2020;

-- Aggregate Queries

-- 4. Count how many movies each customer has rented.
SELECT c.customer_id,c.name,count(r.customer_id) as Moives_rented 
FROM rentals r JOIN customers c ON c.customer_id=r.customer_id
GROUP BY r.customer_id;

-- 5. Find the most rented movie title.
SELECT m.title,COUNT(r.movie_id) AS Most_Watched 
FROM rentals r
JOIN movies m ON 
r.movie_id=m.movie_id
GROUP BY r.movie_id
ORDER BY Most_Watched Desc
LIMIT 1;

-- 6. Calculate total revenue earned from all rentals.
SELECT SUM(m.rental_rate) AS total_revenue FROM rentals AS r
JOIN movies AS m 
ON r.movie_id = m.movie_id;

-- Advanced Queries
-- 7. List all customers who have never rented a movie.
SELECT c.* FROM customers AS c
LEFT JOIN rentals AS r 
ON c.customer_id = r.customer_id
WHERE r.rental_id IS NULL;

-- 8. Show each genre and the total revenue from that genre.
SELECT m.genre, SUM(m.rental_rate) AS revenue FROM rentals AS r
JOIN movies AS m 
ON r.movie_id = m.movie_id
GROUP BY m.genre;

-- 9. Find the customer who spent the most money on rentals.
SELECT c.name, SUM(m.rental_rate) AS total_spent FROM rentals AS r
JOIN customers AS c 
ON r.customer_id = c.customer_id
JOIN movies AS m 
ON r.movie_id = m.movie_id
GROUP BY c.name
ORDER BY total_spent DESC
LIMIT 1;

-- 10. Display movie titles that were rented and not yet returned ( return_date IS NULL ).
SELECT m.title FROM rentals AS r
JOIN movies AS m 
ON r.movie_id = m.movie_id
WHERE r.return_date IS NULL;
