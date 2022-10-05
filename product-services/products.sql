create extension if not exists "uuid-ossp";

create table products (id uuid primary key default uuid_generate_v4(), title text not null, description text, price integer);

create table stocks (product_id uuid, count integer,foreign key ("product_id") references "products" ("id"));

insert into products (title, description, price)
values ('MILK COMPRESSION', 'compression', 10), 
('DISNEY STAR WARS', 'cushioned', 20);

insert into stocks (product_id, count)
values ('69', 1), 
('99', 2);
