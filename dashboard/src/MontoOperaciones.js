import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const MontoOperaciones = () => {
  const [data, setData] = useState(null);
  const [bancoOrigen, setBancoOrigen] = useState('');
  const [bancoDestino, setBancoDestino] = useState('');
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://tarea-3-tdi-luis-lozano.onrender.com/monto-operaciones', {
          params: {
            banco_origen: bancoOrigen,
            banco_destino: bancoDestino,
            fecha: fecha,
          },
        });
        setData(res.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [bancoOrigen, bancoDestino, fecha]);

  return (
    <div>
      <h2>Monto de Operaciones</h2>
      <input type="text" value={bancoOrigen} onChange={e => setBancoOrigen(e.target.value)} placeholder="Banco de origen" />
      <input type="text" value={bancoDestino} onChange={e => setBancoDestino(e.target.value)} placeholder="Banco de destino" />
      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
      {data ? (
        <BarChart width={600} height={300} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="tipo_operacion" />
          <YAxis label={{ value: 'Monto (en millones)', angle: -90, position: 'insideLeft' }}/>
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="monto_total" fill="#8884d8" />
          <Bar dataKey="cantidad" fill="#82ca9d" />
        </BarChart>      
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default MontoOperaciones;
