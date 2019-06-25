import { createSlice } from 'redux-starter-kit'

export const AppModule = createSlice({
  slice: 'app',
  initialState: {
    // Refs as state.app.* by selector.
    websocketApi: '',
    loggedUserId: '',
  },
  reducers: {

    /**
     * Fetch notice message.
     * Refs as AppModle.actions.fetchNotice() when dispatch.
     *
     * @param state  - state.app
     * @param action - type: 'app/fetchNotice', payload: string
     */
    fetchNotice: (state, action) => {},

  }
})
