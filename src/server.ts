import express from 'express';
import morgan from 'morgan';
import { connectDB } from './config/database';

import { errorHandler, notFound } from './middleware/error.middleware';

import patientRouter from './routes/patient.route';
import specialistRouter from './routes/specialist.route';

const app = express();
const port = Bun.env.PORT || 5000;

app.use(morgan(':method :url :status - :response-time ms'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get('/', (req, res) => {
  res.json('Profindly server running!');
});

app.use('/api/patients', patientRouter);
app.use('/api/specialists', specialistRouter);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});