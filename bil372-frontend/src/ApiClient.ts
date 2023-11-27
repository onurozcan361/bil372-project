import axios from 'axios';

const ApiClient = axios.create({
  baseURL: 'http://localhost:8080', // Backend URL'sini buraya yazın
  headers: {
    'Content-Type': 'application/json', // İsteğin içeriği JSON formatında olduğunu belirtiyoruz
  },
});

export default ApiClient;
