const express = require('express');
const app = express();
const port = 80;
const mysql = require('mysql2');

// Middleware to parse JSON request bodies
app.use(express.json());

//
const connection = mysql.createConnection({
  host: '10.27.160.3',
  user: 'ia2024',
  password: '123456',
  database: 'aplicacion',
  port: 3306,
});

connection.connect(err => {
  if (err) {
    console.error('Error de conexión:', err.stack);
    return;
  }
  console.log('Conectado', connection.threadId);
});


app.get('/hola', (req, res) => {
  res.send('Servicio de backend para el proyecto de IA en UPN 2024-2');
});


//
app.post('/login', (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
  }
  const checkEmailQuery = 'SELECT * FROM usuarios WHERE correo = ?';
  connection.query(checkEmailQuery, [correo], (err, results) => {
    if (err) {
      console.error('Error al verificar correo:', err);
      return res.status(500).json({ message: 'Error interno al verificar el correo' });
    }


    if (results.length === 0) {
      return res.status(401).json({ message: 'Correo incorrecto. Intente nuevamente.' });
    }

    const user = results[0]; 
    if (user.password === password) {
      res.status(200).json({ message: 'Usuario autenticado' });
    } else {
      res.status(401).json({ message: 'Contraseña incorrecta. Intente nuevamente.' });
    }
  
  });
});


app.post('/registrarUsuario', (req, res) => {
  const {
    nombre, ape_pa, ape_ma = null, dni, contacto = null, correo, sexo = null,
    fecha_nac = null, universidad = null, carrera = null, password
  } = req.body;

  if (!nombre || !ape_pa || !dni || !correo || !password) {
    return res.status(400).json({ message: 'Faltan Datos' });
  }

  connection.query(
    'SELECT * FROM usuarios WHERE dni = ? OR correo = ?',
    [dni, correo],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error interno al verificar el usuario' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'El DNI o correo electrónico ya está registrado' });
      }

      const query = `
        INSERT INTO usuarios (nombre, ape_pa, ape_ma, dni, contacto, correo, sexo, fecha_nac, universidad, carrera, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      connection.query(query, [nombre, ape_pa, ape_ma, dni, contacto, correo, sexo, fecha_nac, universidad, carrera, password], (err, results) => {
        if (err) {
          return res.status(500).json({ message: 'Error interno al crear el usuario' });
        }

        res.status(201).json({ message: 'Usuario creado con éxito', id: results.insertId });
      });
    }
  );
});


// API 1: Get a greeting message
app.get('/api/greeting', (req, res) => {
  res.json({ message: 'Hello, welcome to our API!' });
});

// API 2: Get the current server time
app.get('/api/time', (req, res) => {
  const currentTime = new Date().toISOString();
  res.json({ time: currentTime });
});

// API 3: Get a random quote
app.get('/api/quote', (req, res) => {
  const quotes = [
    'The only limit to our realization of tomorrow is our doubts of today.',
    'Do not go where the path may lead, go instead where there is no path and leave a trail.',
    'In the middle of every difficulty lies opportunity.',
    'Success is not final, failure is not fatal: It is the courage to continue that counts.',
    'The best way to predict the future is to create it.'
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json({ quote: randomQuote });
});

// API 4: POST request to print the request body
app.post('/api/print', (req, res) => {
  console.log('Received POST request with body:', req.body);
  res.json({ message: 'Request body received successfully', body: req.body });
});

//API 5 : post IniciarSesion
app.post('/iniciarSesion', (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
  }
  const checkEmailQuery = 'SELECT * FROM usuarios WHERE correo = ?';
  connection.query(checkEmailQuery, [correo], (err, results) => {
    if (err) {
      console.error('Error al verificar correo:', err);
      return res.status(500).json({ message: 'Error interno al verificar el correo' });
    }


    if (results.length === 0) {
      return res.status(401).json({ message: 'Correo incorrecto. Intente nuevamente.' });
    }

    const user = results[0]; 
    if (user.password === password) {
      res.status(200).json({ message: 'Usuario autenticado' });
    } else {
      res.status(401).json({ message: 'Contraseña incorrecta. Intente nuevamente.' });
    }
  
  });
});

























//
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
