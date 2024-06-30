import { createSlice } from '@reduxjs/toolkit'

const getId = () => (100000 * Math.random()).toFixed(0)

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: 'rendering message here',
  reducers: {
    setNotification: (state, action) => action.payload,
    removeNotification: () => '',
  },
})

export const { setNotification, removeNotification} = notificationSlice.actions
export default notificationSlice.reducer

export const showNotification = (message, time = 5000) => {
  return dispatch => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(removeNotification())
    }, time)
  }
}
