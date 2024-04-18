import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
  });

  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('https://serverevent-ijtb.onrender.com');
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('notificacionUsuarioCreado', (usuario) => {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          usuario,
        ]);
      });
    }
  }, [socket]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitForm = () => {
    fetch('https://api1event.onrender.com/user/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleButtonClick = () => {
    submitForm();
    if (socket) {
      socket.emit('notificacionDesdeCliente', formData);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        margin: 0,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '95%', padding: '8px', marginBottom: '10px' }}
        />

        <label htmlFor="name">Nombre:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: '95%', padding: '8px', marginBottom: '10px' }}
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: '95%', padding: '8px', marginBottom: '20px' }}
        />

        <button
          type="button"
          onClick={handleButtonClick}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '10px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Crear Usuario
        </button>

        <div style={{ marginTop: '20px' }}>
          <h3>Notificaciones:</h3>
          <ul>
            {notifications.map((notificacion, index) => (
              <li key={index}>
                {notificacion.name} Usuario registrados : {notificacion.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateUserForm;
