const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 9000;

const app = express();

const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://solor:8s8H0OoLdYIqF7aS@cluster0.ejjfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const jobsCollection = client.db('solo').collection('jobs');
    const bidsCollection = client.db('solo').collection('bids');
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

     // get all jobs data from db 
    app.get('/jobs', async (req, res) => {
        const result = await jobsCollection.find().toArray();
        res.send(result);
    })

    // Get a single job data from db using job  id 
    app.get('/job/:id', async ( req, res) =>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}   // to match data form database 
      const result = await jobsCollection.findOne(query);
      res.send(result);
    })
     // send bid data in server 
    app.post('/bid', async (req, res) => {
      const bidDate = req.body;
      console.log(bidDate);
      const result = await bidsCollection.insertOne(bidDate);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// authentication 
// solor   ,   8s8H0OoLdYIqF7aS


app.listen(port, () => console.log(`Server running on port ${port}`));

app.get('/', (req, res) => {
    res.send('Hello Our server is running');
});


