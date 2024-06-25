import axios from 'axios';

const apiRequest = axios.create({
   baseURL: 'https://real-estate-id3k.onrender.com/api',
   withCredentials: true,
});

export default apiRequest;
