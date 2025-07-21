CREATE TABLE students (
student_id INT PRIMARY KEY,
name VARCHAR(100),
age INT,
gender VARCHAR(10),
department_id INT ,
foreign key (department_id) references department(department_id)
);
# departments
CREATE TABLE department (
department_id INT PRIMARY KEY,
department_name VARCHAR(100),
head_of_department VARCHAR(100)
);
#courses
CREATE TABLE courses (
course_id INT PRIMARY KEY,
course_name VARCHAR(100),
department_id INT,
credit_hours INT,
foreign key (department_id) references department(department_id)
);

# Data for Insertion
#students
INSERT INTO students VALUES
(1, 'Amit Sharma', 20, 'Male', 1),
(2, 'Neha Reddy', 22, 'Female', 2),
(3, 'Faizan Ali', 21, 'Male', 1),
(4, 'Divya Mehta', 23, 'Female', 3),
(5, 'Ravi Verma', 22, 'Male', 2);
#departments

INSERT INTO department VALUES
(1, 'Computer Science', 'Dr. Rao'),
(2, 'Electronics', 'Dr. Iyer'),
(3, 'Mechanical', 'Dr. Khan');
#courses
INSERT INTO courses VALUES
(101, 'Data Structures', 1, 4),
(102, 'Circuits', 2, 3),
(103, 'Thermodynamics', 3, 4),
(104, 'Algorithms', 1, 3),
(105, 'Microcontrollers', 2, 2);

#--Queries
#--Section A: Basic Queries
#--1. List all students with name, age, and gender.
select name,age,gender from students;

#--2. Show names of female students only.
select * from students where gender="female";

#--3. Display all courses offered by the Electronics department.
select c.course_name from courses c left join department  d on c.department_id=d.department_id where department_name="Electronics";

#--4. Show the department name and head for department_id = 1.
select * from department where department_id=1;

#--5. Display students older than 21 years.
select* from students where age >21; 

#--task 2
#--6. Show student names along with their department names.
select s.name,d.department_name from students s left join department d on s.department_id=d.department_id;

#--7. List all departments with number of students in each.
select d.department_name,count(s.student_id) as no_of_students from department d left join students s on s.department_id=d.department_id group by (d.department_id);

#--8. Find the average age of students per department.
select d.department_name,avg(s.age) as no_of_students from department d left join students s on s.department_id=d.department_id group by (d.department_id);


#--9. Show all courses with their respective department names.
select c.course_name ,d.department_name from courses c left join department d on c.department_id=d.department_id;

#--10. List departments that have no students enrolled.
select d.department_name from department d left join students s on s.department_id=d.department_id where s.student_id is null;

#--11. Show the department that has the highest number of courses.
select d.department_name,count(c.course_id) as number_of_courses from department d 
left join courses c on c.department_id=d.department_id 
group by d.department_name 
order by count(c.course_id)desc
Limit 1;

#--task 3
-- 12. Find names of students whose age is above the average age of all students.
SELECT * FROM students
WHERE age > (SELECT AVG(age) FROM students);

-- 13. Show all departments that offer courses with more than 3 credit hours.
SELECT d.department_name, c.course_name, c.credit_hours  FROM departments AS d
JOIN courses AS c
ON d.department_id = c.department_id
WHERE credit_hours > 3;

-- 14. Display names of students who are enrolled in the department with the fewest courses.
SELECT s.name FROM students s
WHERE s.department_id = (
  SELECT department_id 
  FROM courses 
  GROUP BY department_id 
  ORDER BY COUNT(*) 
  LIMIT 1
);


-- 15. List the names of students in departments where the HOD's name contains 'Dr.'.
SELECT s.name, d.head_of_department FROM students AS s
JOIN department AS d
ON s.department_id = d.department_id
WHERE d.head_of_department LIKE "Dr.%";

-- 16. Find the second oldest student (use subquery or LIMIT/OFFSET method).
SELECT name FROM students
WHERE age = (SELECT MAX(age) FROM students WHERE age < (SELECT MAX(age) FROM students));
SELECT * 
FROM students 
ORDER BY age DESC 
LIMIT 1 OFFSET 1;
-- 17. Show all courses that belong to departments with more than 2 students.
SELECT c.course_name FROM courses c
WHERE c.department_id IN (SELECT department_id FROM students GROUP BY department_id HAVING COUNT(*) > 2);
