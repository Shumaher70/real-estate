import { defer } from 'react-router-dom';

import apiRequest from './apiRequest';

export const singlePageLoader = async ({ request, params }) => {
   const response = await apiRequest.get('/posts/' + params.id);

   return response.data;
};

export const listPageLoader = async ({ request, params }) => {
   const query = request.url.split('?')[1];

   const postPromise = apiRequest.get('/posts?' + query);
   return defer({
      postResponse: postPromise,
   });
};

export const profilePageLoader = async () => {
   const postPromise = apiRequest.get('/users/profilePosts');
   const chatPromise = apiRequest.get('/chats');
   return defer({
      postResponse: postPromise,
      chatResponse: chatPromise,
   });
};
