const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require("mongodb");
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oexcdfc.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const allToysCollection = client.db("toysMarketPlace").collection("allToys")

    // getting all toy
    app.get('/allToy', async(req, res) => {
        const result = await allToysCollection.find().toArray();
        res.send(result);
    })

    // category wise data
    app.get('/allToy/:category', async(req, res) => {
        const query = { category: `${req.params.category}` };
        const cursor = await allToysCollection.find(query).toArray();
        res.send(cursor);
    })

    // all toy details by using id
    app.get('/allToy/:id', async (req, res) => {
        const id = req.params.id;
        const cursor = { _id: new ObjectId(id) };
        const result = await allToysCollection.findOne(cursor);
        // console.log('Toy data', result);
        res.send(result);
    });

    // get allAddToy
    app.get('/allAddToy', async(req, res) => {
        const result = await allToysCollection.find().toArray();
        res.send(result);
    })

    // searching method with toy name
    app.get('/allAddToy/:text', async(req, res) => {
        const query = req.params.text;
        const result = await allToysCollection.find({
            $or: [
                { name: { $regex: query, $options: "i"}}
            ]
        }).toArray();
        
        res.send(result);
    })

    // post all new toy to database
    app.post('/allAddToy', async(req, res) => {
        const body = req.body;
        console.log(body)
        const result = await allToysCollection.insertOne(body);
        console.log(result);
        res.send(result)
    })

    // see details every toy
    app.get('/toyDetails/:id', async (req, res) => {
        const id = req.params.id;
        const cursor = { _id: new ObjectId(id) }
        const result = await allToysCollection.findOne(cursor);
        res.send(result);
    })

    // // getting email wise data
    // app.get('/allAddToy', async(req, res) => {
    //     console.log(req.query.seller_email);
    //     let query = {};
    //     if(req.query.seller_email) {
    //         query = { seller_email: req.query.seller_email }
    //     }
    //     const result = await allToysCollection.find(query).toArray();
    //     res.send(result);
    // // })

    // app.patch('/allAddToy/:id', async(req, res) => {
    //     const body = req.body;
    //     console.log(body);
    // })
    
    // for delete
    app.delete('/allAddToy/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id)}
        const result = await allToysCollection.deleteOne(query);
        res.send(result);
    })

    // get allAddToy
    app.get('/allToys', async(req, res) => {
        const result = await allToysCollection.find().toArray();
        res.send(result);
    })

     // getting myToys by email
     app.get('/allToys/:email', async (req, res) => {
        const result = await allToysCollection.find({ seller_email: req.params.email })
       //   .sort({createdAt: -});
          .toArray()
        res.send(result);
      });

    // for updating user post toy
    // app.put('/allAddToy/:id', async(req, res) => {
    //     const id = req.params.id;
    //     const query = { _id: new ObjectId(id) };
    //     const options = { upsert: true };
    //     const body = req.body;
    //     const updateToy = {
    //         $set: {
    //             price: body.price,
    //             quantity: body.quantity,
    //             description: body.description
    //         }
    //     }
    //     const result = await allToysCollection.updateOne( query, updateToy, options );
    //     res.send(result);
    // })

    // app.patch('/allAddToy/:id', async(req, res) => {
    //     const body = req.body;
    //     console.log(body);
    // })

    app.put('/allAddToy/:id', async (req, res) => {
        const id = req.params.id;
        const body = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateToy = {
          $set: {
          
            price: body.price,
            quantity: body.quantity,
            description: body.description,
          },
        };
        const result = await allToysCollection.updateOne(filter, updateToy);
        res.send(result);
      });

    // app.put('/allAddToy/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const body = req.body;
  
    //     try {
    //         const filter = { _id: new ObjectId(id) };
    //         const updateToy = {
    //             $set: {
    //             price: body.price,
    //           quantity: body.quantity,
    //           description: body.description,
    //         },
    //       };
  
    //       const result = await allToysCollection.updateOne(filter, updateToy);
  
    //       if (result.matchedCount > 0) {
    //         res.json({ message: 'Toy updated successfully' });
    //       } else {
    //         res.status(404).json({ error: 'Toy not found' });
    //       }
    //     } catch (error) {
    //       res.status(500).json({ error: 'Internal server error' });
    //     }
    // });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('MarketPlace is Running')
})

app.listen(port, () => {
    console.log(`Toy MarketPlace is running on port ${port}`);
})