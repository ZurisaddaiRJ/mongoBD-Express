const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.options('*', cors());
const port = 3001;

const uri = 'mongodb+srv://rodrigomencias08:o8Nl0JitEmFTB6YB@cluster0.7ipkl3j.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('peliculas');
    const collection = db.collection('peliculas_comments');
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
    await client.connect();
    const db = client.db('peliculas');
    const collection = db.collection('peliculas_summaryreactions');

    const query = { "_id.objectId": objectId, "_id.reactionId": reactionId };
    const result = await collection.find(query).toArray();

    console.log('Registros encontrados:', result);
    res.json(result);
  } catch (error) {
    console.error('Error al realizar la consulta', error);
    res.status(500).json({ error: 'Error al realizar la consulta' });
  } finally {
    await client.close();
  }
});

app.get('/commentsByUserId/:userId/', async (req, res) => {
  const userId = req.params.userId;

  try {
    await client.connect();
    const db = client.db('peliculas');
    const collection = db.collection('peliculas_comments');

    const query = { "userId": userId };
    const result = await collection.find(query).toArray();

    console.log('Registros encontrados:', result);
    res.json(result);
  } catch (error) {
    console.error('Error al realizar la consulta', error);
    res.status(500).json({ error: 'Error al realizar la consulta' });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
