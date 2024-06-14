import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

export const getPosts = async (req, res) => {
   const query = req.query;
   try {
      const posts = await prisma.post.findMany({
         where: {
            city: query.city || undefined,
            type: query.type || undefined,
            property: query.property || undefined,
            bedroom: parseInt(query.bedroom) || undefined,
            price: {
               gte: parseInt(query.minPrice) || 0,
               lte: parseInt(query.maxPrice) || 100000000,
            },
         },
      });
      res.status(200).json(posts);
   } catch (error) {
      console.log('[getPosts]', error);
      res.status(500).json({ message: 'Filed to get posts' });
   }
};
export const getPost = async (req, res) => {
   const id = req.params.id;

   try {
      const post = await prisma.post.findUnique({
         where: {
            id,
         },
         include: {
            postDetails: true,
            user: {
               select: {
                  username: true,
                  avatar: true,
               },
            },
         },
      });

      if (!post) {
         return res.status(404).json({ message: 'The post not founded' });
      }

      const token = req.cookies?.token;

      if (token) {
         jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
            if (!err) {
               const saved = await prisma.savedPost.findUnique({
                  where: {
                     userId_postId: {
                        userId: payload.id,
                        postId: id,
                     },
                  },
               });
               return res
                  .status(200)
                  .json({ ...post, isSaved: saved ? true : false });
            }
         });
      }
   } catch (error) {
      console.log('[getPost]', error);
      res.status(500).json({ message: 'Filed to get post' });
   }
};
export const addPost = async (req, res) => {
   const body = req.body;

   const tokenUserId = req.userId;

   try {
      const newPost = await prisma.post.create({
         data: {
            ...body.postData,
            userId: tokenUserId,
            postDetails: {
               create: body.postDetail,
            },
         },
      });
      res.status(200).json(newPost);
   } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Failed to create post' });
   }
};

export const updatePost = async (req, res) => {
   try {
      res.status(200);
   } catch (error) {
      console.log('[updatePost]', error);
      res.status(500).json({ message: 'Filed to update post' });
   }
};
export const deletePost = async (req, res) => {
   const id = req.params.id;
   const tokenUserId = req.userId;

   try {
      const post = await prisma.post.findUnique({
         where: {
            id,
         },
      });

      if (post.userId !== tokenUserId) {
         return res.status(403).json({ message: 'Not authorized' });
      }

      await prisma.post.delete({
         where: {
            id,
         },
      });

      res.status(200).json({ message: 'The post has been deleted.' });
   } catch (error) {
      console.log('[deletePost]', error);
      res.status(500).json({ message: 'Filed to delete post' });
   }
};
