import express from 'express';
import morgan from 'morgan';

const app = express();
app.set('view engine', 'pug');
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.send('Index view goes here');
});

app.listen(3000, () => {
  console.log(`App listening on http://localhost:3000`);
});
