DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Macbook Pro", "Electronics", 1200, 10),
("Iphone X", "Electronics", 800, 3),
("White T-shirt", "Apparel", 10, 5),
("Black T-shirt", "Apparel", 11, 5),
("Tire Shine", "Automotive", 5, 4),
("Glass Cleaner", "Automotive", 4, 5),
("Multi-Vitamins", "Health", 12, 2),
("Whey Protein", "Health", 25, 5),
("Ray Ban Eye Glasses Frame", "Vision", 250, 2),
("Acuvue Contact Lenses (6-pack)", "Vision", 140, 2);

SELECT * FROM products;