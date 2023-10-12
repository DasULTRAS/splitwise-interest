import mongoose from 'mongoose';

// Connect to MongoDB
console.log('Connecting to database...');

if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST || !process.env.DB_NAME) {
    throw new Error('Please define the DB_USER, DB_PASSWORD, DB_HOST, DB_NAME environment variables.');
}

const dbString: string = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:27017/${process.env.DB_NAME}?authSource=admin`;
console.log(`connection String: ${dbString}`);

mongoose.connect(dbString)
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.log('Connection String: ' + dbString);
        console.error('Database connection error: ' + err);
    });

/*
mongoose.connection.on('connected', () => {
    console.log('Database connected successfully');
});
mongoose.connection.on('error', (err) => {
    console.log('Connection String: ' + dbString);
    console.error('Database connection error: ' + err);
});
 */
