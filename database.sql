-- Database: elearning_skillconnect

-- Create Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'mentor', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Mentors Table
CREATE TABLE mentors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    expertise VARCHAR(255) NOT NULL,
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Courses Table
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    mentor_id INT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE SET NULL
);

-- Create Enrollments Table
CREATE TABLE enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY user_course (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Create Subscribers Table (for newsletter)
CREATE TABLE subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Basic sample data (for demonstration)
INSERT INTO users (name, email, password_hash, role) VALUES 
('Admin User', 'admin@totc.com', '$2y$10$Q4Q2x5xL4jV1H8Z2d1J8J.iV8YV0X.qQ6P4vT6kL8tX1E0L7o3', 'admin'), -- Password: adminpassword
('John Doe', 'john.doe@totc.com', '$2y$10$L1J3w9W7K6G5A4H3F2D1C0B9A8V7U6T5S4R3Q2P1O0I9U8Y7T6R5E4W3Q', 'mentor'); -- Password: mentorpassword

INSERT INTO mentors (user_id, expertise, bio) VALUES
((SELECT id FROM users WHERE email='john.doe@totc.com'), 'Web Development, React, Node.js', 'Experienced developer and educator passionate about teaching modern web technologies.');

INSERT INTO courses (title, description, mentor_id, image_url) VALUES
('The Complete Web Developer', 'Master HTML, CSS, JavaScript, and Backend PHP/MySQL.', (SELECT id FROM mentors LIMIT 1), 'img/course1.jpg'),
('Data Science with Python', 'Learn data analysis, visualization, and machine learning.', (SELECT id FROM mentors LIMIT 1), 'img/course2.jpg');