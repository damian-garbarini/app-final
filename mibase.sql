create database fullstack ;
use fullstack;
create table productos(
idProducto int unsigned not null auto_increment,
nombre varchar(60) not null,
precio int unsigned not null,
descripcion varchar(200),
primary key (idProducto)
);

