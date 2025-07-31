-- Migration file to reflect schema changes

-- Step 1: Remove the PaypalCustomer table and its foreign key constraints
ALTER TABLE paypal_customers DROP CONSTRAINT IF EXISTS paypal_customers_student_id_fkey;

DROP TABLE IF EXISTS paypal_customers;

-- Step 2: Remove the paypalCustomer relation field from the Profile model
-- (No direct database change required since it was a relation, and the related table is dropped)

-- Step 3: Create the new many-to-many relation table for saved_courses and savedBy
CREATE TABLE _SavedCourses (
    A UUID NOT NULL,
    B UUID NOT NULL,
    CONSTRAINT _SavedCourses_A_fkey FOREIGN KEY (A) REFERENCES profiles(id) ON DELETE CASCADE,
    CONSTRAINT _SavedCourses_B_fkey FOREIGN KEY (B) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT _SavedCourses_AB_unique UNIQUE (A, B)
);

CREATE INDEX _SavedCourses_B_index ON _SavedCourses (B);