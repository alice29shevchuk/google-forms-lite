import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { formBuilderReducer } from '../features/formBuilder/formBuilderSlice';
import { api } from './generated/graphql';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    formBuilder: formBuilderReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
