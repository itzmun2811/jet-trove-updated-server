const express =require('express');
require('dotenv').config();
const cors =require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express();
const port =process.env.PORT || 3000;

app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nywi6wf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const admin = require("firebase-admin");
const decoded=Buffer.from(process.env.FB_SERVICE_KEY,'base64').toString('utf8')
const serviceAccount = JSON.parse(decoded);


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});






const verifyFireBaseToken=async(req,res,next)=>{
const authHeader =req.headers?.authorization;
if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(401).send({message:'unauthorized access'})
}
 const token =authHeader.split(' ')[1];

try{
const decoded =await admin.auth().verifyIdToken(token);
console.log('decoded token',decoded)
req.decoded =decoded;
next()
}
catch(error){
   return res.status(401).send({message:'unauthorized access'})
}
}





async function run() {
  try {
// Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
 
    const tourPackageCollections = client.db('tourPackagesCollection').collection('tourPackage')
    const featuredDataCollections=client.db('featuredDataCollection').collection('featuredData')
    const bookingCollections=client.db('bookingCollection').collection('booking')
 // featured data related api
  app.get('/featuredData',async(req,res)=>{
     const result = await featuredDataCollections.find().toArray();
     res.send(result)

  })
 
//  package related api
    app.post('/addPackage',verifyFireBaseToken,async(req,res)=>{
       
  const package = req.body;
 const result =await tourPackageCollections.insertOne(package);
    res.send(result)
  })

  app.get('/addPackage',async(req,res)=>{
    const result=await tourPackageCollections.find().toArray();
    res.send(result)
   })
    
 app.get('/addPackageBySearch',async(req,res)=>{
     const search =req.query.search  ;
     console.log(search);
     const query={
        $or:[
           { 'tour-name': { $regex: search, $options: 'i' } },
            {destination:{$regex: search,
                $options:'i'
            }}
        ]
     }
     const result=await tourPackageCollections.find(query).toArray()
     res.send(result)
  })
  app.get('/addPackageByEmail',verifyFireBaseToken,async(req,res)=>{
    const email=req.query.email;
   if(email !== req.decoded.email){
    return res.status(403).send({message:'forbidden access'})
   }


    const query ={};
    if(email){
        query['guide-email']= email
    }
    const result =await tourPackageCollections.find(query).toArray()
    res.send(result)
  })
app.get('/addPackage/:id',async(req,res)=>{


    const id=req.params.id;
    const query ={
    _id: new ObjectId(id)
    }
    const result=await tourPackageCollections.findOne(query);
    res.send(result)
})

 

app.patch('/addPackage/:id',verifyFireBaseToken,async(req,res)=>{
    const id =req.params.id;
    const query={
    _id:  new ObjectId(id)
    }
    const updatedDoc={
        $inc:{
            bookingCount : 1
        }
    }
    const result=await tourPackageCollections.updateOne(query,updatedDoc)
    res.send(result)
})
app.delete('/addPackage/:id',verifyFireBaseToken,async(req,res)=>{
    const id =req.params.id;
   
    const query ={
        _id : new ObjectId(id)
    }
    const result= await tourPackageCollections.deleteOne(query)
    res.send(result)
})

app.put('/addPackage/:id',verifyFireBaseToken,async(req,res)=>{
   const id = req.params.id;
   const email=req.query.email;
   if(email !== req.decoded.email){
    return res.status(403).send({message:'forbidden access'})
   }

    const query ={
    _id: new ObjectId(id)
    }
    const updatedData=req.body;
    const updatedDoc={
        $set:updatedData
    }
    const result = await tourPackageCollections.updateOne(query,updatedDoc);
    res.send(result)
})

// booking related api
 app.post('/booking',verifyFireBaseToken,async(req,res)=>{
     const email =req.query.email;
     if(email !== req.decoded.email){
    return res.status(403).send({message:'forbidden access'},)
   }
  
    const booking=req.body;
    const result=await bookingCollections.insertOne(booking);
    res.send(result)
 })
 app.get('/booking',verifyFireBaseToken,async(req,res)=>{
     const email =req.query.email;
     if(email !== req.decoded.email){
    return res.status(403).send({message:'forbidden access'})
   }
     const query={};
    if(email){
        query['buyer-email']= email;
    }
    const result =await bookingCollections.find(query).toArray()
    res.send(result)
 })
 app.patch('/booking/:id',verifyFireBaseToken,async(req,res)=>{
const email =req.query.email;
     if(email !== req.decoded.email){
    return res.status(403).send({message:'forbidden access'})
   }
    const id=req.params.id;
    const query={
        _id: new ObjectId(id)
    }

    const updatedStatus ={
     $set:{
        status:'completed'
     }
    }
    const result =await bookingCollections.updateOne(query,updatedStatus)
    res.send(result)
 })



    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  
  finally {
    
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