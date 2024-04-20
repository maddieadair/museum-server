# COSC 3380: Museum Database Server

## Authors
Madeline Adair, Zeel Engineer, Kenny Nguyen, Chase Cotton, Shafnuddin Mohammad

## About
<br />
<p align="center">
<img align="center" width="200" alt="Screenshot 2024-04-20 at 15 25 36" src="https://github.com/maddieadair/museum-client/assets/98988491/a838ef75-8427-41c4-9562-23e7463abc50">
<img align="center" width="200" alt="Screenshot 2024-04-20 at 15 26 23" src="https://github.com/maddieadair/museum-client/assets/98988491/6b3473c7-bf31-441e-8050-a7b8d5f29250">
<img align="center" width="200" alt="Screenshot 2024-04-20 at 15 26 57" src="https://github.com/maddieadair/museum-client/assets/98988491/0aacf950-5886-4e7c-b568-fde5d1abd5d4">
<img align="center" width="200" alt="Screenshot 2024-04-20 at 15 27 36" src="https://github.com/maddieadair/museum-client/assets/98988491/005c05c2-38b8-4b4d-9c9e-4a0dbbad0abe">
</p>

<br />

This is the backend API for [museum-client](https://github.com/maddieadair/museum-client) using Node.js.
<br />
<br />

**Miniworld Description:** The Museum of Fine Arts (MFA), Houston needs a database to keep track of their art collections, exhibitions, ticket sales and gift shop revenue. Consider all aspects of what it takes to run a Museum and the data you need to collect, to be able to produce reports regarding the successful functioning of the museum. 

## Project Requirements
- User authentication for different user roles
- Data entry forms – to add new data, modify existing data, and ‘delete’ data.
- Triggers – At least 2.
- Data queries – At least 3.


## Technologies
- Frontend: `React` and `TailwindCSS`
- Backend:  `Node.js`
- Database: `Azure Database for MySQL - Flexible Server`
- User Authentication: `JWT`
- Deployment: `Heroku` and `Netlify`


## Installation/Startup

1. Install Packages
```
npm install
```

2. Environmental variables
  - create an '.env' file in the source directory
```sql
HOST =`MYSQL_HOST`
PORTNUM =`MYSQOL_PORT`
SQLUSER =`MYSQL_USER`
PASSWORD =`MYSQL_PASSWORD`
DB =`MYSQL_DB`
JWT_SECRET =`JWT_SECRET_KEY`
JWT_EXPIRE =`JWT_EXPIRY_TIME`
```

3. Start application
  - As a developer (uses nodemon)
```
nodemon index.js
```
  - Production
```
npm start
```
