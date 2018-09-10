drop table if exists users CASCADE;

create table users(
  id serial not null primary key,
  users_greeted varchar(100)not null unique,
  user_language text not null,
  counter int  Default 1
);
