const PORT = process.env.PORT ?? 8000
import express, { response } from 'express';
const app = express()
import { Request, Response } from 'express';
import cors from 'cors';
import pool from './db';
import { v4 as uuidv4 } from 'uuid';
import bodyParser from 'body-parser';

app.use(cors())
app.use(bodyParser.json());
//OR
//app.use(express.json())

//get all todos
app.get('/todos', async (req: Request, res: Response) => {
    const userEmail = 'john@example.com';
  
    try {
      const todos = await pool.query('SELECT * FROM todo WHERE user_email = $1', [userEmail]);
      res.json(todos.rows);
    } catch (err: any) {
      console.error(err);
  
      // check if the error is a database error
      if (err.code === '23505') {
        return res.status(400).json({ message: 'Duplicate todo item' });
      }
  
      // handle other types of errors
      res.status(500).json({ message: 'Server Error' });
    }
});
  

//create a new todo
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

//edit a todo
app.put('/todos/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { user_email, title, progress, date } = req.body;

    try {
        const editToDo = await pool.query('UPDATE todo SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5;',
        [user_email, title, progress, date, id]);

        if (editToDo.rowCount === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json({ message: 'Todo updated successfully' });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

//delete a todo
app.delete('/todos/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const deleteToDo = await pool.query('DELETE FROM todo WHERE id = $1;', [id]);
  
      if (deleteToDo.rowCount === 0) {
        res.status(404).json({ message: 'Todo not found' });
      } else {
        res.status(200).json({ message: 'Todo deleted successfully' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
});
  


app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))