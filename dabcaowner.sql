-- 1. Create a new “dabcaowner” login for the database, with the password “dabca1234” :
CREATE USER 'dabcaowner'@'%' IDENTIFIED WITH 'mysql_native_password' BY 'dabca1234';

-- 2. Grant the DBA role:
GRANT ALL PRIVILEGES ON *.* TO 'dabcaowner'@'%' WITH GRANT OPTION;

-- 3. Give the user access to the database 'rentaldb':
GRANT ALL PRIVILEGES ON rentaldb.* TO 'dabcaowner'@'%';

-- Finally, flush privileges to ensure the changes take immediate effect:
FLUSH PRIVILEGES;
