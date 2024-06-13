import apiRequest from './apiRequest';

export const singlePageLoader = async ({ request, params }) => {
   const response = await apiRequest.get('/posts/' + params.id);
   return response.data;
};
