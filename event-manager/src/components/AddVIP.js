import React, { useState } from 'react';
import axios from 'axios';

function AddVIP({ eventId }) {
  const [vipEmail, setVipEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleAddVIP = async () => {
    try {
      const response = await axios.post('http://localhost:5000/events/add-vip', {
        eventId,
        vipEmail,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Erro ao adicionar cliente VIP.');
    }
  };

  return (
    <div>
      <h3>Adicionar Cliente VIP</h3>
      <input
        type="email"
        placeholder="E-mail do Cliente VIP"
        value={vipEmail}
        onChange={(e) => setVipEmail(e.target.value)}
      />
      <button onClick={handleAddVIP}>Adicionar VIP</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddVIP;
