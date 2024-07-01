import React from "react"
import { useContext, useEffect } from "react"
import { useNotificationValue, useNotificationDispatch } from "../NotificationContext"

const Notification = () => {
  const state = useNotificationValue()
  const dispatch = useNotificationDispatch()
  
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  useEffect(() => {
    if (state.notification) {
      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    }
  }, [state.notification, dispatch])

  if (!state.notification) {
    return null
  }

  return (
    <div style={style}>
      {state.notification}
    </div>
  )
}

export default Notification
