import axios from 'axios';

const api_url = 'http://localhost:8000';

const api = axios.create({
  baseURL: api_url
});

export { api_url, api };