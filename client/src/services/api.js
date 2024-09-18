import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getAllBooks = () => axios.get(`${API_URL}/all-books`);
export const getBook = (id) => axios.get(`${API_URL}/book/${id}`);
export const createBook = (bookData) => axios.post(`${API_URL}/upload-book`, bookData);
export const updateBook = (id, bookData) => axios.patch(`${API_URL}/book/${id}`, bookData);
export const deleteBook = (id) => axios.delete(`${API_URL}/book/${id}`);