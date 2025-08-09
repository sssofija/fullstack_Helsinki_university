const Notification = ({ message, type }) => {
  if (!message) return null

  const style = {
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    color: type === 'error' ? '#b00020' : '#155724',
    backgroundColor: type === 'error' ? '#f8d7da' : '#d4edda',
    border: type === 'error' ? '1px solid #f5c6cb' : '1px solid #c3e6cb',
    fontWeight: 'bold',
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification
