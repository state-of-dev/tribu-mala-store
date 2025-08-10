import { configureStore } from '@reduxjs/toolkit'
import { adminApi } from './api/adminApi'
import adminSlice from './slices/adminSlice'

export const store = configureStore({
  reducer: {
    admin: adminSlice,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(adminApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch