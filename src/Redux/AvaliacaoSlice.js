// src/Redux/avaliacaoSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  votos: [], // cada item será { avaliacao: 'bom', data: timestamp }
};

const avaliacaoSlice = createSlice({
  name: 'avaliacao',
  initialState,
  reducers: {
    adicionarAvaliacao: (state, action) => {
      state.votos.push({ avaliacao: action.payload, data: Date.now() });
    },
  },
});

export const { adicionarAvaliacao } = avaliacaoSlice.actions;
export default avaliacaoSlice.reducer;
