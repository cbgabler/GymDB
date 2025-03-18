SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS memberships;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS equipment;

-- 1. Members table
CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE, -- Users should not sign up under the same email
    phone VARCHAR(15) NOT NULL UNIQUE, -- Users should not sign up under the same phone
    date_joined DATE NOT NULL
);

-- 2. Employees table
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL UNIQUE,
    position VARCHAR(50) NOT NULL
);

-- 3. Equipment table
CREATE TABLE equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    quantity INT DEFAULT 1 CHECK (quantity > 0), -- Quantity should be 1 or greater than 1
    price DECIMAL(10, 2),
    purchase_date DATE,
    seller VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT
);

-- 4. Classes table
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL,
    description TEXT,
    duration VARCHAR(20) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    class_category VARCHAR(50),
    class_date DATE NOT NULL,
    equipment_id INT,
    employee_id INT,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- 5. Memberships table
CREATE TABLE memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2),
    duration VARCHAR(20) NOT NULL,
    guest_passes INT DEFAULT 0 CHECK (guest_passes >= 0),
    signup_fee DECIMAL(10, 2) DEFAULT 0.00 CHECK (signup_fee >= 0),
    class_id INT,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
);

-- 6. Feedback table
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    feedback_content TEXT NOT NULL,
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- Default test data
INSERT INTO members (name, email, phone, date_joined) VALUES
('John Doe', 'johndoe@example.com', '555-1234', '2023-01-15'),
('Jane Smith', 'janesmith@example.com', '555-5678', '2023-03-22'),
('Mike Johnson', 'mikejohnson@example.com', '555-8765', '2022-11-10'),
('Emily Davis', 'emilydavis@example.com', '555-4321', '2024-01-05'),
('Chris Wilson', 'chriswilson@example.com', '555-9876', '2023-08-19');


INSERT INTO employees (name, email, phone, position) VALUES
('Sarah Lee', 'sarahlee@example.com', '555-1122', 'Trainer'),
('Tom Brown', 'tombrown@example.com', '555-3344', 'Manager'),
('Linda Green', 'lindagreen@example.com', '555-5566', 'Yoga Instructor'),
('David White', 'davidwhite@example.com', '555-7788', 'Personal Trainer'),
('Emma Scott', 'emmascott@example.com', '555-9900', 'Receptionist');

INSERT INTO equipment (name, description, quantity, price, purchase_date, seller, is_active, notes) VALUES
('Treadmill', 'Electric treadmill with adjustable speed', 3, 1200.00, '2022-06-15', 'FitnessGear Inc.', TRUE, 'Monthly maintenance required'),
('Dumbbells', 'Set of 5-50 lb dumbbells', 10, 500.00, '2023-02-10', 'WeightCo', TRUE, 'In order'),
('Yoga Mats', 'Yoga mats', 15, 20.00, '2024-01-20', 'YogaSupply', TRUE, 'Replace every 6 months'),
('Stationary Bike', 'Indoor cycling bike', 2, 800.00, '2023-07-30', 'SpinPro', FALSE, 'Currently under repair'),
('Bench Press', 'Adjustable weight bench with rack', 4, 300.00, '2022-09-12', 'StrengthMax', TRUE, 'Used daily');

INSERT INTO classes (class_name, description, duration, capacity, class_category, class_date, equipment_id, employee_id) VALUES
('Cardio Blast', 'High-intensity cardio workout', '45 min', 20, 'Fitness', '2024-03-01', 
    (SELECT id FROM equipment WHERE name = 'Treadmill' LIMIT 1), 
    (SELECT id FROM employees WHERE name = 'Sarah Lee' LIMIT 1)),
('Strength Training', 'Weightlifting techniques and endurance', '60 min', 15, 'Strength', '2024-03-02', 
    (SELECT id FROM equipment WHERE name = 'Dumbbells' LIMIT 1), 
    (SELECT id FROM employees WHERE name = 'Tom Brown' LIMIT 1)),
('Yoga Basics', 'Beginner-friendly yoga poses', '50 min', 10, 'Wellness', '2024-03-03', 
    (SELECT id FROM equipment WHERE name = 'Yoga Mats' LIMIT 1), 
    NULL), -- No employee
('Spin Class', 'High-energy indoor cycling session', '45 min', 18, 'Fitness', '2024-03-04', 
    (SELECT id FROM equipment WHERE name = 'Stationary Bike' LIMIT 1), 
    (SELECT id FROM employees WHERE name = 'David White' LIMIT 1)),
('Pilates Core', 'Core-focused pilates workout', '55 min', 12, 'Wellness', '2024-03-05', 
    NULL,  -- No equipment 
    (SELECT id FROM employees WHERE name = 'Linda Green' LIMIT 1));

INSERT INTO memberships (name, price, duration, guest_passes, signup_fee, renewable, class_id) VALUES
('Basic Plan', 29.99, '1 month', 2, 10.00, TRUE, 
    (SELECT id FROM classes WHERE class_name = 'Cardio Blast' LIMIT 1)),
('Standard Plan', 79.99, '3 months', 5, 20.00, TRUE, 
    (SELECT id FROM classes WHERE class_name = 'Strength Training' LIMIT 1)),
('Premium Plan', 149.99, '6 months', 10, 30.00, TRUE, 
    (SELECT id FROM classes WHERE class_name = 'Yoga Basics' LIMIT 1)),
('Yoga Pass', 50.00, '1 month', 0, 5.00, FALSE, 
    (SELECT id FROM classes WHERE class_name = 'Yoga Basics' LIMIT 1));

INSERT INTO feedback (member_id, feedback_content, feedback_date, rating) VALUES
((SELECT id FROM members WHERE name = 'John Doe' LIMIT 1), 
    'Great gym! The trainers are very helpful.', '2024-02-01 10:30:00', 5),
((SELECT id FROM members WHERE name = 'Jane Smith' LIMIT 1), 
    'Loved the yoga classes, but the mats could be cleaner.', '2024-01-15 14:45:00', 4),
((SELECT id FROM members WHERE name = 'Mike Johnson' LIMIT 1), 
    'The equipment is well-maintained.', '2024-01-20 09:10:00', 5),
((SELECT id FROM members WHERE name = 'Emily Davis' LIMIT 1), 
    'Small, but good selection of classes', '2024-02-05 16:20:00', 3),
((SELECT id FROM members WHERE name = 'Chris Wilson' LIMIT 1), 
    'Friendly staff', '2024-02-10 11:00:00', 5);


SET FOREIGN_KEY_CHECKS=1;
COMMIT;
