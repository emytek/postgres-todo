const PORT = process.env.PORT ?? 8000
import express from 'express';
const app = express()
import { Request, Response } from 'express';
import pool from './db';


//get all todos
app.get('/todos', async(req: Request, res: Response) => {
    try {
        const todos = await pool.query('SELECT * FROM todo');
        res.json(todos.rows);
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))