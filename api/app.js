import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

import authRoute from './routes/auth.route.js';
import postRoute from './routes/post.route.js';
import userRoute from './routes/user.route.js';
import chatRoute from './routes/chat.route.js';
import messageRoute from './routes/message.route.js';

dotenv.config();

const __dirname = path.resolve();
const app = express();

app.use(
   cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
   })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/posts', postRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(8800, () => {
   console.log('Сервер запущен на порту 8800');
});
