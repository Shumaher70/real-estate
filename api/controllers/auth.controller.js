import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

export const register = async (req, res) => {
   const { username, email, password } = req.body;

   try {
      const hashedPassword = await bcrypt.hash(password, 10);

      if (!username) {
         return res.status(404).json({ message: 'Username is not exist' });
      }

      if (!email) {
         return res.status(404).json({ message: 'Email is not exist' });
      }

      await prisma.user.create({
         data: {
            username,
            email,
            password: hashedPassword,
         },
      });

      res.status(201).json({ message: 'User created successfully' });
   } catch (error) {
      console.log('[register]', error);
      res.status(500).json({ message: 'Failed to create user' });
   }
};

export const login = async (req, res) => {
   const { username, password } = req.body;
   try {
      const user = await prisma.user.findUnique({
         where: {
            username,
         },
      });

      if (!user) {
         return res.status(401).json({ message: 'Invalid Credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
         return res.status(401).json({ message: 'Invalid Credentials' });
      }
   } catch (error) {
      console.log('[login]', error);
      res.status(500).json({ message: 'Failed to login' });
   }
};

export const logout = async (req, res) => {};