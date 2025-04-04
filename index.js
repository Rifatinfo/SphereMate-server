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
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ejjfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
     // send job data in server 
    app.post('/job', async (req, res) => {
      const jobDate = req.body;
      console.log(jobDate);
      const result = await jobsCollection.insertOne(jobDate);
      res.send(result);
    })

    // get all jobs posted by specific user 
    app.get('/jobs/:email', async (req, res) =>{
      const email = req.params.email;
      const query = {'buyer.email' : email}
      const result = await jobsCollection.find(query).toArray();
      res.send(result);
    })

    // delete a job data from db 
    app.delete('/job/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await jobsCollection.deleteOne(query);
      res.send(result);
    })

    // update a job in db 
    app.put('/job/:id', async(req, res) =>{
      const id = req.params.id;
      const jobDate = req.body;
      const query = {_id: new ObjectId(id)};
      const option = {
        upsert : true
      }
      const updateDoc = {
        $set : {
          ...jobDate,
        }
      }
      const result = await jobsCollection.updateOne(query, updateDoc, option);
      res.send(result);
    })

    app.get('/my-bids/:email', async (req, res) =>{
      const email = req.params.email;
      const query = {email}
      const result = await bidsCollection.find(query).toArray();
      res.send(result);
    })

    // Get All bid request from db for job owner 
    app.get('/bid-request/:email', async (req, res) => {
      const email = req.params.email;
      const query = {'buyer.email' :email}
      const result = await bidsCollection.find(query).toArray();
      res.send(result);
    })

    // Update Bid status 
    app.patch('/bid/:id', async (req, res) => {
      const id = req.params.id;
      const status = req.body;
      const query = { _id : new ObjectId(id)}
      const updateDoc = {
        $set : status,
      }
      const result = await bidsCollection.updateOne(query,updateDoc)
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


