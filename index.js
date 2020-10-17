const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const admin = require('firebase-admin')
const filePath =
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u2cqf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}))
app.use(cors());
app.use(express.static('orders'));
app.use(fileUpload());

const port = 5000;

app.get('/',(req, res) => {
    res.send("Hello from db it's working")
})

const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true  });
client.connect(err => {
  const orderCollection = client.db("creativeAgency").collection("orderCollection");
  

app.post('/addService', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const details = req.body.details;
    const title = req.body.title;
    const newImg = req.files.file.data;
    const encImg = newImg.toString('base64');
    var image = {
      contentType: req.files.file.mimetype,
      size: req.files.file.size,
      img: Buffer.from(encImg, 'base64')
    }
    orderCollection.insertOne({ name,email,title,details,image })
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  
  app.get('/services', (req, res) => {
    orderCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

});

app.listen(process.env.PORT || port);