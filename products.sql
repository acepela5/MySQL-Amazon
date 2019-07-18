drop database if exists bamazon_db;

create database bamazon_db;

use bamazon_db;

create table products (
item_id integer not null auto_increment,
product_name varchar(50) not null,
department_name varchar(50) not null,
price decimal (5,2) not null,
stock_quantity integer,
primary key (item_id)
);

insert into products (product_name, department_name, price, stock_quantity)
values ("Pulp Fiction", "Movies", 13.29, 20), ("Chocolate Gelato", "Desserts", 4.99, 35), ("Volcano Cakes", "Desserts", 7.49, 10), 
("Doritos", "Snacks", 3.95, 120), ("French Onion Dip", "Snacks", 2.95, 120), ("Lays Potatoe Chipd", "Snacks", 2.65, 120),
("Amelie", "Movies", 15.95, 20), ("Harry Potter", "Movies", 33.95, 50), ("Choco Taco", "Desserts", 0.95, 220), 
("Movie Theater Popcorn", "Snacks", 2.95, 200);