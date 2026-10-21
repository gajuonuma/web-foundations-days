
-- Day 6 Assignment: A School Database
-- Database: SQLite

PRAGMA foreign_keys = ON;

-- 1. Create the students table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    student_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- 2. Create the courses table
CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY,
    course_name TEXT NOT NULL,
    course_code TEXT NOT NULL UNIQUE
);

-- 3. Create the enrolments table
-- This is a join table between students and courses.
CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE (student_id, course_id)
);

-- 4. Insert sample students
INSERT INTO students (student_id, student_name, email) VALUES
    (1, 'Ada Okafor', 'ada.okafor@example.com'),
    (2, 'Chidi Eze', 'chidi.eze@example.com'),
    (3, 'Ngozi Bello', 'ngozi.bello@example.com');

-- 5. Insert sample courses
INSERT INTO courses (course_id, course_name, course_code) VALUES
    (1, 'Database Fundamentals', 'DB101'),
    (2, 'Web Development', 'WEB101'),
    (3, 'Cloud Computing', 'CLD101');

-- 6. Insert at least five enrolments
INSERT INTO enrolments (enrolment_id, student_id, course_id, grade) VALUES
    (1, 1, 1, 'A'),
    (2, 1, 2, 'B'),
    (3, 2, 1, 'B'),
    (4, 2, 3, 'A'),
    (5, 3, 2, NULL);

-- QUERY 1: All courses taken by one student, selected by name.
SELECT
    s.student_name,
    c.course_name,
    c.course_code,
    e.grade
FROM students AS s
JOIN enrolments AS e ON s.student_id = e.student_id
JOIN courses AS c ON e.course_id = c.course_id
WHERE s.student_name = 'Ada Okafor'
ORDER BY c.course_name;

-- QUERY 2: All students enrolled on one course.
SELECT
    c.course_name,
    s.student_name,
    s.email,
    e.grade
FROM courses AS c
JOIN enrolments AS e ON c.course_id = e.course_id
JOIN students AS s ON e.student_id = s.student_id
WHERE c.course_code = 'WEB101'
ORDER BY s.student_name;

-- QUERY 3: Number of students enrolled on each course,
-- including courses with zero enrolments.
SELECT
    c.course_name,
    c.course_code,
    COUNT(e.student_id) AS student_count
FROM courses AS c
LEFT JOIN enrolments AS e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name, c.course_code
ORDER BY c.course_name;

-- QUERY 4: Students who have no enrolments.
SELECT
    s.student_id,
    s.student_name,
    s.email
FROM students AS s
LEFT JOIN enrolments AS e ON s.student_id = e.student_id
WHERE e.enrolment_id IS NULL
ORDER BY s.student_name;

-- QUERY 5: Update one enrolment's grade.
UPDATE enrolments
SET grade = 'A'
WHERE student_id = 3
  AND course_id = 2;

-- Display the updated enrolment to verify the change.
SELECT
    s.student_name,
    c.course_name,
    e.grade
FROM enrolments AS e
JOIN students AS s ON e.student_id = s.student_id
JOIN courses AS c ON e.course_id = c.course_id
WHERE e.student_id = 3
  AND e.course_id = 2;
