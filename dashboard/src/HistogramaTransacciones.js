// HistogramaTransacciones.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const HistogramaTransacciones = () => {
  const [data, setData] = useState(null);
  const [filtros, setFiltros] = useState({
    banco_origen: '',
    banco_destino: '',
    fecha_transaccion: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://tarea-3-tdi-luis-lozano.onrender.com/histograma', { params: filtros });
        setData(Object.entries(res.data).map(([key, value]) => ({ name: key, value })));
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [filtros]);

  const handleInputChange = (event) => {
    setFiltros({
      ...filtros,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <h2>Histograma de Transacciones</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Banco Origen:
          <input
            type="text"
            name="banco_origen"
            value={filtros.banco_origen}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Banco Destino:
          <input
            type="text"
            name="banco_destino"
            value={filtros.banco_destino}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Fecha de Transacción:
          <input
            type="date"
            name="fecha_transaccion"
            value={filtros.fecha_transaccion}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit">Aplicar Filtros</button>
      </form>
      {data ? (
        <BarChart width={600} height={300} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>      
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default HistogramaTransacciones;
