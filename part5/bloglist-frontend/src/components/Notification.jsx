const Notification = ({ message, errorMessage }) => {
  const errorClass = errorMessage ? 'error' : ''
  if (message === null && errorMessage === null) {
    return null
  }

  return (
    <div className={`base ${errorClass}`}>
      {message} {errorMessage}
    </div>
  )
}

export default Notification