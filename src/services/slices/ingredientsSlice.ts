import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch ingredients';
      });
  }
});

export const { selectIngredients, selectIsLoading, selectError } =
  ingredientsSlice.selectors;

export const selectBuns = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((i) => i.type === 'bun')
);

export const selectMains = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((i) => i.type === 'main')
);

export const selectSauces = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((i) => i.type === 'sauce')
);

export default ingredientsSlice.reducer;
