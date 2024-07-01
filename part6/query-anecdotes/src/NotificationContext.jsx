import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { ...state, notification: action.payload };
    case 'ERROR':
      return { ...state, notification: `${action.payload}` };
    case 'CLEAR':
      return { ...state, notification: null };
    default:
        return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notifcationDispatch] = useReducer(notificationReducer, 'rendering message here')

  return (
    <NotificationContext.Provider value={[notification, notifcationDispatch] }>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  console.log('notificationAndDispatch:', notificationAndDispatch)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export default NotificationContext