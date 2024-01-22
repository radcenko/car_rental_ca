[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/EoBMzTuA)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=13290728&assignment_repo_type=AssignmentRepo)

![](http://143.42.108.232/pvt/Noroff-64.png)
# Noroff
## Back-end Development Year 1
### DAB - Course Assignment RESIT 1

Startup code for Noroff back-end development 1 - DAB course (RESIT 1).

Instruction for the course assignment is in the LMS (Moodle) system of Noroff.
[https://lms.noroff.no](https://lms.noroff.no)

![](http://143.42.108.232/pvt/important.png)

You will not be able to make any submission after the deadline of the course assignment. Make sure to make all your commit **BEFORE** the deadline

![](http://143.42.108.232/pvt/help_small.png)

If you are unsure of any instructions for the course assignment, contact out to your teacher on **Microsoft Teams**.

**REMEMBER** Your Moodle LMS submission must have your repository link **AND** your Github username in the text file.

---

# Vehicle Rental Management System
This system is a robust web application designed for vehicle rental management. It integrates user-friendly functionalities for both customers and administrators, streamlining the process of vehicle rentals and management.

## Features  
- Vehicle Catalog: Users can view and select from a wide range of vehicles.  
- User Authentication: Secure login and signup functionalities for customers and administrators.  
- Dynamic Filtering: Vehicles can be filtered based on popularity, rental status, service requirements, 
  and features like cruise control. 
-  Admin Control: Admins have exclusive access to manage vehicle types and colors, and handle rental operations.  
- Rental Functionality: Customers can rent vehicles, and admins can cancel rentals as needed.  
- Interactive Interface: Easy-to-navigate pages for vehicle selection, user management, and more.

Buttons in the 'Options' column are separated and disabled based on user roles, complemented by back-end access control:  
- **Guest**: Only 'Login' button presented.  
- **User**: 'Rent' button - active for available vehicles, otherwise disabled.  
-  **Admin**: 'Cancel Reservation' button - available for rented vehicles, otherwise disabled.  
  
'Vehicles requiring service' button is not disabled, but produces a pop-up alert for unauthorized users.  
  
Links in navbar to colour and types pages disabled for non-Admin users  
  
## Application Installation and Usage Instructions   
1. Clone the repository to your local machine:   
`git clone https://github.com/noroff-backend-1/resit1-dec23-dab-radcenko.git`    
2. Navigate to the project directory.  
`cd resit1-dec23-dab-radcenko`  
3. Install dependencies using `npm install`.  
4. Set up the environment variables as described in the `.env` section below.  
5. Run the application using `npm start`.  
6. Access the web application at `http://localhost:3000`.  
  
# Environment Variables (.env)  
Create a `.env` file in the root of your project and add the following:  
ADMIN_USERNAME = "dabcaowner"  
ADMIN_PASSWORD = "dabca1234"  
DATABASE_NAME = "rentaldb"  
DIALECT = "mysql"  
DIALECTMODEL = "mysql2"  
PORT = "3000"  
HOST = "localhost"   
  
# Additional Libraries/Packages  
This project relies on the following npm packages:    
* Express Framework: For server-side logic. 
* Sequelize: ORM for MySQL 
* EJS: As a templating engine.  
* Bootstrap and Bootstrap Icons: For frontend styling.  
* Passport: For user authentication.  
* Other dependencies as listed in package.json  
These will be automatically installed when you run `npm install`.  
  
# NodeJS Version Used  
* Version: v18.13.0   
  
# DATABASE  
-- Create the rentaldb database  
CREATE DATABASE IF NOT EXISTS rentaldb;  
-- Use the rentaldb database  
USE rentaldb;  
  
# DATABASE ACCESS  
-- 1. Create a new “dabcaowner” login for the database, with the password “dabca1234”:  
CREATE USER 'dabcaowner'@'%' IDENTIFIED WITH 'mysql_native_password' BY 'dabca1234';  
  
-- 2. Grant the DBA role:  
GRANT ALL PRIVILEGES ON *.* TO 'dabcaowner'@'%' WITH GRANT OPTION;  
  
-- 3. Give the user access to the database 'rentaldb':  
GRANT ALL PRIVILEGES ON rentaldb.* TO 'dabcaowner'@'%';  
  
-- Finally, flush privileges to ensure the changes take immediate effect:  
FLUSH PRIVILEGES;  
  
# Licenses  
"CarRental.jpg" source: "https://www.vecteezy.com".  
