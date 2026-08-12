import { createSlice } from '@reduxjs/toolkit';

// Get initial city from localStorage, default to Mumbai
const getInitialCity = () => {
  const savedCity = localStorage.getItem('selectedCity');
  return savedCity || 'Mumbai';
};

const initialState = {
  selectedCity: getInitialCity(),
};

export const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    setCity: (state, action) => {
      state.selectedCity = action.payload;
      localStorage.setItem('selectedCity', action.payload);
    },
  },
});

export const { setCity } = citySlice.actions;

export default citySlice.reducer;
