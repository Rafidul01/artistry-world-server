const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middlewares--------
app.use(cors(
  {
    origin: [
      "http://localhost:5173",
      "https://artistry-world.web.app",
      "https://artistry-world.firebaseapp.com"
    ],
  }
));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hjxwn6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const craftCollection = client.db("artistryWorld").collection("crafts");
    const categoriesCollection = client.db("artistryWorld").collection("subcategory");

    app.get("/crafts", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });

    app.get("/crafts/user/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { user_email: email };
      const cursor = craftCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/myCrafts/:email/:option", async (req,res) => {
      const email = req.params.email;
      const option = req.params.option;
      const query = { 
        user_email: email,
        customization: option
       };
      const cursor = craftCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/categories", async (req, res) => {
      const cursor = categoriesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/categories/:subcategory", async (req, res) => {
      const subcategory = req.params.subcategory;
      console.log(subcategory);
      const query = { subcategory_name: subcategory };
      const cursor = craftCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/addCraft", async (req, res) => {
      console.log(req.body);
      const result = await craftCollection.insertOne(req.body);
      console.log(result);
      res.send(result);
    });

    app.put("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      // const options = { upsert: true };
      const updateCraft = req.body;
      const craft = {
        $set: {
          item_name: updateCraft.item_name,
          image: updateCraft.image,
          subcategory_name: updateCraft.subcategory_name,
          customization: updateCraft.customization,
          price: updateCraft.price,
          processing_time: updateCraft.processing_time,
          stockStatus: updateCraft.stockStatus,
          description: updateCraft.description,
          rating: updateCraft.rating
        },
      };
      const result = await craftCollection.updateOne(filter,craft);
      res.send(result);
    });

    app.delete("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("artistry world server is running ......");
});

app.listen(port, () => {
  console.log(`artistry world server is running on port : ${port}`);
});
