-- Gym Database Data Manipulation Queries
-- Variables are denoted using the `:paramName` syntax

-- 1. Retrieve all gym members
SELECT member_id, first_name, last_name, email, phone, membership_id 
FROM members;

-- 2. Retrieve a single member's details
SELECT member_id, first_name, last_name, email, phone, membership_id 
FROM members 
WHERE member_id = :member_id;

-- 3. Add a new gym member
INSERT INTO members (name, email, phone, date_joined) 
VALUES (:name, :email, :phone, :date_joined);

-- 4. Update an existing gym member
UPDATE members 
SET first_name = :first_name, 
    last_name = :last_name, 
    email = :email, 
    phone = :phone, 
    membership_id = :membership_id 
WHERE member_id = :member_id;

-- 5. Delete a gym member
DELETE FROM members WHERE id = id;

-- 6. Retrieve all employees
SELECT employee_id, first_name, last_name, role, email, phone 
FROM employees;

-- 7. Retrieve a single employee's details
SELECT employee_id, first_name, last_name, role, email, phone 
FROM employees 
WHERE employee_id = :employee_id;

-- 8. Add a new employee
INSERT INTO employees (first_name, last_name, role, email, phone) 
VALUES (:first_name, :last_name, :role, :email, :phone);

-- 9. Update an existing employee
UPDATE employees 
SET first_name = :first_name, 
    last_name = :last_name, 
    role = :role, 
    email = :email, 
    phone = :phone 
WHERE employee_id = :employee_id;

-- 10. Delete an employee
DELETE FROM employees WHERE employee_id = :employee_id;

-- 11. Retrieve all equipment
SELECT equipment_id, name, type, status FROM equipment;

-- 12. Add new equipment
INSERT INTO equipment (name, type, status) 
VALUES (:name, :type, :status);

-- 13. Update equipment details
UPDATE equipment 
SET name = :name, 
    type = :type, 
    status = :status 
WHERE equipment_id = :equipment_id;

-- 14. Delete equipment
DELETE FROM equipment WHERE equipment_id = :equipment_id;


-- Retreive classes
SELECT class_name, duration, class_date, employee_id FROM classes;
-- 15. Retrieve all gym classes
-- Retrieve all gym classes with instructor names
SELECT 
    c.id AS class_id, 
    c.class_name, 
    e.name AS instructor_name, 
    c.class_date AS schedule, 
    c.capacity 
FROM classes c
LEFT JOIN employees e ON c.employee_id = e.id;

-- Retrieve gym classes for a specific date
SELECT c.id AS class_id, 
       c.class_name, 
       e.name AS employee_name, 
       c.class_date AS schedule, 
       c.capacity 
FROM classes c
LEFT JOIN employees e ON c.employee_id = e.id
WHERE DATE(c.class_date) = ?


-- 16. Add a new class
INSERT INTO classes (class_name, instructor_id, schedule, capacity) 
VALUES (:class_name, :instructor_id, :schedule, :capacity);

-- 17. Update class details
UPDATE classes 
SET class_name = :class_name, 
    instructor_id = :instructor_id, 
    schedule = :schedule, 
    capacity = :capacity 
WHERE class_id = :class_id;

-- 18. Delete a class
DELETE FROM classes WHERE class_id = :class_id;

-- 19. Retrieve all memberships
SELECT membership_id, type, price, duration 
FROM memberships;

-- 20. Add a new membership
INSERT INTO memberships (type, price, duration) 
VALUES (:type, :price, :duration);

-- 21. Update membership details
UPDATE memberships 
SET type = :type, 
    price = :price, 
    duration = :duration 
WHERE membership_id = :membership_id;

-- 22. Delete a membership
DELETE FROM memberships WHERE membership_id = :membership_id;

-- 23. Retrieve all feedback from members
SELECT feedback_id, member_id, comments, rating, submitted_at 
FROM feedback;

-- 24. Add new feedback
INSERT INTO feedback (member_id, comments, rating, submitted_at) 
VALUES (:member_id, :comments, :rating, NOW());

-- 25. Update feedback details
UPDATE feedback 
SET comments = :comments, 
    rating = :rating 
WHERE feedback_id = :feedback_id;

-- 26. Delete feedback
DELETE FROM feedback WHERE feedback_id = :feedback_id;
