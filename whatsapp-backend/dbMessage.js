import mongoose from 'mongoose'

const whatsappSchema=new mongoose.Schema
({
    roomId: String,
    roomName: String,
    userId: String,
    user: String,
    message: String,
    timestamp: String,
});

export default mongoose.model('messages',whatsappSchema)

