import apiRequest from './apiRequest';

export const singlePageLoader = async ({ request, params }) => {
   const response = await apiRequest.get('/posts/' + params.id);
   return response.data;
};

export const listPageLoader = async ({ request, params }) => {
   const query = request.url.split('?')[1];

   const response = await apiRequest.get('/posts?' + query);
   return response.data;
};
