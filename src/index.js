import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.get('/', (req, res) => res.status(200).send({
  message: 'Welcome to Barefoot Nomad.'
}));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}....`);
});
export default app;