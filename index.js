const express = require('express');
const app = express();
const port = 85;
const mysql = require('mysql2');

// Middleware to parse JSON request bodies
app.use(express.json());

//
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bd_sistema2',
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




app.get('/usuarios', (req, res) => {
  const query = 'SELECT u.correo, u.password  FROM `usuarios` AS u';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los usuarios:', err);
      return res.status(500).json({ message: 'Error al obtener los usuarios' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios' });
    }

    res.json(results);
  });
});


app.put('/usuario', (req, res) => {
  const { dni, nombre, ape_pa, ape_ma, correo, contacto, sexo, fecha_nac, universidad, carrera } = req.body;

  if (!dni || !nombre || !ape_pa || !correo) {
    return res.status(400).json({ message: 'Faltan datos requeridos para actualizar' });
  }

  const query = `
    UPDATE usuarios
    SET 
      nombre = ?, 
      ape_pa = ?, 
      ape_ma = ?, 
      correo = ?, 
      contacto = ?, 
      sexo = ?, 
      fecha_nac = ?, 
      universidad = ?, 
      carrera = ?
    WHERE dni = ?
  `;

  connection.query(
    query,
    [nombre, ape_pa, ape_ma, correo, contacto, sexo, fecha_nac, universidad, carrera, dni],
    (err, results) => {
      if (err) {
        console.error('Error al actualizar los datos del usuario:', err);
        return res.status(500).json({ message: 'Error interno al actualizar los datos del usuario' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.status(200).json({ message: 'Usuario actualizado con éxito' });
    }
  );
});



// API 6:
app.get('/api/evaluacion', (req, res) => {
  const { ID_usuario, ID_tipo_evaluacion, Respuestas } = req.query;

  if (!ID_usuario || !ID_tipo_evaluacion || !Respuestas) {
    return res.status(400).json({ message: 'Faltan parámetros en la solicitud' });}

  if (Respuestas.length !== 25) {
    return res.status(400).json({ message: 'No son suficientes respuestas' });}

  const fecha_respuesta = new Date();

  const queryInsertRespuesta = 'INSERT INTO respuestas (fecha_respuesta, ID_usuario, ID_tipo_evaluacion) VALUES (?, ?, ?)';
  db.query(queryInsertRespuesta, [fecha_respuesta, ID_usuario, ID_tipo_evaluacion], (err, result) => {
    if (err) {
      console.error('Error al insertar respuesta: ' + err.stack);
      return res.status(500).json({ message: 'Error al registrar la respuesta' });
    }

    const ID_respuesta = result.insertId;

  const queryInsertDetalleRespuesta = 'INSERT INTO detalle_respuesta (ID_respuesta, ID_pregunta, respuesta) VALUES (?, ?, ?)';
      
  // Usar un bucle para insertar las respuestas
  for (let i = 0; i < Respuestas.length; i++) {
    const respuesta = Respuestas[i];
    const ID_pregunta = i+5;

    db.query(queryInsertDetalleRespuesta, [ID_respuesta, ID_pregunta, respuesta], (err) => {
      if (err) {
        console.error('Error al insertar detalle de respuesta: ' + err.stack);
      }
    });
  }

  return res.status(200).json({ message: 'Respuestas registradas' });
  });
});


app.get('/tipoeval', (req, res) => {
  const query = 'SELECT ID_tipo_evaluacion, nombre, descripcion FROM tipo_evaluaciones';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los tipos de evaluación:', err);
      return res.status(500).json({ message: 'Error al obtener los tipos de evaluación' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron tipos de evaluación' });
    }

    res.json(results);
  });
});


app.get('/preguntas/tipoeval', (req, res) => {
  const query = 'SELECT p.ID_pregunta,p.contenido, te.nombre, te.descripcion FROM `preguntas` as p INNER JOIN `tipo_evaluaciones` as te on te.ID_tipo_evaluacion= p.ID_tipo_evaluacion';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los tipos de evaluación:', err);
      return res.status(500).json({ message: 'Error al obtener los tipos de evaluación' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron tipos de evaluación' });
    }

    res.json(results);
  });
});


app.get('/alternativa/pregunta', (req, res) => {
  const query = 'SELECT al.ID_alternativa, pre.contenido, al.descripcion, al.valor FROM `alternativas` as al INNER JOIN `preguntas` as pre on al.ID_pregunta = pre.ID_pregunta';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los tipos de evaluación:', err);
      return res.status(500).json({ message: 'Error al obtener los tipos de evaluación' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron tipos de evaluación' });
    }

    res.json(results);
  });
});


app.get('/historial/detalle/usuarios/:id', (req, res) => {
  const userId = req.params.id; // Obtiene el ID del usuario desde los parámetros de la URL

  const query = 'SELECT * FROM usuarios WHERE ID_usuario = ?';

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener el usuario:', err);
      return res.status(500).json({ message: 'Error al obtener el usuario' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(results[0]); // Devuelve solo el primer usuario encontrado
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
