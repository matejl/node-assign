
create database node-assign;

create table user
(
	user_id int auto_increment
		primary key,
	username varchar(64) not null,
	password_hash varchar(32) not null
)
;

create table user_like
(
	user_id int not null,
	like_user_id int not null,
	primary key (user_id, like_user_id),
	constraint user_like_user_user_id_fk
		foreign key (user_id) references user (user_id),
	constraint user_like_user_user_id_fk_2
		foreign key (like_user_id) references user (user_id)
)
;

