# Equipment Borrowing and Return Monitoring System

**Course:** Systems Analysis and Design  
**Student:** Angelo Nuer  
**Section:** BSIT 3B  

## Description

An online system for managing college equipment borrowing and returns.  
Built with HTML, CSS, JavaScript and Supabase (PostgreSQL + Authentication).  
Deployed on GitHub Pages.

## Live System

- **Live URL:** https://nuerangelo5.github.io/SAD-EquipmentBorrowing-Nuer/
- **Repository:** https://github.com/nuerangelo5/SAD-EquipmentBorrowing-Nuer

## Demo Account (for Instructor)

- **Email:** `demo@adssu.edu.ph`
- **Password:** `demo1234`

## Features

- User Authentication (Login / Logout)
- Dashboard with live statistics (Total, Available, Borrowed, Returned, Overdue)
- Equipment CRUD (Create, Read, Update, Delete)
- Record Borrowing Transactions
- Return Equipment function
- Automatic Overdue Detection
- Search and Filter
- Business Rules enforcement (BR-01 to BR-12)

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Supabase (PostgreSQL + Auth)
- Hosting: GitHub Pages

## Project Structure
SAD-EquipmentBorrowing-Nuer/
├── index.html
├── login.html
├── css/
│   └── style.css
├── js/
│   ├── supabase.js
│   ├── auth.js
│   ├── equipment.js
│   └── transactions.js
├── README.md
└── documentation/
├── use-case.png
└── erd.png
text## Database Tables

### equipment
| Field            | Type        | Description                  |
|------------------|-------------|------------------------------|
| id               | bigint      | Primary Key                  |
| equipment_name   | text        | Name of equipment            |
| category         | text        | Equipment category           |
| asset_code       | text        | Unique equipment code        |
| condition        | text        | Good, Fair, For Repair       |
| availability     | text        | Available or Borrowed        |
| created_at       | timestamptz | Record creation date         |

### borrow_transactions
| Field            | Type        | Description                          |
|------------------|-------------|--------------------------------------|
| id               | bigint      | Primary Key                          |
| equipment_id     | bigint      | Foreign Key → equipment              |
| borrower_name    | text        | Name of borrower                     |
| borrower_type    | text        | Student, Faculty, Staff              |
| department       | text        | Office / Department                  |
| date_borrowed    | date        | Borrowing date                       |
| due_date         | date        | Expected return date                 |
| date_returned    | date        | Actual return date                   |
| status           | text        | Borrowed, Returned, Overdue          |
| user_id          | uuid        | User who recorded the transaction    |
| created_at       | timestamptz | Record creation date                 |

## Business Rules Implemented

| ID    | Business Rule                                              |
|-------|------------------------------------------------------------|
| BR-01 | Equipment name cannot be empty                             |
| BR-02 | Asset code must be unique                                  |
| BR-03 | Only available equipment may be borrowed                   |
| BR-04 | Borrower name must be provided                             |
| BR-05 | Due date cannot be earlier than the borrowing date         |
| BR-06 | Newly borrowed equipment receives Borrowed status          |
| BR-07 | Borrowed equipment becomes unavailable                     |
| BR-08 | Returned equipment becomes available again                 |
| BR-09 | Equipment past the due date is identified as Overdue       |
| BR-10 | Deletion requires user confirmation                        |
| BR-11 | Only authenticated users may manage records                |
| BR-12 | A returned transaction cannot be returned a second time    |

## How to Use

1. Open the live site
2. Login using the demo account (or your own Supabase account)
3. Manage equipment and borrowing transactions

## Author

Angelo Nuer  
BSIT 3B  
Systems Analysis and Design
