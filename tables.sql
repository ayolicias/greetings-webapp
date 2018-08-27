create table users(
  id serial not null primary key,
  users_greeted varchar(100)not null,
  user_language text not null
);
create table countGreet(
  count int not null,
  foreign key (count)references users(id)
);
