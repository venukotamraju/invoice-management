CREATE DATABASE invoicemanagement;
CREATE TABLE products (
    product_id serial PRIMARY KEY,
    product_name VARCHAR UNIQUE NOT NULL,
    product_unit_type CHAR(5) NOT NULL,
    product_unit_cost VARCHAR NOT NULL,
    product_status BOOLEAN NOT NULL,
    product_available_quantity INTEGER NOT NULL,
    product_description VARCHAR
);
INSERT INTO 
    products (product_name,product_unit_type,product_unit_cost,product_status,product_available_quantity,product_description)
    VALUES
        ('sample_product_1','u',10,true,50,'measured in units'),
        ('sample_product_2','kg',5,true,20,'measured in kilograms'),
        ('sample_product_3','l',50,true,10,'measured in litres'),
        ('sample_product_4','u',80,true,5,'measured in units'),
        ('sample_product_5','u',10,true,20,'measured in units');
        
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_first_name VARCHAR NOT NULL,
    customer_last_name VARCHAR NOT NULL,
    customer_dob DATE NOT NULL,
    customer_address VARCHAR NOT NULL,
    customer_description VARCHAR NOT NULL,
    customer_reference_id VARCHAR NOT NULL,
);
INSERT INTO 
    customers (customer_first_name,customer_last_name,customer_dob,customer_address,customer_description,customer_reference_id)
    VALUES
        ('tese_first_name','test_last_name','test_dob','test_address','test_description',' 9f265cec-63e0-471e-8ec9-91724efe2b31')

CREATE TABLE lineitems (
    line_id INT GENERATED ALWAYS AS IDENTITY,
    line_item VARCHAR NOT NULL,
    line_item_quantity INT NOT NULL,
    line_amount VARCHAR NOT NULL,
    invoice_id INT NOT NULL,
    PRIMARY KEY(line_id),
    CONSTRAINT fk_invoice
        FOREIGN KEY(invoice_id)
        REFERENCES invoices(invoice_id)
        ON DELETE CASCADE
);

    


CREATE TABLE invoices (
    invoice_id INT GENERATED ALWAYS AS IDENTITY,
    customer_id INT NOT NULL,
    line_item_count INTEGER NOT NULL,
    invoice_description VARCHAR NOT NULL,
    total_amount VARCHAR NOT NULL,
    generated_date DATE NOT NULL,
    due_date DATE NOT NULL,
    PRIMARY KEY (invoice_id),
    CONSTRAINT fk_customer
        FOREIGN KEY(customer_id)
        REFERENCES customers(customer_id)
        ON DELETE CASCADE   
);

CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY,
    user_name VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    PRIMARY KEY (user_id)
);
CREATE TABLE company (
    company_id INT GENERATED ALWAYS AS IDENTITY,
    company_name VARCHAR NOT NULL,
    company_address VARCHAR NOT NULL,
    company_contact_no VARCHAR NOT NULL,
    company_gst_no VARCHAR NOT NULL,
    PRIMARY KEY (company_id)
);
CREATE TABLE employees (
    employee_id INT GENERATED ALWAYS AS IDENTITY,
    company_id INT NOT NULL,
    employee_first_name VARCHAR NOT NULL,
    employee_last_name VARCHAR NOT NULL,
    employee_dob DATE NOT NULL, 
    employee_contact VARCHAR NOT NULL,
    employee_reg_id VARCHAR NOT NULL,
    employee_email VARCHAR NOT NULL,
    employee_password VARCHAR NOT NULL,
    PRIMARY KEY (employee_id),
    CONSTRAINT fk_company
        FOREIGN KEY(company_id)
        REFERENCES company(company_id)
        ON DELETE CASCADE
);