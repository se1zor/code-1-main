import express from 'express'
import{PORT, MongoDBURL} from './config.js'
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb"
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
    //route to show all books
    mybooks.find().toArray()
    .then(response=>{
        return res.status(200).send(response)
    })
})
app.get('/shop/:id', (req, res) => { //route/page on the server/ tab
    const data = req.params
    //route to show selected book
    
    const filter = {
        "_id" : new ObjectId(data.id)
    }
    mybooks.findOne(filter)
    .then(response => {
        return res.status(300).send(response)
    })
    .catch(err=>console.log(err))
})

app.post('/admin/savebook', (req, res)=> {
    //route to add a book 
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

app.delete('/admin/remove/:id', (req, res)=>{
    const data = req.params 
    const filter = {
        "_id" : new ObjectId(data.id)
    }
    mybooks.deleteOne(filter)
    .then(response => {
        return res.status(300).send(response)
    })
    .catch(err=>console.log(err))
})

app.put('/admin/update/:id/', (req, res)=>{
    const data = req.params
    const docdata = req.body

    const filter ={
        "_id":  new ObjectId(data.id)
    }

    const updoc = {
        $set:{
            ...docdata
        }
    }
    
    mybooks.updateOne(filter, updoc)
    .then(response =>{
        res.status(200).send(response)
    })
    .catch(err=>console.log(err))
})