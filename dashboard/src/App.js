import React, { useState } from 'react';
import CantidadOperaciones from './CantidadOperaciones';
import MontoOperaciones from './MontoOperaciones';
import ConciliacionBancos from './ConciliacionBancos';
import UltimasTransacciones from './UltimasTransacciones';
import HistogramaTransacciones from './HistogramaTransacciones';

const App = () => {
  const [bancoOrigen, setBancoOrigen] = useState(null);
  const [bancoDestino, setBancoDestino] = useState(null);
  const [fechaTransaccion, setFechaTransaccion] = useState(null);

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Aquí podrías agregar inputs controlados para cambiar los valores de bancoOrigen, bancoDestino, fechaTransaccion */}
      <CantidadOperaciones bancoOrigen={bancoOrigen} bancoDestino={bancoDestino} fechaTransaccion={fechaTransaccion} />
      <MontoOperaciones bancoOrigen={bancoOrigen} bancoDestino={bancoDestino} fechaTransaccion={fechaTransaccion} />
      <ConciliacionBancos bancoOrigen={bancoOrigen} bancoDestino={bancoDestino} fechaTransaccion={fechaTransaccion} />
      <UltimasTransacciones />
      <HistogramaTransacciones />
      {/* Aquí irían los otros componentes */}
    </div>
  );
};

export default App;
