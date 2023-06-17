// UltimasTransacciones.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';

const UltimasTransacciones = () => {
  const [data, setData] = useState([]);
  const [bancoOrigen, setBancoOrigen] = useState("");
  const [bancoDestino, setBancoDestino] = useState("");
  const [fechaTransaccion, setFechaTransaccion] = useState("");

  useEffect(() => {
    const fetchTransacciones = async () => {
      try {
        const res = await axios.get('https://tarea-3-tdi-luis-lozano.onrender.com/ultimas-transacciones', { 
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

    fetchTransacciones();
  }, [bancoOrigen, bancoDestino, fechaTransaccion]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID Mensaje',
        accessor: 'id_mensaje',
      },
      {
        Header: 'Banco Origen',
        accessor: 'banco_origen',
      },
      {
        Header: 'Cuenta Origen',
        accessor: 'cuenta_origen',
      },
      {
        Header: 'Banco Destino',
        accessor: 'banco_destino',
      },
      {
        Header: 'Cuenta Destino',
        accessor: 'cuenta_destino',
      },
      {
        Header: 'Monto',
        accessor: 'monto',
      },
      {
        Header: 'Fecha Transacción',
        accessor: 'fecha_transaccion',
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
    <div>
      <h2>Últimas Transacciones</h2>

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

      <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    borderBottom: 'solid 3px red',
                    background: 'aliceblue',
                    color: 'black',
                    fontWeight: 'bold',
                  }}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: 'papayawhip',
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UltimasTransacciones;
