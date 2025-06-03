const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;
const mysql = require('mysql2');

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// Creating connection with MYSQL

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Akavita@1412#',
    database: 'test_db'
});


connection.connect(err => {
    if (err) {
        return console.error('error connecting: ' + err.stack);
    }
    console.log('Connected as id ' + connection.threadId);
});

// GET 

app.get('/', (req, res) => {
    res.send('API is running 🚀');
});

// GET all users data

app.get('/api/get/users', (req, res) => {
    const query = 'SELECT * FROM users'; // Your users table

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results); // Send the users data as JSON
    });
});

// GET all users data with salary
app.get('/api/get/users-with-salary', (req, res) => {
    const query = 'SELECT u.id,u.name,u.number,s.salary_amount FROM users u JOIN salary s ON u.id = s.user_id'; // Your users table

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results); // Send the users data as JSON
    });
});


// GET - User based data with user mobile number

app.get('/api/get/users/number/:number', (req, res) => {
    const { number } = req.params;
    const query = 'SELECT * FROM users WHERE number = ?'; // Your users table

    connection.query(query, [number], (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results); // Send the users data as JSON
    });
});

// POST -  Add users

app.post('/api/add/user', (req, res) => {
    const { name, email, number } = req.body;

    if (!name || !email || !number) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    const sql = 'INSERT INTO users (name, email,number) VALUES (?, ?, ?)';
    connection.query(sql, [name, email, number], (err, result) => {
        if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({ error: 'Failed to insert user' });
        }

        res.status(201).json({ message: 'User added successfully', userId: result.insertId });
    });
});

// POST - add data in table main

app.post('/api/add/main', (req, res) => {
    const { contentid, sourcepath, contenttype, filesubtype, priority, sqsmessageid, filesubtypeid } = req.body

    if (!contentid || !sourcepath || !contenttype || !filesubtype || !priority || !sqsmessageid || !filesubtypeid) {
        return res.status(400).json({ error: 'All fields are required!' })
    }

    const sql = 'INSERT INTO main (contentid , sourcepath, contenttype, filesubtype, priority, sqsmessageid, filesubtypeid) VALUES (?,?,?,?,?,?,?)';
    connection.query(sql, [contentid, sourcepath, contenttype, filesubtype, priority, sqsmessageid, filesubtypeid], (err, result) => {
        if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({ error: 'Failed to insert data' });
        }

        res.status(201).json({message:"Data added successfully", contentid : result.contentid})
    })
})

// Delete - User with mobile number

app.post('/api/delete/user', (req, res) => {
    const { number } = req.body;

    if (!number) {
        return res.status(400).json({ error: 'Number is required' });
    }

    const delete_user = 'DELETE FROM users WHERE number = ?';

    connection.query(delete_user, [number], (err, result) => {
        console.log(result)
        if (err) {
            console.error('Delete error:', err);
            return res.status(500).json({ error: 'Failed to delete user' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(201).json({ message: 'User deleted successfully' })
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});