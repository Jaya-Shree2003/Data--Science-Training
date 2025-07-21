#--Creating Table

CREATE TABLE employees (
emp_id INT PRIMARY KEY,
emp_name VARCHAR(100),
department VARCHAR(50),
salary INT,
age INT,
dept_id int ,
foreign key(dept_id) references departments(dept_id)
);
drop table employees;
CREATE TABLE departments (
dept_id INT PRIMARY KEY,
dept_name VARCHAR(50),
location VARCHAR(50)
);

#--Inserting values
INSERT INTO employees VALUES
(101, 'Amit Sharma', 'Engineering', 60000, 30,1),
(102, 'Neha Reddy', 'Marketing', 45000, 28,2),
(103, 'Faizan Ali', 'Engineering', 58000, 32,1),
(104, 'Divya Mehta', 'HR', 40000, 29,3),
(105, 'Ravi Verma', 'Sales', 35000, 26,4);

INSERT INTO departments VALUES
(1, 'Engineering', 'Bangalore'),
(2, 'Marketing', 'Mumbai'),
(3, 'HR', 'Delhi'),
(4, 'Sales', 'Chennai');

INSERT INTO departments VALUES
(5, 'Engineering Science', 'Bangalore');

#--Queries
select * from employees;

select emp_name,salary from employees;

select * from employees where salary >40000;

select * from employees where age between 28 and 32;

select * from employees where department<> 'HR';

Select * from employees order by salary desc;

select count(emp_id) as no_of_employees from employees;

select * from  employees where salary=(select max(salary) from employees);

#--task 2

select e.emp_name,d.dept_name,d.location from employees e left join 
departments d on d.dept_id=e.dept_id;

select d.dept_name,count(e.emp_id) as no_of_employees from departments d left join employees e on e.dept_id=d.dept_id group by(d.dept_name);

select d.dept_name,avg(e.salary) as average_salary from departments d left join employees e on e.dept_id=d.dept_id group by(d.dept_name);

select d.dept_name from departments d left join employees e on e.dept_id=d.dept_id where emp_id is null;

select d.dept_name,sum(e.salary) as Total_salary from departments d left join employees e on e.dept_id=d.dept_id group by(d.dept_name);

select d.dept_name,avg(e.salary) as average_salary from departments d left join employees e on e.dept_id=d.dept_id group by(d.dept_name) having avg(salary)>4500;

select e.emp_name,d.dept_name from departments d left join employees e on e.dept_id=d.dept_id where e.salary >50000;






