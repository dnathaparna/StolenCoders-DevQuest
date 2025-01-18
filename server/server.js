const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data storage path
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Ensure data directory exists
async function initializeDataStorage() {
    try {
        await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
        try {
            await fs.access(USERS_FILE);
        } catch {
            await fs.writeFile(USERS_FILE, JSON.stringify([]));
        }
    } catch (error) {
        console.error('Error initializing data storage:', error);
    }
}

// Routes
app.post('/api/signup', async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;
        
        // Read existing users
        const usersData = await fs.readFile(USERS_FILE, 'utf8');
        const users = JSON.parse(usersData);

        // Check if email already exists
        if (users.some(user => user.email === email)) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            fullName,
            email,
            password, // In a real app, you should hash the password!
            role,
            joinDate: new Date().toISOString(),
            scanHistory: []
        };

        // Add user and save
        users.push(newUser);
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Read users
        const usersData = await fs.readFile(USERS_FILE, 'utf8');
        const users = JSON.parse(usersData);

        // Find user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Save scan results
app.post('/api/scans', async (req, res) => {
    try {
        const { userId, scanData } = req.body;
        
        const usersData = await fs.readFile(USERS_FILE, 'utf8');
        const users = JSON.parse(usersData);
        
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        const scan = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...scanData
        };

        users[userIndex].scanHistory.push(scan);
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));

        res.status(201).json(scan);
    } catch (error) {
        console.error('Error saving scan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Initialize and start server
initializeDataStorage().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
