import axios from 'axios';

const API = axios.create({
  baseURL: 'https://my-json-server.typicode.com/GilangAM/fake-api',
}); 

export default API;
