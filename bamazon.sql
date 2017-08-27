DROP DATABASE IF EXISTS Bamazon;

CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE Products(
ItemID INTEGER AUTO_INCREMENT PRIMARY KEY,
ProductName VARCHAR(100),
DepartmentName VARCHAR(100),
Price DOUBLE(10,2),
StockQuantity INTEGER
);


INSERT INTO Products(ProductName, DepartmentName, Price, StockQuantity)
VALUES ("Bread", "Grocery", 1.50, 20),
  ("Football", "Outdoors", 9.99, 49),
  ("Google Home", "Electronics", 99.99, 3),
  ("PS4", "Electronics", 179.99, 7),
  ("Gone With the Wind", "Books", 11.99, 6),
  ("Milk", "Grocery", 3.99, 30),
  ("Camping Tent", "Outdoors", 150, 4),
  ("The Alchemist", "Books", 19.99, 33),
  ("Dish Washer", "Appliances", 399.99, 9),
  ("The Light Between Oceans ", "DVD", 13.99, 36),  
  ("Glass Houses", "Books", 9.99, 67),
  ("Divergent", "DVD", 9.99, 21);
  
  SELECT * FROM Products;