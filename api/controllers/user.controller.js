import bcrypt from 'bcrypt';

import prisma from '../lib/prisma.js';

export const getUsers = async (req, res) => {
   try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
   } catch (error) {
      console.log('[getUsers]', error);
      res.status(500).json({ message: 'Failed to get users!' });
   }
};
export const getUser = async (req, res) => {
   const id = req.params.id;

   try {
      const user = await prisma.user.findUnique({
         where: {
            id,
         },
      });
      res.status(200).json(user);
   } catch (error) {
      console.log('[getUser]', error);
      res.status(500).json({ message: 'Failed to get a user!' });
   }
};
export const updateUser = async (req, res) => {
   const id = req.params.id;
   const tokenUserId = req.userId;

   const { password, avatar, ...input } = req.body;

   if (id !== tokenUserId) {
      return res.status(403).json({ message: 'Not authorized' });
   }

   let updatedPassword = null;

   try {
      if (password) {
         updatedPassword = await bcrypt.hash(password, 10);
      }

      const updatedUser = await prisma.user.update({
         where: {
            id,
         },
         data: {
            ...input,
            ...(updatedPassword && { password: updatedPassword }),
            ...(avatar && { avatar }),
         },
      });
      const { password: userPassword, ...rest } = updatedUser;

      res.status(200).json(rest);
   } catch (error) {
      console.log('[updateUser]', error);
      res.status(500).json({ message: 'Failed to update user!' });
   }
};
export const deleteUser = async (req, res) => {
   const id = req.params.id;
   const tokenUserId = req.userId;

   if (id !== tokenUserId) {
      return res.status(403).json({ message: 'Not authorized' });
   }

   try {
      await prisma.user.delete({
         where: {
            id,
         },
      });

      return res.status(200).json({ message: 'The user has been deleted' });
   } catch (error) {
      console.log('[deleteUser]', error);
      res.status(500).json({ message: 'Failed to delete user!' });
   }
};

export const savePost = async (req, res) => {
   const postId = req.body.postId;
   const tokenUserId = req.userId;

   try {
      const savedPost = await prisma.savedPost.findUnique({
         where: {
            userId_postId: {
               userId: tokenUserId,
               postId,
            },
         },
      });

      if (savedPost) {
         await prisma.savedPost.delete({
            where: {
               id: savedPost.id,
            },
         });
         return res
            .status(200)
            .json({ message: 'Post removed from saved list' });
      } else {
         await prisma.savedPost.create({
            data: {
               userId: tokenUserId,
               postId,
            },
         });
         return res.status(200).json({ message: 'Post saved' });
      }
   } catch (error) {
      console.log('[savePost]', error);
      res.status(500).json({ message: 'Failed to save Post user!' });
   }
};
