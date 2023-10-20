import mongoose from 'mongoose';

export async function connectToDb() {
    if (mongoose.connection.readyState >= 1) {
        // if connection is open return the instance of the databse for cleaner queries
        return mongoose.connection.db;
    }

    const { DB_USER, DB_PASS, DB_NAME, DB_HOST, DB_PORT } = process.env;

    if (!DB_USER || !DB_PASS || !DB_HOST || !DB_NAME || !DB_PORT) {
        throw new Error('Please define the DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT environment variables.');
    }

    const dbString: string = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

    // Setting up connection events
    mongoose.connection.on('connected', () => {
        console.log('Database connected.');
    });
    mongoose.connection.on('reconnected', () => {
        console.error('Database reconnected.');
    });
    mongoose.connection.on('close', () => {
        console.error('Database connection closed.');
    });
    mongoose.connection.on('disconnected', () => {
        console.error('Database disconnected.');
    });
    mongoose.connection.on('error', (err) => {
        console.log('Connection String: ' + dbString);
        console.error('Database connection error: ' + err);
    });

    try {
        return await mongoose.connect(dbString, {
            authSource: 'admin',
            connectTimeoutMS: 10000,
            socketTimeoutMS: 5000,
            heartbeatFrequencyMS: 2500,
            serverSelectionTimeoutMS: 5000
        });
    } catch (err) {
        console.error('Database connection error, connection String: ' + dbString);
        throw err;
    }
}

export async function disconnectFromDb() {
    if (mongoose.connection.readyState === 0) {
        console.log('No connection to close');
        return;
    }

    try {
        await mongoose.connection.close();
    } catch (err) {
        console.error('Database disconnection error');
        throw err;
    }
}
