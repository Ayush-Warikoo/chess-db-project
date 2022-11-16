create table players (
  id int not null primary key auto_increment,
  name varchar(255) not null unique
);

create table games (
  id int not null primary key auto_increment,
  event varchar(255) not null,
  site varchar(255) not null,
  date date not null,
  main_time int not null check (0 <= main_time),
  increment_time int not null check (0 <= increment_time),
  white_id int not null,
  black_id int not null,
  white_elo int not null check (0 <= white_elo),
  black_elo int not null check (0 <= black_elo),
  result enum('white', 'black', 'draw') not null,
  eco_category enum('A', 'B', 'C', 'D', 'E'),
  eco_subcategory int check (0 <= eco_subcategory and eco_subcategory <= 99),
  plycount int not null check (0 <= plycount),

  constraint chk_total_time_neq_0 check (main_time + increment_time != 0),
  constraint fk_white_id foreign key (white_id) references players(id),
  constraint fk_black_id foreign key (black_id) references players(id),
  constraint chk_white_id_neq_black_id check (white_id != black_id)
);

create table positions (
  id int not null primary key auto_increment,
  game_id int not null,
  fen varchar(255) not null,
  move_number int not null check (0 < move_number),
  constraint fk_game_id foreign key (game_id) references games(id)
);

create index fen_index
on positions (fen)