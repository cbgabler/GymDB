-- Gym Database Data Manipulation Queries
-- Variables are denoted using the `:paramName` syntax

-- 1. Retrieve all gym members
SELECT id, name, email, phone, date_joined FROM members;

-- 2. Retrieve a single member's details
SELECT id, name, email, phone, date_joined 
FROM members 
WHERE id = :id;

-- 3. Add a new gym member
INSERT INTO members (name, email, phone, date_joined) 
VALUES (:name, :email, :phone, :date_joined);

-- 4. Update an existing gym member
UPDATE members 
SET name = :name, 
    email = :email, 
    phone = :phone
WHERE id = :id;

-- 5. Delete a gym member
DELETE FROM members WHERE id = :id;

-- 6. Retrieve all employees
SELECT id, name, email, phone, position FROM employees;

-- 7. Retrieve a single employee's details
SELECT id, name, email, phone, position 
FROM employees 
WHERE id = :id;

-- 8. Add a new employee
INSERT INTO employees (name, email, phone, position) 
VALUES (:name, :email, :phone, :position);

-- 9. Update an existing employee
UPDATE employees 
SET name = :name, 
    email = :email, 
    phone = :phone,
    position = :position
WHERE id = :id;

-- 10. Delete an employee
DELETE FROM employees WHERE id = :id;

-- 11. Retrieve all equipment
SELECT id, name, description, quantity, price, purchase_date, seller, is_active, notes 
FROM equipment;

-- 12. Add new equipment
INSERT INTO equipment (name, description, quantity, price, purchase_date, seller, is_active, notes) 
VALUES (:name, :description, :quantity, :price, :purchase_date, :seller, :is_active, :notes);

-- 13. Update equipment details
UPDATE equipment 
SET name = :name, 
    description = :description, 
    quantity = :quantity,
    price = :price, 
    purchase_date = :purchase_date,
    seller = :seller, 
    is_active = :is_active, 
    notes = :notes 
WHERE id = :id;

-- 14. Delete equipment
DELETE FROM equipment WHERE id = :id;

-- 15. Retrieve all gym classes with instructor names
SELECT 
    c.id AS class_id, 
    c.class_name, 
    e.name AS instructor_name, 
    c.class_date AS schedule, 
    c.capacity 
FROM classes c
LEFT JOIN employees e ON c.employee_id = e.id;

-- 16. Retrieve gym classes for a specific date
SELECT c.id AS class_id, 
       c.class_name, 
       e.name AS instructor_name, 
       c.class_date AS schedule, 
       c.capacity 
FROM classes c
LEFT JOIN employees e ON c.employee_id = e.id
WHERE DATE(c.class_date) = :class_date;

-- 17. Add a new class
INSERT INTO classes (class_name, description, duration, capacity, class_category, class_date, equipment_id, employee_id) 
VALUES (:class_name, :description, :duration, :capacity, :class_category, :class_date, :equipment_id, :employee_id); 

-- 18. Update class details
UPDATE classes 
SET class_name = :class_name, 
    description = :description,
    duration = :duration,
    capacity = :capacity,
    class_category = :class_category,
    class_date = :class_date,
    equipment_id = :equipment_id,
    employee_id = :employee_id
WHERE id = :class_id;

-- 19. Delete a class
DELETE FROM classes WHERE id = :class_id;

-- 20. Retrieve all memberships
SELECT id, name, price, duration, guest_passes, signup_fee, renewable, class_id 
FROM memberships;

-- 21. Add a new membership
INSERT INTO memberships (name, price, duration, guest_passes, signup_fee, renewable, class_id) 
VALUES (:name, :price, :duration, :guest_passes, :signup_fee, :renewable, :class_id);

-- 22. Update membership details
UPDATE memberships 
SET name = :name, 
    price = :price, 
    duration = :duration,
    guest_passes = :guest_passes,
    signup_fee = :signup_fee,
    renewable = :renewable,
    class_id = :class_id
WHERE id = :id;

-- 23. Delete a membership
DELETE FROM memberships WHERE id = :id;

-- 24. Retrieve all feedback from members
SELECT id, member_id, feedback_content, feedback_date, rating 
FROM feedback;

-- 25. Add new feedback
INSERT INTO feedback (member_id, feedback_content, rating, feedback_date) 
VALUES (:member_id, :feedback_content, :rating, NOW());

-- 26. Update feedback details
UPDATE feedback 
SET feedback_content = :feedback_content, 
    rating = :rating 
WHERE id = :id;

-- 27. Delete feedback
DELETE FROM feedback WHERE id = :id;
