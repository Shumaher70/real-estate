import express from 'express';
import authRoute from './routes/auth.route.js';
import postRoute from './routes/post.route.js';

const app = express();

app.use(express.json());

app.use('/api/posts', postRoute);
app.use('/api/auth', authRoute);

app.listen(8800, () => {
   console.log('server is running');
});
