const express =require('express');
require('dotenv').config();
const cors =require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express();
const port =process.env.PORT || 3000;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nywi6wf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
// Connect the client to the server	(optional starting in v4.7)
    await client.connect();
 
    const tourPackageCollections = client.db('tourPackagesCollection').collection('tourPackage')

  app.post('/addPackage',async(req,res)=>{
    const package =req.body;
    const result =await tourPackageCollections.insertOne(package);
    res.send(result)
  })

  app.get('/addPackage',async(req,res)=>{
    const result=await tourPackageCollections.find().toArray();
    res.send(result)
  })
app.get('packageDetails/:id',async(req,res)=>{
    const id=req.params.id;
    const query ={
    _id: new ObjectId(id)
    }
    const result=await tourPackageCollections.findOne();
    res.send(result)
})





    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);













app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("welcome to our Tour Package booking page ")
})

app.listen(port,()=>{
    console.log(`tour server is running at ${port}`)
})