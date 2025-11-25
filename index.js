const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 4000


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@personal-hero.gxzvpbe.mongodb.net/?appName=Personal-Hero`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {
        // await client.connect();

        const db = client.db('hero-courses-DB')
        const courseCollection = db.collection('courses')


        app.get('/', (req, res) => {
            res.send("hero courses server is running")
        })

        app.get('/all-courses', async (req, res) => {
            try {
                const query = {}
                const result = await courseCollection.find(query, { projection: { description: 0 } }).toArray()
                res.send(result)
            }
            catch (err) {
                res.send({
                    message: "failed to get all courses",
                    err
                })
            }
        })

        app.get('/featured_course', async (req, res) => {
            try {
                const email = "hasibadi22@gmail.com"
                const result = await courseCollection.find({ owner_email: email }).toArray()
                res.send(result)
            }
            catch (err) {
                res.send({
                    message: "Can't get featured courses",
                    err
                })
            }
        })

        app.get('/course_details/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }
                const result = await courseCollection.findOne(query)
                res.send(result)
            }
            catch (err) {
                res.send({
                    message: "failed to get course by id",
                    err
                })
            }
        })

        app.get('/my-courses', async (req, res) => {
            try {
                const email = req.query.email
                const query = {
                    owner_email: email
                }
                const cursor = courseCollection.find(query, { projection: { description: 0 } })
                const result = await cursor.toArray()
                res.send(result)
            }
            catch (err) {
                res.send({
                    message: "couldn't get the courses for a specific developer",
                    err
                })
            }
        })

        app.post('/courses', async (req, res) => {
            try {
                const course = req.body
                course.created_at = new Date()

                const result = await courseCollection.insertOne(course)
                res.send(result)
            }
            catch (err) {
                res.send({
                    message: "failed to post courses",
                    err
                })
            }
        })

        app.delete('/courses/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const result = await courseCollection.deleteOne({ _id: new ObjectId(id) })

                res.send(result)
            }
            catch (err) {
                res.send({
                    message: "failed to Delete a course",
                    err
                })
            }
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`hero courses server is running on port:${port}}`)
})
