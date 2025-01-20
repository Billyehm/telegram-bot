// api/updateBalance.js
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const filePath = join(process.cwd(), 'data.json');

// Load or initialize the data file
function loadData() {
    try {
        return JSON.parse(readFileSync(filePath, 'utf8'));
    } catch {
        return { balance: 0, countdown: 5 * 60 * 60, lastUpdated: Date.now() };
    }
}

// Save data to the file
function saveData(data) {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
    const data = loadData();

    if (req.method === 'GET') {
        // Calculate balance and countdown based on elapsed time
        const elapsedTime = Math.floor((Date.now() - data.lastUpdated) / 1000);

        if (data.countdown > 0) {
            const increment = elapsedTime * 0.000003;
            data.balance += increment;
            data.countdown = Math.max(data.countdown - elapsedTime, 0);
        }

        data.lastUpdated = Date.now();
        saveData(data);

        return res.status(200).json(data);
    }

    if (req.method === 'POST') {
        const { reset } = req.body;

        if (reset) {
            // Reset balance and countdown
            data.balance = 0;
            data.countdown = 5 * 60 * 60;
            data.lastUpdated = Date.now();
            saveData(data);
        }

        return res.status(200).json({ message: 'Data updated successfully', data });
    }

    res.status(405).json({ message: `Method ${req.method} not allowed` });
}
