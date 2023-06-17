import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap'; // Asegúrate de tener instalado react-bootstrap

const ConciliacionBancos = () => {
  const [data, setData] = useState(null);
  const [bancoOrigen, setBancoOrigen] = useState("");
  const [bancoDestino, setBancoDestino] = useState("");
  const [fechaTransaccion, setFechaTransaccion] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://tarea-3-tdi-luis-lozano.onrender.com/conciliacion-bancos', { 
          params: { 
            banco_origen: bancoOrigen, 
            banco_destino: bancoDestino, 
            fecha_transaccion: fechaTransaccion 
          } 
        });
        setData(res.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [bancoOrigen, bancoDestino, fechaTransaccion]);

  return (
    <div>
      <h2>Conciliación entre Bancos</h2>

      <input 
        type="text" 
        value={bancoOrigen} 
        onChange={(e) => setBancoOrigen(e.target.value)} 
        placeholder="Banco de origen"
      />

      <input 
        type="text" 
        value={bancoDestino} 
        onChange={(e) => setBancoDestino(e.target.value)} 
        placeholder="Banco de destino"
      />

      <input 
        type="date" 
        value={fechaTransaccion} 
        onChange={(e) => setFechaTransaccion(e.target.value)} 
        placeholder="Fecha de la transacción"
      />

      {data ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Banco Origen</th>
              <th>Banco Destino</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.banco_origen}</td>
                <td>{item.banco_destino}</td>
                <td>{item.balance}</td>
              </tr>
            ))}
          </tbody>
        </Table> 
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default ConciliacionBancos;
