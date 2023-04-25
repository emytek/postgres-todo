const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
    user: process.env.DUSER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: 'todo',
})
console.log(process.env.DBPORT, "*****")
// const pool = new Pool({
//     user: 'postgres',
//     password: 'jacksontech',
//     host: 'localhost',
//     port: 5432,
//     database: 'todo',
// })

export default pool;
