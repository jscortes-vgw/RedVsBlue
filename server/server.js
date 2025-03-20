const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');

const app = express();
const PORT = 8888;

const battlegrounds = [];

app.use(cors());

app.use(express.json());

app.post('/battlegrounds', (req, res) => {
    try {
        const data = req.body;
        const created = {
            id: randomUUID(),
            red: { users: [] },
            blue: { users: [] },
            latest: true,
            ...data
        };
        battlegrounds.forEach(bg => bg.latest = false);
        battlegrounds.push(created);
        res.status(201).json(calculate(created));
    } catch (error) {
        res.status(400).json({ error: 'Invalid JSON' });
    }
});

app.get('/battlegrounds', (req, res) => {
    res.status(200).json(battlegrounds.map(calculate));
});

app.get('/battlegrounds/:id', (req, res) => {
    const { id, } = req.params;

    let battleground = getBattleground(id);
    if (!battleground) {
        return res.status(404).json({ error: 'Battleground not found' });
    }

    res.status(200).json((calculate(battleground)));
});

app.post('/battlegrounds/:id/teams/:team/users', (req, res) => {
    const { id, team } = req.params;
    const data = req.body;

    let battleground = getBattleground(id);
    if (!battleground) {
        return res.status(404).json({ error: 'Battleground not found' });
    }

    if (!battleground[team]) {
        return res.status(404).json({ error: 'Team not found' });
    }

    const user = {
        ...data,
        spend: 0
    };

    if (battleground[team].users.length === battleground.limit) {
        return res.status(400).json({ error: `Team ${team} is full` });
    }

    const userExistsInRed = battleground.red.users.some(u => u.id === user.id);
    const userExistsInBlue = battleground.blue.users.some(u => u.id === user.id);
    if (userExistsInRed || userExistsInBlue) {
        return res.status(400).json({ error: 'User with this ID already exists in a team' });
    }

    battleground[team].users.push(user);

    res.status(200).json(calculate(battleground));
});

app.patch('/battlegrounds/:id/teams/:team/users/:userId/spend', (req, res) => {
    const { id, team, userId } = req.params;
    const data = req.body;

    const battleground = getBattleground(id);
    if (!battleground) {
        return res.status(404).json({ error: 'Battleground not found' });
    }

    if (!battleground[team]) {
        return res.status(404).json({ error: 'Team not found' });
    }

    const user = getUser(battleground, team, userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found in the specified team' });
    }

    if (data.spend < 0) {
        return res.status(400).json({ error: 'Spend cannot be negative' });
    }

    user.spend += data.spend;

    res.status(200).json(calculate(battleground));
});

app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const calculate = (battleground) => {
    const copy = { ...battleground };

    copy.red.spend = battleground.red.users.reduce((acc, user) => acc + user.spend, 0);;
    copy.blue.spend = battleground.blue.users.reduce((acc, user) => acc + user.spend, 0);;

    if (copy.red.spend === copy.blue.spend) {
        copy.winner = 'draw';
    } else {
        copy.winner = redSpend > blueSpend ? 'red' : 'blue';
    }

    copy.red.isOpen = battleground.red.users.length < battleground.limit;
    copy.blue.isOpen = battleground.red.users.length < battleground.limit;

    return copy;
}

function getUser(battleground, team, userId) {
    return battleground[team].users.find(u => u.id == userId);
}

function getBattleground(id) {
    let battleground;
    if (id === 'latest') {
        battleground = battlegrounds.find(bg => bg.latest);
    } else {
        battleground = battlegrounds.find(bg => bg.id === id);
    }
    return battleground;
}
