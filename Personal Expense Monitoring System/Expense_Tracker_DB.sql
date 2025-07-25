CREATE DATABASE Expense_Tracker;
USE Expense_Tracker;

--- Create Tables
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE expenses (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    category_id INT,
    amount DECIMAL(10, 2),
    expense_date DATE,
    description VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

--- Inserting Values
-- Insert users
INSERT INTO users (name, email) VALUES
('Alice', 'alice@example.com'),
('Bob', 'bob@example.com');

-- Insert categories
INSERT INTO categories (name) VALUES
('Groceries'),
('Transport'),
('Entertainment'),
('Utilities');

-- Insert expenses
INSERT INTO expenses (user_id, category_id, amount, expense_date, description) VALUES
(1, 1, 1200.00, '2025-07-01', 'Monthly grocery shopping'),
(1, 2, 300.00, '2025-07-02', 'Bus pass'),
(1, 3, 500.00, '2025-07-10', 'Movie night'),
(2, 1, 900.00, '2025-07-03', 'Grocery'),
(2, 4, 1100.00, '2025-07-05', 'Electricity bill');

--- curd operation
INSERT INTO expenses (user_id, category_id, amount, expense_date, description)
VALUES (1, 1, 150.00, '2025-07-15', 'Fruits and vegetables');

UPDATE expenses
SET amount = 200.00, description = 'Weekly groceries'
WHERE expense_id = 1;

DELETE FROM expenses
WHERE expense_id = 2;

SELECT e.expense_id, u.name AS user, c.name AS category, e.amount, e.expense_date, e.description
FROM expenses e
JOIN users u ON e.user_id = u.user_id
JOIN categories c ON e.category_id = c.category_id
WHERE u.user_id = 1;
--- Stored Procedure
DELIMITER $$

CREATE PROCEDURE GetMonthlyCategoryExpenses (
    IN p_user_id INT,
    IN p_month INT,
    IN p_year INT
)
BEGIN
    SELECT 
        c.name AS category,
        SUM(e.amount) AS total_spent
    FROM expenses e
    JOIN categories c ON e.category_id = c.category_id
    WHERE e.user_id = p_user_id
      AND MONTH(e.expense_date) = p_month
      AND YEAR(e.expense_date) = p_year
    GROUP BY c.name;
END $$

DELIMITER ;

call GetMonthlyCategoryExpenses(1,7,2025);

