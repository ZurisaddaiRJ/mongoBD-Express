const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.options('*', cors());
const port = 3001;

const uri = 'mongodb+srv://zurisaddairj:mongo_Atlas.1102@books.hgiw0w5.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function startServer() {
  try {
    await client.connect();
    console.log('Conexión a MongoDB establecida');

    app.use(express.json());

    app.get('/users', async (req, res) => {
      try {
        const db = client.db('books');
        const collection = db.collection('books_comments');
        const users = await collection.find().toArray();
        res.json(users);
      } catch (error) {
        console.error('Error al obtener los usuarios', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
      }
    });

    app.get('/documents/:objectId/reactions/:reactionId', async (req, res) => {
      const objectId = req.params.objectId;
      const reactionId = req.params.reactionId;

      try {
        const db = client.db('books');
        const collection = db.collection('books_summaryreactions');

        const query = { "_id.objectId": objectId, "_id.reactionId": reactionId };
        const result = await collection.find(query).toArray();

        console.log('Registros encontrados:', result);
        res.json(result);
      } catch (error) {
        console.error('Error al realizar la consulta', error);
        res.status(500).json({ error: 'Error al realizar la consulta' });
      }
    });

    app.get('/commentsByUserId/:userId/', async (req, res) => {
      const userId = req.params.userId;

      try {
        const db = client.db('books');
        const collection = db.collection('books_comments');

        const query = { "objectId": userId };
        const result = await collection.find(query).toArray();

        console.log('Registros encontrados:', result);
        res.json(result);
      } catch (error) {
        console.error('Error al realizar la consulta', error);
        res.status(500).json({ error: 'Error al realizar la consulta' });
      }
    });

    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error al conectar a MongoDB', error);
    process.exit(1); // Salir de la aplicación si no se puede conectar a MongoDB
  }
}

startServer();
