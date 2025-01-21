import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const stateFile = join(process.cwd(), 'state.json');

// Load state from a file or initialize default state
function loadState() {
    try {
        return JSON.parse(readFileSync(stateFile, 'utf8'));
    } catch {
        return { countdown: 5 * 60 * 60, balance: 0, lastUpdated: Date.now(), rotating: false };
    }
}

// Save state to a file
function saveState(state) {
    writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

export default function handler(req, res) {
    const state = loadState();

    if (req.method === 'GET') {
        // Calculate updated state based on elapsed time
        const now = Date.now();
        const elapsedTime = Math.floor((now - state.lastUpdated) / 1000);

        if (state.rotating) {
            state.balance += elapsedTime * 0.000003;
            state.countdown = Math.max(state.countdown - elapsedTime, 0);
        }

        state.lastUpdated = now;
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
