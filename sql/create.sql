
Mechanics1_FreeMySql
create table user
(
	id int auto_increment not null primary key, 
	email varchar(255), 
	password varchar(255)
);

create table assetMaster
(
	id int auto_increment not null primary key, 
    hierarchyTypeId int, 
    masterId int, 
    classId int, 
    name varchar(255), 
    description varchar(255), 
    serial varchar(255), 
    registration varchar(255), 
    acquisitionDate datetime, 
    serviceDate datetime, 
    retirementDate datetime, 
    purchasePrice float(10,2),
    purchaseOrderNumber varchar(255), 
    creatorId int 
);

create table assettracking
(
	trackingid int auto_increment not null primary key,
	assetid int not null,
    eventtypeid int not null, 
    issuerid int not null, 
    userid int not null, 
    locationid int, 
    responsibleperson int
);

create table eventtype
(
	eventtypeid int auto_increment not null primary key, 
    description varchar(255)
);

create table hierarchyType
(
	id int not null primary key, 
    description varchar(255)
);

create table assetClass
(
	classid int not null primary key, 
    description varchar(255)
);

insert into hierarchyType
select 1, 'Master'
union all 
select 2, 'Component';

insert into assetClass
select 1, 'TestClass1'
union all 
select 2, 'TestClass2'
union all 
select 3, 'TestClass3';

insert into eventtype
select 1, 'Sell'
union all 
select 2, 'Scrap'
union all
select 3, 'Transfer';

select * from assetmaster order by id desc;

select * from user;