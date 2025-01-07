import mongoose from 'mongoose';

export const connectDB = () => {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare';

    try {
        mongoose.connect(mongoURI);
    } catch (error) {
        const castedError = error as Error;
        console.error(`Error connecting to database: ${castedError.message}`);
        process.exit(1);
    }

    mongoose.connection.on('connected', () => {
        console.log('Connected to database');
    });

    mongoose.connection.on('error', (error) => {
        console.error(`Error connecting to database: ${error}`);
    });
}