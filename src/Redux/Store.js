// src/Redux/Store.js
import { configureStore } from '@reduxjs/toolkit';
import avaliacaoReducer from './AvaliacaoSlice';

export const store = configureStore({
  reducer: {
    avaliacao: avaliacaoReducer,
  },
});
