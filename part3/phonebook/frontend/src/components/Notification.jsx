const Notification = ({ message, type }) => {
  if (!message) return null

  const baseStyle = {
    fontSize: 18,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontWeight: 'normal',
  }

  const typeStyles = {
    success: {
      color: 'green',
      backgroundColor: '#ccffcc',
      border: '2px solid green',
    },
    delete: {
      color: 'white',
      backgroundColor: 'red',
      border: '2px solid darkred',
      fontWeight: 'bold',
    },
    error: {
      color: 'white',
      backgroundColor: 'darkred',
      border: '2px solid darkred',
      fontWeight: 'bold',
    },
  }

  const style = {
    ...baseStyle,
    ...(typeStyles[type] || {}),
  }

  return <div style={style}>{message}</div>
}

export default Notification
