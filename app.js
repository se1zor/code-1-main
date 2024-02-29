import express from 'express'
import{PORT, MongoDBURL} from './config.js'
import { MongoClient, ServerApiVersion } from "mongodb"
const app = express()

app.use(express.json()) //converts any incoming data into json

const client = new MongoClient(MongoDBURL,  {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);

const booksDB = client.db("mybookshop")
const mybooks = booksDB.collection("bookscollection")

app.listen(PORT, ()=> {
    console.log (`Server started on port ${PORT}`) 
    
   
})
//res- data going to the client
//req- is data copming in from the client

app.get('/', (req, res) => {
    return res.status(200).send("Wagwann bruuda")
})

app.get('/shop', (req, res) => {
    return res.status(200).send("Welcome to the shop!!")
})
app.get('/shop/:id', (req, res) => { //route/page on the server/ tab
    const data = req.params
    return res.status(200).send(`<a href='/'> Your Data : ${data.id}</a>`)
})

app.post('/savebook', (req, res)=> {
    const data = req.body
    if(!data.title)
    return res.status(400).send("no tittles found")
    if(!data.author)
    return res.status(400).send("no authors found")
    if(!data.price)
    return res.status(400).send("no prices found")

     mybooks.insertOne(data, (error, response)=>{
        if (error){
            console.log("ERROR MUTHA FUCKOR")
            return res.sendStatus(500)
        }

     })

    return res.status(201).send(JSON.stringify(data))
})