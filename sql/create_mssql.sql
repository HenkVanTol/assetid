USE [Multipick]
GO

/****** Object:  Table [ServiceBasedBilling].[Invoice]    Script Date: 29/03/2018 17:30:58 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING OFF
GO

CREATE TABLE [ServiceBasedBilling].[Invoice](
	[InvoiceID] [INT] IDENTITY(1,1) NOT NULL,
	[InvoiceNumber] [VARCHAR](100) NOT NULL,
	[ContractHeaderID] [INT] NOT NULL,
	[InvoiceStatusID] [INT] NOT NULL,
	[Value] [DECIMAL](18, 5) NULL,
	[DateRaised] [DATETIME] NULL,
	[DateIssued] [DATETIME] NULL,
	[PrintedCommentDate] [DATETIME] NULL,
	[PrintedComment] [VARCHAR](MAX) NULL,
	[PrintedCommentUserID] [INT] NULL,
 CONSTRAINT [PK_Invoice] PRIMARY KEY CLUSTERED 
(
	[InvoiceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

SET ANSI_PADDING ON
GO


CREATE TABLE [dbo].[sessions](
    [sid] [varchar](255) NOT NULL PRIMARY KEY,
    [session] [varchar](max) NOT NULL,
    [expires] [datetime] NOT NULL
)

create table dbo.[user]
(
	id int identity(1,1) not null primary key, 
	email varchar(255), 
	password varchar(255)
);

select * from dbo.[user]


create table ServiceBasedBilling.ContractHeader 
(
	ContractHeaderID int primary key, 
	Ref varchar(255) not null, 
	Description varchar(255) 
)

insert into ServiceBasedBilling.ContractHeader 
select 2, 'TestRef2', 'TestDescription2'


create table ServiceBasedBilling.InvoiceStatus
(
	InvoiceStatusID int primary key, 
	Ref varchar(255) not null
)

alter table ServiceBasedBilling.InvoiceStatus drop column Description


insert into ServiceBasedBilling.InvoiceStatus
select 3, 'Invoice Excluded'

go

alter proc ServiceBasedBilling._InvoiceSearch
@InvoiceNumber varchar(100), 
@StatusID int 
as
begin 
	
	select  i.InvoiceID, 
            i.InvoiceNumber, 
            i.ContractHeaderID as ContractID, 
            ch.Description as ContractDescription, 
            i.InvoiceStatusID as StatusID, 
            invs.Ref as StatusDescription, 
            i.Value, 
            i.DateRaised
	from ServiceBasedBilling.Invoice i join ServiceBasedBilling.ContractHeader ch on i.ContractHeaderID = ch.ContractHeaderID
	join InvoiceStatus invs on i.InvoiceStatusID = invs.InvoiceStatusID 
	where (@StatusID is null or  i.InvoiceStatusID = @StatusID) and (@InvoiceNumber is null or i.InvoiceNumber like '%' + @InvoiceNumber + '%')

end

go

create proc ServiceBasedBilling._InvoiceByID
@InvoiceID int 
as
begin 
	
	select  i.InvoiceID, 
            i.InvoiceNumber, 
            i.ContractHeaderID as ContractID, 
            ch.Description as ContractDescription, 
            i.InvoiceStatusID as StatusID, 
            invs.Ref as StatusDescription, 
            i.Value, 
            i.DateRaised
	from ServiceBasedBilling.Invoice i join ServiceBasedBilling.ContractHeader ch on i.ContractHeaderID = ch.ContractHeaderID
	join InvoiceStatus invs on i.InvoiceStatusID = invs.InvoiceStatusID 
	where i.InvoiceID = @InvoiceID

end


select * from servicebasedbilling.invoice