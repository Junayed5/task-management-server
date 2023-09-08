const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


// user:end-game
// pass:egyHvm4I2YE5Yjfc


const uri = "mongodb+srv://end-game:egyHvm4I2YE5Yjfc@cluster0.myonw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("end-game").collection("task");
        const completeCollection = client.db("end-game").collection("complete");
        const scheduleCollection = client.db("end-game").collection("schedule");
        const usersCollection = client.db("end-game").collection("users");

        app.post('/task', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result);
        })

        app.get('/tasks', async (req, res) => {
            const result = await taskCollection.find({}).toArray();
            res.send(result);
        })

        app.patch('/taskComplete/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: true
                }
            }
            const result = await taskCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.put('/taskShare/:id', async (req, res) => {
            const id = req.params.id;
            const email = req.body;
            const option = { upsert: true }
            const filter = { _id: ObjectId(id) };
            const updatedDoc = {
                $push: {
                    shareWith: email.mail
                }
            }
            // console.log(email);
            const result = await taskCollection.updateOne(filter, updatedDoc, option);
            res.send(result);
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
        app.get('/users', async (req, res) => {
            const users = await usersCollection.find({}).toArray();
            res.send(users);
        })
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const users = await usersCollection.findOne(query);
            res.send(users);
        })


    }
    finally { }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(port, () => {
    console.log('listening port', port);
})