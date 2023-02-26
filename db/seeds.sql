INSERT INTO department
    (name)
VALUES
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');


INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Software Engineer', 80000, 1),
    ('Salesperson', 65000, 2),
    ('Lawyer', 180000, 3),
    ('Accountant', 100000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Donovan', 'Mitchell', 1, 1),
    ('Darius', 'Garland', 2, 4),
    ('Jarrett', 'Allen', 3, 2),
    ('Evan', 'Mobley', 4, 3); 



