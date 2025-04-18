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

TABLE 1: ADMIN
```
CREATE TABLE IF NOT EXISTS admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL
);

```
![Screenshot 2025-04-18 095422](https://github.com/user-attachments/assets/e43386e6-4250-4687-8509-0cd4c751d9a1)

TABLE 2: USERS
![Screenshot 2025-04-18 095429](https://github.com/user-attachments/assets/abe7a977-a549-4b78-b9ee-2d9b086b5867)

TABLE 3: PERSONNEL
![Screenshot 2025-04-18 131254](https://github.com/user-attachments/assets/63f62589-56dd-4b9a-a5d0-279dd3c49e49)

TABLE 4: COMPLAINTS
![Screenshot 2025-04-18 174738](https://github.com/user-attachments/assets/4dfb3a88-a04e-4356-82e2-e56c16b82d2f)

TABLE 5: COMPLAINT_TYPES
![Screenshot 2025-04-18 095448](https://github.com/user-attachments/assets/02b39f05-434f-49ac-a276-74919784eedd)

5. write random values in personnel table from sql
![image](https://github.com/user-attachments/assets/644da5f2-f6e8-47e8-a838-8e1eed050605)
