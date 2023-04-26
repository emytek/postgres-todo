# :zap: Postgres Todo Service API

* PostgreSQL Express Todo list service app
* **Note:** to open web links in a new window use: _ctrl+click on link_

![GitHub repo size](https://img.shields.io/github/repo-size/AndrewJBateman/pern-stack-todo?style=plastic)
![GitHub pull requests](https://img.shields.io/github/issues-pr/AndrewJBateman/pern-stack-todo?style=plastic)
![GitHub Repo stars](https://img.shields.io/github/stars/AndrewJBateman/pern-stack-todo?style=plastic)
![GitHub last commit](https://img.shields.io/github/last-commit/AndrewJBateman/pern-stack-todo?style=plastic)

## :page_facing_up: Table of contents

* [:zap: PERN Stack Todo](#zap-pern-stack-todo)
  * [:page_facing_up: Table of contents](#page_facing_up-table-of-contents)
  * [:books: General info](#books-general-info)
  * [:camera: Screenshots](#camera-screenshots)
  * [:signal_strength: Technologies](#signal_strength-technologies)
  * [:floppy_disk: Setup](#floppy_disk-setup)
  * [:wrench: Testing](#wrench-testing)
  * [:computer: Code Examples](#computer-code-examples)
  * [:cool: Features](#cool-features)
  * [:clipboard: Status & To-Do List](#clipboard-status--to-do-list)
  * [:clap: Inspiration](#clap-inspiration)
  * [:file_folder: License](#file_folder-license)
  * [:envelope: Contact](#envelope-contact)

## :books: General info

### Backend: Database

* PostgreSQL needs to be installed and running - I started it from my Windows 10 PostgreSQL 12 dropdown option 'SQL shell (psql)'
* Postman used to test the backend before frontend was available
* pgadmin was used as an interface to access and manage my postgres database
* A todo database was created and todo and users tables were used to organise and manage data 

### Backend: Server

* Node and Express was used to get the server running
* Set up a basic express server
* Implement and test the routes

### Implementation: User Management System

* This is User-based: Authenticated users have access to their own todos.
## :camera: Screenshots

![Backend screenshot](./img/postgresql.png)
![Frontend & backend screenshot](./img/todos.png)

## :signal_strength: Technologies - Backend

* [PostgreSQL v12](https://www.postgresql.org/)
* [PostgreSQL Installer for Windows](https://www.postgresqltutorial.com/install-postgresql/)
* [Express.js middleware v4](https://expressjs.com/)
* [Node.js v12](https://nodejs.org/es/)
* [Nodemon](https://www.npmjs.com/package/nodemon) npm module so backend server will automatically restart after code changes
* [Postman API](https://www.postman.com/downloads/) to simulate a frontend
* body-parser: To have access to the request body field and parse json data.
* cors - To allow clients make request to the server and prevent block policies
* dotenv - To store app credentials and private data
* express-validator - To validate user inputs
* jsonwebtoken - To provide unique user tokens
* bcrypt - To encrypt passwords for auth
* pg - To get started with postgres
* uuid - To generate unique ids.

## :floppy_disk: Dev Setup - Backend

* Install dependencies using `npm i` or `npm install`
* Install node js and [nodemon](https://www.npmjs.com/package/nodemon) globally if you don't already have it
* Install [PostgreSQL](https://www.postgresql.org/) & run it (requires the password you created during installation)
* Add database access credentials to `db.ts` - recommend installing [npm dotenv](https://www.npmjs.com/package/dotenv) & using .env to hide credentials if commiting to Github
* Postgresql shell commands: `\l` list all databases. `\c` database1 connect to database1. `\dt` inspect tables. `\d+` inspect table & show relation information. `\q` to quit
* From root run `npm run start` for a dev server
* `http://localhost:8000/` can be accessed for CRUD operations such as POST, GET, PUT, DELETE etc. using Postman


## :computer: Code Examples - Backend

* backend `server.ts`: express post method used to add new todo [description] to postgreSQL database using SQL INSERT INTO statement

```typescript
// create a todo
app.post('/todos', async (req: Request, res: Response) => {
    try {
      const { user_email, title, progress, date } = req.body;
      const id = uuidv4(); // generate a unique id using uuid
  
      await pool.query(
        `INSERT INTO todo(id, user_email, title, progress, date)
        VALUES($1, $2, $3, $4, $5)`,
        [id, user_email, title, progress, date]
      );
  
      res.status(201).json({ message: 'Todo created successfully', id });
    } catch (err: any) {
      console.error(err);
      if (err.code === '23505') {
        // unique constraint violation
        res.status(400).json({ message: 'A todo with that title already exists' });
      } else {
        res.status(500).json({ message: 'Server Error' });
      }
    }
});
```

## :computer: Code Examples - Backend Auth

* Register / signup new user
```typescript
const validationRules = [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
];

//signup
  app.post('/signup', validationRules, async (req: Request, res: Response) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rowCount > 0) {
        return res.status(400).json({ message: 'Email already registered' });
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Save the user in the database
      const result = await pool.query('INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
      const user = result.rows[0];
  
      // Generate a JWT token
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  
      res.json({ user: { email: user.email }, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
});
```

## :cool: Features 

* All data stored in PostgreSQL database that can also be viewed and changed from the PostgreSQL shell (psql)
* Authentication - Users can register, login and manage their own todos
* Error handling / Input validation and tested use cases
* CRUD functionalities: Create, Read, Update and Delete todo direct from the server.
* Access roles in todo management.


## :clap: Inspiration/General Tools

* [The Stoic Programmers, PERN Stack Course - PostgreSQL, Express, React, and Node](https://www.youtube.com/watch?v=ldYcgPKEZC8&t=116s)
* [The Stoic Programmers, How to Deploy a PERN application on Heroku](https://www.youtube.com/watch?v=ZJxUOOND5_A&t=13s)
* [React documentation](https://reactjs.org/docs/getting-started.html)
* [Enable Emmet support for JSX in Visual Studio Code | React](https://medium.com/@eshwaren/enable-emmet-support-for-jsx-in-visual-studio-code-react-f1f5dfe8809c)
* [js-beautify for VS Code](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)

## :file_folder: License

* This project is licensed under the terms of the MIT license.

## :envelope: Contact
