import express from 'express';
import { connectDB } from './config/database';

import patientRuter from './routes/patient.route';

const app = express();
const port = Bun.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get('/', (req, res) => {
  res.json('Profindly server running!');
});

app.use('/api/patient', patientRuter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});