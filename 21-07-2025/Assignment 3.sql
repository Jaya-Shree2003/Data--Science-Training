CREATE DATABASE Bookstore;
USE Bookstore;


CREATE TABLE books (
  book_id INT PRIMARY KEY,
  title VARCHAR(100),
  author VARCHAR(100),
  genre VARCHAR(50),
  price DECIMAL(10, 2)
);

CREATE TABLE customers (
  customer_id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  city VARCHAR(100)
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  customer_id INT,
  book_id INT,
  order_date DATE,
  quantity INT,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY (book_id) REFERENCES books(book_id)
);

-- PART 2: Insert Sample Data

INSERT INTO books VALUES
(1, 'The Power of Now', 'Eckhart Tolle', 'Self-help', 650.00),
(2, 'Introduction to Algorithms', 'Thomas H. Cormen', 'Programming', 1250.00),
(3, 'Pride and Prejudice', 'Jane Austen', 'Fiction', 480.00),
(4, 'Deep Work', 'Cal Newport', 'Self-help', 720.00),
(5, 'Python Crash Course', 'Eric Matthes', 'Programming', 950.00);

INSERT INTO customers VALUES
(1, 'Jaya', 'jaya@gmail.com', 'Chennai'),
(2, 'Shree', 'shree@example.com', 'Delhi'),
(3, 'Anu', 'anu@example.com', 'Mumbai'),
(4, 'Jayashree', 'jayashree@example.com', 'Bangalore'),
(5, 'harini', 'harini@gmail.com', 'Chennai');

INSERT INTO orders VALUES
(1, 1, 2, '2023-03-21', 1), 
(2, 2, 1, '2023-04-25', 2),
(3, 3, 3, '2023-03-05', 1),
(4, 4, 2, '2023-06-12', 1),
(5, 5, 5, '2023-01-12', 3),
(6, 1, 4, '2023-06-24', 1),  
(7, 2, 3, '2023-07-01', 2);

-- Queries
--  Write and Execute Queries

-- 1. List all books with price above 500.
SELECT * FROM books WHERE price > 500;

-- 2. Show all customers from the city of ‘Hyderabad’.
SELECT * FROM customers WHERE city = "Hyderabad";

-- 3. Find all orders placed after ‘2023-01-01’.
SELECT * FROM orders WHERE order_date > 2023-01-01;

-- Joins & Aggregations

-- 4. Show customer names along with book titles they purchased.
SELECT c.name AS customer_name, b.title AS book_title FROM orders AS o
JOIN customers AS c 
ON o.customer_id = c.customer_id
JOIN books AS b 
ON o.book_id = b.book_id;

-- 5. List each genre and total number of books sold in that genre.
SELECT b.genre, SUM(o.quantity) AS tot_books_sold FROM orders AS o
JOIN books AS b 
ON o.book_id = b.book_id
GROUP BY b.genre;

-- 6. Find the total sales amount (price × quantity) for each book.
SELECT b.title, SUM(b.price * o.quantity) AS total_sales FROM orders AS o
JOIN books AS b 
ON o.book_id = b.book_id
GROUP BY b.title;

-- 7. Show the customer who placed the highest number of orders.
SELECT c.name, COUNT(o.order_id) AS highest_orders FROM orders AS o
JOIN customers AS c 
ON o.customer_id = c.customer_id
GROUP BY c.name
ORDER BY highest_orders DESC
LIMIT 1;

-- 8. Display average price of books by genre.
SELECT genre, AVG(price) AS avg_price FROM books
GROUP BY genre;

-- 9. List all books that have not been ordered.
SELECT * FROM books
WHERE book_id NOT IN (SELECT DISTINCT book_id FROM orders);

-- 10. Show the name of the customer who has spent the most in total.
SELECT c.name, SUM(b.price * o.quantity) AS tot_spt FROM orders AS o
JOIN customers AS c 
ON o.customer_id = c.customer_id
JOIN books AS b 
ON o.book_id = b.book_id
GROUP BY c.name
ORDER BY tot_spt DESC
LIMIT 1;

