const sql = require('mssql');

const config = {
    user: 'quality',
    password: 'Qu@lity',
    server: '172.16.1.95',
    database: 'DTEBdQMakita',
    options: {
        encrypt: false
    }
};

async function connectToDatabase() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        throw error;
    }
}

module.exports = {
    connectToDatabase
};
