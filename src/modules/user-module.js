import { createSlice } from 'redux-starter-kit'

export const UserModule = createSlice({
  slice: 'user',
  initialState: {
    // Refs as state.user.* by selector.
    users:  [],
  },
  reducers: {

    /**
     * Fetch users.
     * Refs as UserModule.actions.fetchUsers when dispatch.
     *
     * @param state  - state.user
     * @param action - type: 'user/fetchUsers', payload: array
     */
    fetchUsers: (state, action) => {
      state.users = []
      state.users.push(...action.payload)
    },

  }
})
