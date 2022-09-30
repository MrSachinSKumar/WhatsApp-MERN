import { AttachFile, Delete, Edit, InsertEmoticon, Mic, MoreVert, SearchOutlined } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './Chat-CSS/Chat.css'
import './Chat-CSS/ChatBody.css'
import './Chat-CSS/ChatHeader.css'
import './Chat-CSS/ChatFooter.css'
import axios from '../config/axios'
import {useLocation} from 'react-router-dom'
import { useStateValue } from '../config/firebase/StateProvider'
import Pusher from 'pusher-js'

import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function Chat() 
{
  const [input, setInput] = useState('')
  const [seed,setSeed] = useState('')
  const [roomName, setRoomName] = useState('')
  const [messages, setMessages] = useState([])
  const [time, setTime] = useState('')
  const [count, setCount] = useState()

  const location = useLocation();
  const roomId=location.pathname
  const [{user},dispatch]=useStateValue()

  const url=roomId
  const path = url.split("/");
  const room=path[2]

  useEffect(() => 
  {
    if(roomId)
     {
      axios.get(`${roomId}`).then((response)=>
      {
        setRoomName(response.data.name)
      })
      }
  }, [roomId,location.pathname,user])

  useEffect(() => 
  {
    if(roomId)
      {
       axios.get(`/messages/new/${room}`).then((response)=>
       {
         setMessages(response.data)
       })
       }
  }, [roomId,room])

  useEffect(() => 
  {
    axios.get(`/msgcount/new/${room}`).then((response)=>
    {
      setCount(response.data)
    })
    
    if(roomId)
    {
      if(count)
      {
        axios.get(`/timestamp/new/${room}`).then((response)=>
        {
          setTime(response.data)
        })
      }else
      {
        setTime(null)
      }
    }
  }, [roomId,room,count])
  
  useEffect(() => 
  {
    const pusher = new Pusher('47eab3205975d34e7048', 
    {
      cluster: 'ap2'
    });

    const channel3 = pusher.subscribe('message');
    channel3.bind('inserted',(newMessage)=>
    {
      console.log(newMessage);
      const msg=Object.keys(newMessage).sort()
      const time=newMessage[msg[3]]
      setMessages([...messages,newMessage])
      setTime(time)
    });

    const channel4 = pusher.subscribe('message');
    channel4.bind('updated',(newMessage)=>
    {
      setRoomName(newMessage.roomName)
    });

    const channel5 = pusher.subscribe('message');
    channel5.bind('deleted',(newMessage)=>
    {
      const msg=Object.keys(newMessage).sort()
      const name=newMessage[msg[0]]
    });

    return()=>
    {
      channel3.unbind_all()
      channel3.unsubscribe()
      channel4.unbind_all()
      channel4.unsubscribe()
      channel5.unbind_all()
      channel5.unsubscribe()
    }
  }, [messages,roomName])
  
  const sendMessage=async(e)=>
  {
    e.preventDefault()
    await axios.post(`/messages/new`,
    {
      roomId: room,
      roomName: roomName,
      userId: user.uid,
      user:user.displayName,
      message:input,
      timestamp: new Date(),
    })
    setInput('')
  }

  const editRoom=()=>
  {
    const roomName=prompt('Enter name for room')
    if(roomName)
    {
      axios.post(`/updateroom/new/${room}`,
      {
        name:roomName
      })
    }
    axios.post(`/updatemessageroom/new/${room}`,
      {
        roomName:roomName,
      })
  }  

  const deleteRoom=()=>
  {
    confirmAlert({
      title: `Confirm to delete ${roomName}`,
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
          {
            axios.post(`/deleteeroom/new/${room}`)
            axios.post(`/deletemessage/new/${room}`)
            setRoomName()
            setMessages([])
            setTime()
            alert('Room deleted')
          } 
        },
        {
          label: 'No',
        }
      ]
    });
  }

  useEffect(() => 
  {
    setSeed(Math.floor(Math.random()*5000))
  }, [])

  return (
    <div className='chat'>
      <div className= "chat_header">
        <Avatar src={`https://avatars.dicebear.com/api/male/${seed}.svg`}/>
        <div className="chatheader_info">
            <h3>{roomName}</h3>
            <p>Last seen at : {time}</p>
        </div>
        <div className="chatheader_Right">
        
        <IconButton>
          {roomName ? <Edit onClick={editRoom}/> : ""}
        </IconButton> 
        <IconButton>
         {roomName ? <Delete onClick={deleteRoom}>Confirm delete</Delete> : ""}
        </IconButton>
        <IconButton>
         {roomName ? <SearchOutlined/> : ""}
        </IconButton>
        <IconButton>
         {roomName ? <AttachFile/> : ""}
        </IconButton>
        <IconButton>
         {roomName ? <MoreVert/> : ""}
        </IconButton>
        </div>
      </div>
      <div className="chat_body">
      {messages.map(message=>
        (
          <p className={`chat_message ${message.userId===user.uid && 'chat_receiver'}`}>
          <span className='chat_name'>{message.user}</span>
          {message.message}
          <span className='chat_timestamp'>
            {message.timestamp}
          </span>
        </p>
        ))}
      </div>
      {roomName ?
      <div className="chat_footer">
        <InsertEmoticon/>
        <form action="">
          <input value={input} onChange={e=> setInput(e.target.value)} type="text" placeholder='Type a message'/>
          <button onClick= {sendMessage} type='submit'></button>
        </form>
        <Mic/>
      </div> : ""}
    </div>
  )
}

export default Chat