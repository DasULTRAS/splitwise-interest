import mongoose from 'mongoose';

let isConnected = false;

export default async function connectToDb() {
    if (isConnected) {
        console.log('Already connected to database');
        return;
    }

    const { DB_USER, DB_PASS, DB_NAME, DB_HOST, DB_PORT } = process.env;

    if (!DB_USER || !DB_PASS || !DB_HOST || !DB_NAME || !DB_PORT) {
        throw new Error('Please define the DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT environment variables.');
    }

    const dbString: string = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

    // Setting up connection events
    mongoose.connection.on('connected', () => {
        isConnected = true;
        console.log('Database connected.');
    });
    mongoose.connection.on('reconnected', () => {
        isConnected = true;
        console.error('Database reconnected.');
    });
    mongoose.connection.on('close', () => {
        isConnected = false;
        console.error('Database connection closed.');
    });
    mongoose.connection.on('disconnected', () => {
        isConnected = false;
        console.error('Database disconnected.');
    });
    mongoose.connection.on('error', (err) => {
        isConnected = true;
        console.log('Connection String: ' + dbString);
        console.error('Database connection error: ' + err);
    });

    try {
        await mongoose.connect(dbString, {
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

/*
mongoose.connection.on('connected', () => {
        console.log('Already connected to database');
        return;
    });
mongoose.connection.on('error', (err) => {
    console.log('Connection String: ' + dbString);
    console.error('Database connection error: ' + err);
});
 */
