# IIITA Helpdesk

This is a full-stack project for handling student complaints at IIITA. This guide walks you through setting up the MySQL database, configuring the environment, and running both the server and client.

---

## 🔧 Setup Instructions

### 1. Create MySQL Database

Open your MySQL terminal or GUI and run:

```sql
CREATE DATABASE iiita_helpdesk;
```

```
# Run server
cd server
npm install
npm run dev

# Run client
cd client
npm install
npm run dev
```

4. create these tables if not already in database
![Screenshot 2025-04-18 095415](https://github.com/user-attachments/assets/50ea5c13-6a1e-4b96-a3ff-020e4eb772e2)


## TABLE 1: USERS
```sql
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    PRIMARY KEY (id)
);
```
![Screenshot 2025-04-20 151703](https://github.com/user-attachments/assets/14ef35bc-5441-4e7f-a1e7-18c2b13465c5)

## TABLE 2: PERSONNEL
```sql
CREATE TABLE personnel (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(15) NOT NULL,
    role ENUM('Network', 'Cleaning', 'Carpentry', 'PC Maintenance', 'Plumbing', 'Electricity') NOT NULL,
    available TINYINT(1) NOT NULL,
    PRIMARY KEY (id)
);
```
![Screenshot 2025-04-18 131254](https://github.com/user-attachments/assets/63f62589-56dd-4b9a-a5d0-279dd3c49e49)

## TABLE 3: COMPLAINTS
```sql
CREATE TABLE complaints (
  id int NOT NULL AUTO_INCREMENT,
  status enum('Pending','Assigned','Resolved') DEFAULT 'Pending',
  createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  name varchar(100) DEFAULT NULL,
  email varchar(100) DEFAULT NULL,
  priority enum('Low','Medium','High') DEFAULT 'Low',
  location varchar(100) DEFAULT NULL,
  message text,
  attachments text,
  complaint_type_id` int DEFAULT NULL,
  assigned_personnel_id int DEFAULT NULL,
  user_id int DEFAULT NULL,
  type text,
  code varchar(10) DEFAULT NULL,
  PRIMARY KEY (id`),
  KEY fk_complaint_type (complaint_type_id),
  KEY fk_personnel (assigned_personnel_id),
  KEY fk_user (user_id),
  CONSTRAINT fk_complaint_type FOREIGN KEY (complaint_type_id) REFERENCES complaint_types (id),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id)
  CONSTRAINT fk_assigned_personnel FOREIGN KEY (assigned_personnel_id) REFERENCES personnel (id)
);

```
![Screenshot 2025-04-18 174738](https://github.com/user-attachments/assets/4dfb3a88-a04e-4356-82e2-e56c16b82d2f)

## TABLE 4: COMPLAINT_TYPES
```sql
CREATE TABLE complaint_types (
    id INT NOT NULL AUTO_INCREMENT,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);
```
![Screenshot 2025-04-18 095448](https://github.com/user-attachments/assets/02b39f05-434f-49ac-a276-74919784eedd)

## TABLE 5: FEEDBACK
```sql
CREATE TABLE feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id INT NOT NULL,
  user_id INT NOT NULL,
  assigned_personnel_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (assigned_personnel_id) REFERENCES personnel(id)
);
```
![Screenshot 2025-04-20 171609](https://github.com/user-attachments/assets/a236d33f-94fc-461e-b371-b2420567a13e)

## write random values in personnel table from sql
![image](https://github.com/user-attachments/assets/644da5f2-f6e8-47e8-a838-8e1eed050605)
