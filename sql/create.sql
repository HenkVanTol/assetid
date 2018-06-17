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

create table hierarchyType
(
	id int not null primary key, 
    description varchar(255)
);

insert into hierarchyType
select 1, 'Master'
union all 
select 2, 'Component';