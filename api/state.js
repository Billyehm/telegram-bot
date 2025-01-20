import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const filePath = join(process.cwd(), 'state.json');

// Load or initialize the state file
function loadState() {
    try {
        return JSON.parse(readFileSync(filePath, 'utf8'));
    } catch {
        return { balance: 0, countdown: 5 * 60 * 60, lastUpdated: Date.now(), rotating: false };
    }
}

// Save state to the file
function saveState(state) {
    writeFileSync(filePath, JSON.stringify(state, null, 2));
}

export default function handler(req, res) {
    const state = loadState();

    if (req.method === 'GET') {
        // Calculate updated balance and countdown based on elapsed time
        const elapsedTime = Math.floor((Date.now() - state.lastUpdated) / 1000);

        if (state.rotating) {
            state.balance += elapsedTime * 0.000003;
            state.countdown = Math.max(state.countdown - elapsedTime, 0);
        }

        state.lastUpdated = Date.now();
        saveState(state);

        return res.status(200).json(state);
    }

    if (req.method === 'POST') {
        const { rotating } = req.body;

        if (rotating !== undefined) {
            state.rotating = rotating;
        }

        state.lastUpdated = Date.now();
        saveState(state);

        return res.status(200).json({ message: 'State updated successfully', state });
    }

    res.status(405).json({ message: `Method ${req.method} not allowed` });
}
