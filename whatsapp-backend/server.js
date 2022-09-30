//import

import express from "express";
import mongoose from 'mongoose'
import Messages from './dbMessage.js'
import Rooms from './dbRoom.js'
import Pusher from "pusher";
import cors from 'cors'
import mongodb from 'mongodb'

//app config
const objectId= mongodb.ObjectId
const app=express()
const port=process.env.PORT || 4000
const pusher = new Pusher
    ({
        appId: "1475395",
        key: "47eab3205975d34e7048",
        secret: "529bfddfb567cca3fad9",
        cluster: "ap2",
        useTLS: true
    });

const db=mongoose.connection
db.once('open',()=>
{
    console.log('Database connected')
    const messageCollection=db.collection('messages')
    const changeStream=messageCollection.watch()

    changeStream.on('change',(change)=>
    {
        //console.log(change)
        if(change.operationType==='insert')
        {
            const messageDetails=change.fullDocument
            pusher.trigger('message','inserted',
            {
                roomId:messageDetails.roomId,
                roomName:messageDetails.roomName,
                userId:messageDetails.userId,
                user:messageDetails.user,
                message:messageDetails.message,
                timestamp:messageDetails.timestamp,
            })
        }
        else if(change.operationType==='update')
        {
            const messageDetails=change.updateDescription.updatedFields.roomName
            pusher.trigger('message','updated',
            {
                roomName:messageDetails,
            })
        }
        else if(change.operationType==='delete')
        {
            const messageDetails=change.documentKey._id
            pusher.trigger('message','deleted',
            {
                msgId:messageDetails
            })
        }
        else
        {
            console.log('Error triggering Pusher')
        }
    })
})

//middleware
app.use(express.json())
app.use(cors())

//db config
const connection_url='mongodb+srv://admin:mkd7CG3eJ5wCHyfR@cluster0.xsvxxz4.mongodb.net/whatsapp?retryWrites=true&w=majority'

mongoose.connect(connection_url,
  {
    useNewUrlParser: true,  
    useUnifiedTopology: true
  }
);

//api routes
app.get('/',(req,res)=>
{
    res.status(200).send('Hello World')
})

app.post('/messages/new',(req,res)=>
{
    const dbMessage=req.body
    Messages.create(dbMessage,(err,data)=>
     {
        if(err)
        {
            res.status(500).send(err)
        }else
        {
            res.status(200).send(data)
        }
    })
})

app.get('/messages/new/:id',async(req,res)=>
{
    await Messages.find({roomId:req.params.id}).exec((err,data)=>
     {
        if(err)
        {
            res.status(500).send(err)
        }else
        {
            res.status(200).send(data)
        }
    })
})

app.post('/rooms/new',(req,res)=>
{
    const dbRoom=req.body
     Rooms.create(dbRoom,(err,data)=>
     {
        if(err)
        {
            res.status(500).send(err)
        }else
        {
            res.status(200).send(data)
        }
    })
})

app.post('/updateroom/new/:id',async(req,res)=>
{
    await Rooms.findOneAndUpdate({_id:objectId(req.params.id)},  
    {
        $set: 
        {name: req.body.name}
    }).exec((err,data)=>
    {
        if(err)
        {
            res.status(500).send(err)
        }else
        {
            res.status(200).send(data)
        }
    })   
})

app.post('/updatemessageroom/new/:id',async(req,res)=>
{
    const msg_count=(await Messages.find({roomId:req.params.id})).length
    if(msg_count!=0)
    {
        const messages=await Messages.find({roomId:req.params.id}).exec()
        const msgId=messages[msg_count-1]._id
        if(msgId)
        {
            await Messages.findOneAndUpdate({_id:objectId(msgId)},
            {$set:
                {roomName: req.body.roomName}
            })
        }
    }
})

app.get('/rooms/new',(req,res)=>
{
     Rooms.find((err,data)=>
     {
        if(err)
        {
            res.status(500).send(err)
        }else
        {
            res.status(200).send(data)
        }
    })
})

app.get('/rooms/:id',async(req,res)=>
{
    await Rooms.findById(req.params.id).exec((err,data)=>
    {
        if(err)
        {
            res.status(500).send(err)
        }else
        {
            res.status(200).send(data)
        }
    })
})

app.get('/timestamp/new/:id',async(req,res)=>
{
    const msg_count=(await Messages.find({roomId:req.params.id})).length
    const messages=await Messages.find({roomId:req.params.id}).exec()
    if(msg_count!=0)
    {
        const timestamp=messages[msg_count-1].timestamp
        res.status(200).send(timestamp)
    }
})

app.get('/msgcount/new/:id',async(req,res)=>
{
    const msg_count=(await Messages.find({roomId:req.params.id})).length
    const count=msg_count.toString()
    res.status(200).send(count)
})

app.get('/lastmessage/new/:id',async(req,res)=>
{
    const msg_count=(await Messages.find({roomId:req.params.id})).length
    const messages=await Messages.find({roomId:req.params.id}).exec()
    if(msg_count!=0)
    {
        const lastmessage=messages[msg_count-1].message
        res.status(200).send(lastmessage)
    }
})

app.post('/deleteeroom/new/:id',async(req,res)=>
{
    await Rooms.findOneAndDelete({_id:objectId(req.params.id)}).exec((err,data)=>
    {
        if(err)
        {
            res.status(500).send(err)
        }else
        {
            res.status(200).send(data)
        }
    });        

})

app.post('/deletemessage/new/:id',async(req,res)=>
{
    const msg_count=(await Messages.find({roomId:req.params.id})).length
    if(msg_count>=1)
    {
        await Messages.deleteMany({roomId:req.params.id}).exec((err,data)=>
        {
            if(err)
            {
                res.status(500).send(err)
            }else
            {
                res.status(200).send(data)
            }
        })
    } 
})

//listen
app.listen(port,()=>
{
    console.log(`Listening on localhost : ${port}`);
})
