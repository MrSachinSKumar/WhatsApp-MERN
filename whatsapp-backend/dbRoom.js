import mongoose from 'mongoose'

const roomSchema=new mongoose.Schema
({
    name: String,
});

export default mongoose.model('rooms',roomSchema)

