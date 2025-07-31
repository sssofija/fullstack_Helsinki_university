const Notification = ({ message, type }) => {
  if (!message) return null

  let style = {
    fontSize: 18,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontWeight: 'normal',
  }

  if (type === 'success') {
    style = {
      ...style,
      color: 'green',
      backgroundColor: '#ccffcc',
      border: '2px solid green',
    }
  } else if (type === 'delete') {
    style = {
      ...style,
      color: 'white',
      backgroundColor: 'red',
      border: '2px solid darkred',
      fontWeight: 'bold',
    }
  } else if (type === 'error') {
    style = {
      ...style,
      color: 'white',
      backgroundColor: 'darkred',
      border: '2px solid darkred',
      fontWeight: 'bold',
    }
  }

  return <div style={style}>{message}</div>
}

export default Notification
