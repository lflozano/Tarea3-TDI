const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const path = require('path');
const cors = require('cors');

var corsOptions = {
  origin: 'https://golden-hummingbird-19292f.netlify.app',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

const { Pool } = require('pg');

const pool = new Pool({
  user: import.meta.env.VITE_USER,
  host: 'langosta.ing.puc.cl',
  database: import.meta.env.VITE_USER,
  password: import.meta.env.VITE_PASSWORD,
  port: 5432,
});

// Middleware para analizar el cuerpo de las solicitudes POST en formato JSON
app.use(express.json());

const html = "<h1>Hola, mundo!</h1>";

const transacciones = {};

app.get("/", (req, res) => res.type('html').send(html));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const atob = require('atob'); // Este módulo nos permite decodificar base64 a texto

function ltrim(str, chars) {
  chars = chars || '\\s';
  return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

app.post("/transacciones", async (req, res) => {
    // Primero, verifica que el mensaje tiene la estructura correcta
    if (!req.body.message || !req.body.message.data) {
      res.status(400).send({ error: 'Mensaje malformado' });
      return;
    }
  
    // Decodifica el mensaje de la transacción desde Base64 a texto
    const transaccionDecodificada = atob(req.body.message.data);
  
    // Procesa la transacción y extrae los campos
    const tipoOperacion = transaccionDecodificada.substring(0, 4);
    const idMensaje = transaccionDecodificada.substring(4, 14);
    const bancoOrigen = ltrim(transaccionDecodificada.substring(14, 21), '0');
    const cuentaOrigen = ltrim(transaccionDecodificada.substring(21, 31), '0');
    const bancoDestino = ltrim(transaccionDecodificada.substring(31, 38), '0');
    const cuentaDestino = ltrim(transaccionDecodificada.substring(38, 48), '0');
    const monto = ltrim(transaccionDecodificada.substring(48, 64), '0');
    const fechaTransaccion = req.body.message.publishTime;
  
    // Inserta la transacción en la base de datos
    const text = 'INSERT INTO transacciones(tipo_operacion, id_mensaje, banco_origen, cuenta_origen, banco_destino, cuenta_destino, monto, fecha_transaccion) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
    const values = [tipoOperacion, idMensaje, bancoOrigen, cuentaOrigen, bancoDestino, cuentaDestino, monto, fechaTransaccion];
  
    try {
      await pool.query(text, values);
      res.status(200).send({ message: 'Transacción recibida y almacenada en la base de datos' });
    } catch(err) {
      console.log(err.stack);
      res.status(500).send({ error: 'Error al insertar la transacción en la base de datos' });
    }
});

app.get("/cantidad-operaciones", async (req, res) => {
  const { banco_origen, banco_destino, fecha_transaccion } = req.query;

  let query = 'SELECT COUNT(*) FROM transacciones WHERE true';
  const values = [];

  if (banco_origen) {
    query += ' AND banco_origen = $' + (values.length + 1);
    values.push(banco_origen);
  }
  
  if (banco_destino) {
    query += ' AND banco_destino = $' + (values.length + 1);
    values.push(banco_destino);
  }
  
  if (fecha_transaccion) {
    query += ' AND DATE(fecha_transaccion) = $' + (values.length + 1);
    values.push(fecha_transaccion);
  }

  try {
    const result = await pool.query(query, values);
    res.status(200).send(result.rows[0]);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send({ error: 'Error al obtener la cantidad de operaciones' });
  }
});


app.get("/monto-operaciones", async (req, res) => {
  const { banco_origen, banco_destino, fecha_transaccion } = req.query;

  let query = 'SELECT tipo_operacion, SUM(CAST(monto AS DECIMAL))/1000000 as monto_total, COUNT(*) as cantidad FROM transacciones WHERE true';
  const values = [];

  if (banco_origen) {
    query += ' AND banco_origen = $' + (values.length + 1);
    values.push(banco_origen);
  }

  if (banco_destino) {
    query += ' AND banco_destino = $' + (values.length + 1);
    values.push(banco_destino);
  }

  if (fecha_transaccion) {
    query += ' AND DATE(fecha_transaccion) = $' + (values.length + 1);
    values.push(fecha_transaccion);
  }

  query += ' GROUP BY tipo_operacion;';

  try {
    const result = await pool.query(query, values);
    res.status(200).send(result.rows);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send({ error: 'Error al obtener el monto y cantidad de las operaciones' });
  }
});

app.get("/conciliacion-bancos", async (req, res) => {
  const { banco_origen, banco_destino, fecha_transaccion } = req.query;

  let query = `SELECT banco_origen, banco_destino,
               SUM(CASE WHEN tipo_operacion = 'deposito' THEN monto::DECIMAL ELSE -monto::DECIMAL END) as balance
               FROM transacciones WHERE true`;
  const values = [];

  if (banco_origen) {
    query += ' AND banco_origen = $' + (values.length + 1);
    values.push(banco_origen);
  }

  if (banco_destino) {
    query += ' AND banco_destino = $' + (values.length + 1);
    values.push(banco_destino);
  }

  if (fecha_transaccion) {
    query += ' AND DATE(fecha_transaccion) = $' + (values.length + 1);
    values.push(fecha_transaccion);
  }

  query += ' GROUP BY banco_origen, banco_destino;';

  try {
    const result = await pool.query(query, values);
    res.status(200).send(result.rows);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send({ error: 'Error al obtener la conciliación entre los bancos' });
  }
});

app.get("/ultimas-transacciones", async (req, res) => {
  const { banco_origen, banco_destino, fecha_transaccion } = req.query;

  let query = 'SELECT * FROM transacciones WHERE true';
  const values = [];

  if (banco_origen) {
    query += ' AND banco_origen = $' + (values.length + 1);
    values.push(banco_origen);
  }

  if (banco_destino) {
    query += ' AND banco_destino = $' + (values.length + 1);
    values.push(banco_destino);
  }

  if (fecha_transaccion) {
    query += ' AND DATE(fecha_transaccion) = $' + (values.length + 1);
    values.push(fecha_transaccion);
  }

  query += ' ORDER BY fecha_transaccion DESC LIMIT 100';

  try {
    const result = await pool.query(query, values);
    res.status(200).send(result.rows);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send({ error: 'Error al obtener las últimas transacciones' });
  }
});



app.get("/histograma", async (req, res) => {
  const { banco_origen, banco_destino, fecha_transaccion } = req.query;

  let query = `SELECT
    SUM(CASE WHEN CAST(monto AS DECIMAL) < 10000 THEN 1 ELSE 0 END) AS "menor_10k",
    SUM(CASE WHEN CAST(monto AS DECIMAL) BETWEEN 10000 AND 49999 THEN 1 ELSE 0 END) AS "entre_10k_50k",
    SUM(CASE WHEN CAST(monto AS DECIMAL) BETWEEN 50000 AND 99999 THEN 1 ELSE 0 END) AS "entre_50k_100k",
    SUM(CASE WHEN CAST(monto AS DECIMAL) BETWEEN 100000 AND 499999 THEN 1 ELSE 0 END) AS "entre_100k_500k",
    SUM(CASE WHEN CAST(monto AS DECIMAL) BETWEEN 500000 AND 999999 THEN 1 ELSE 0 END) AS "entre_500k_1m",
    SUM(CASE WHEN CAST(monto AS DECIMAL) BETWEEN 1000000 AND 9999999 THEN 1 ELSE 0 END) AS "entre_1m_10m",
    SUM(CASE WHEN CAST(monto AS DECIMAL) > 9999999 THEN 1 ELSE 0 END) AS "mas_10m"
  FROM transacciones WHERE true`;
  
  const values = [];

  if (banco_origen) {
    query += ' AND banco_origen = $' + (values.length + 1);
    values.push(banco_origen);
  }

  if (banco_destino) {
    query += ' AND banco_destino = $' + (values.length + 1);
    values.push(banco_destino);
  }

  if (fecha_transaccion) {
    query += ' AND DATE(fecha_transaccion) = $' + (values.length + 1);
    values.push(fecha_transaccion);
  }

  try {
    const result = await pool.query(query, values);
    res.status(200).send(result.rows[0]);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send({ error: 'Error al obtener los datos para el histograma' });
  }
});
