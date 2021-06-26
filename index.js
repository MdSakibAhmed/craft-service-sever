const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb+srv://craft400:craft24023@cluster0.wjywa.mongodb.net/craft-service?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// Midlware
app.use(cors())
app.use(express.json())


client.connect(err => {

  const seatCollection = client.db("craft-service").collection("seats");
  const bookedCollection = client.db("craft-service").collection("booked-list")

  app.post("/addSeats", (req,res) => {
    const data = req.body;
    seatCollection.insertMany(data).then(result => {
        console.log(result)
    })
})


app.get("/seats/:class", (req, res) => {
    const category = req.params.class
    seatCollection.find({class:category}).toArray((err, seats) => {
        res.send(seats)
    })
})

app.post("/bookSeat/:id", (req,res) => {
    const bookedSeat = req.body;

    seatCollection.find({_id:ObjectId(req.params.id),status:"booked"}).toArray((err,seat) => {
        console.log(seat);
        if(seat.length > 0){

            res.send({status:"already booked"})
        }

        else {
            bookedCollection.insertOne(bookedSeat).then(result => {
                console.log(result);
               res.send(result.insertedCount > 0) 
            })
        }
    })
})

app.patch('/updateStatus/:id',(req,res) => {
    const id = req.params.id
    const status = req.body.status;
    console.log(id,status);
    seatCollection.updateOne({_id:ObjectId(id)},{
        $set:{status:status}
    }).then(result => {
        console.log(result);
        res.send(result.modifiedCount > 0)
    })
})


app.get("/bookedSeat",(req,res) => {
    bookedCollection.find({}).toArray((err,seats) => {
        res.send(seats)
    })
})


app.get("/getBookSeat/:id", (req,res) =>  {
    seatCollection.find({_id:ObjectId(req.params.id)}).toArray((err,seat) => {
        res.send(seat)
    })
})

app.delete("delete/:id",(req,res) => {
    seatCollection.deleteOne({_id:ObjectId(req.params.id)}).then(result => {
     res.send(result.deletedCount > 0)
    })
})


console.log(err);
 
});

app.listen(port)


