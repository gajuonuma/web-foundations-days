
# School Database Design

## 1. Tables

### Students

The `students` table stores each student's unique ID, name and email address. The student ID is the primary key, while the email address is required and unique so that two students cannot register with the same email.

### Courses

The `courses` table stores each course's unique ID, name and course code. Both the course name and course code are required, and the course code is unique to identify each course.

### Enrolments

The `enrolments` table records which student takes which course and the grade obtained. It contains foreign keys referencing the `students` and `courses` tables. Its unique constraint on `(student_id, course_id)` prevents duplicate enrolments for the same student and course. The grade can be NULL when a student has not yet received a grade.

## 2. Relationships

### One-to-many relationships

A student can have many enrolments, but each enrolment belongs to one student. Therefore, `students` and `enrolments` have a one-to-many relationship.

A course can also have many enrolments, but each enrolment belongs to one course. Therefore, `courses` and `enrolments` have a one-to-many relationship.

### Many-to-many relationship

Students and courses have a many-to-many relationship because one student can take several courses, and one course can have several students.

The `enrolments` table acts as a join table between students and courses. Without it, we would have difficulty representing multiple courses per student and multiple students per course without repeating data or creating inflexible columns. The join table also stores information about the relationship itself, such as the student's grade.

## 3. Index

I would add an index on `enrolments(course_id)` to help queries that retrieve students enrolled on a particular course and queries that group enrolments by course. This can improve lookup performance as the number of enrolments grows.

SQLite automatically creates indexes for primary keys and UNIQUE constraints, but a separate index on `course_id` is still useful because the existing composite UNIQUE constraint begins with `student_id`.

Example:

```sql
CREATE INDEX idx_enrolments_course_id
ON enrolments(course_id);
```

## 4. SQL or NoSQL?

I would choose a relational SQL database for this school system because students, courses and enrolments have clear relationships and require reliable data integrity. Primary keys, foreign keys, unique constraints and joins help prevent invalid records and retrieve related information accurately. SQL is also well suited to counting enrolments, listing courses by student, and updating grades. A NoSQL database could be appropriate for a system with highly variable or document-based data, but a relational database is the more straightforward choice for this structured school enrolment system.
