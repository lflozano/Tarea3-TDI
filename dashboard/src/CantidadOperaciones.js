import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CantidadOperaciones = () => {
  const [cantidad, setCantidad] = useState(null);
  const [bancoOrigen, setBancoOrigen] = useState('');
  const [bancoDestino, setBancoDestino] = useState('');
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    const fetchCantidad = async () => {
      try {
        const res = await axios.get('https://tarea-3-tdi-luis-lozano.onrender.com/cantidad-operaciones', {
          params: {
            banco_origen: bancoOrigen,
            banco_destino: bancoDestino,
            fecha: fecha,
          },
        });
        setCantidad(res.data.count);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchCantidad();
  }, [bancoOrigen, bancoDestino, fecha]);

  return (
    <div>
      <h2>Cantidad de Operaciones</h2>
      <input type="text" value={bancoOrigen} onChange={e => setBancoOrigen(e.target.value)} placeholder="Banco de origen" />
      <input type="text" value={bancoDestino} onChange={e => setBancoDestino(e.target.value)} placeholder="Banco de destino" />
      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
      {cantidad ? <p>{cantidad}</p> : <p>Cargando...</p>}
    </div>
  );
};

export default CantidadOperaciones;
