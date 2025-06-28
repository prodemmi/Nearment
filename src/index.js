require('dotenv').config();
const { connectDB } = require('./services/db');
const { startQdrant } = require('./services/qdrant');
const startServer = require('./server');


async function main() {
    try {
        await connectDB();
        startQdrant();
        startServer();
    } catch (error) {
        console.error(error);
    }
}

main();