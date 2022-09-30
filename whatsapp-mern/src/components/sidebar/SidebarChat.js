import { Avatar} from '@mui/material'
import React, { useEffect, useState } from 'react'
import './Sidebar-CSS/SidebarChat.css'
import axios from '../config/axios'
import Pusher from 'pusher-js'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router-dom'

function SidebarChat({id,name,lastroom}) 
{
  const [deleteRoom, setDeleteRoom] = useState(lastroom)
  const [seed, setSeed] = useState('')
  const [rooms, setRooms] = useState([])
  const [lastMessage, setLastMessage] = useState('')
  const [count, setCount] = useState()
  const [roomName, setRoomName] = useState('')

  const location = useLocation();
  const roomId=location.pathname

  const url=roomId
  const path = url.split("/");
  const room=path[2]

  useEffect(() => 
  {
    axios.get('/rooms/new').then((response)=>
    {
      setRooms(response.data)
    })
  }, [])

  useEffect(() => 
  {
    axios.get(`/msgcount/new/${id}`).then((response)=>
    {
      setCount(response.data)
    })
    
    if(id)
    {
      if(count)
      {
        axios.get(`/lastmessage/new/${id}`).then((response)=>
        {
          setLastMessage(response.data)
        })
      }else
      {
        setLastMessage(null)
      }
    }
  }, [id,count])

  
  useEffect(() => 
  {
    const pusher = new Pusher('47eab3205975d34e7048',
    {
      cluster: 'ap2'
    });

    const channel1 = pusher.subscribe('message');
    channel1.bind('inserted',(newMessage)=>
    {
      const msg=Object.keys(newMessage).sort()
      const roomId=newMessage[msg[1]]
      if(roomId===id)
      {
        setLastMessage(newMessage[msg[0]])
      }
    });

    const channel2 = pusher.subscribe('message');
    channel2.bind('updated',(newMessage)=>
    {
      if(id===room)
      {
        const msg=Object.keys(newMessage).sort()
        const latest=newMessage[msg[0]]
        setRoomName(latest)
        setDeleteRoom(latest)
      }
    });

    const channel6 = pusher.subscribe('message');
    channel6.bind('deleted',(newMessage)=>
    {
      if(id===room)
      {
      const msg=Object.keys(newMessage).sort()
      const name=newMessage[msg[0]]
      const roomdeleted=" "
      setDeleteRoom("Null")
      setRoomName(roomdeleted)
      console.log(deleteRoom);
      console.log(roomName);
      setLastMessage()
      }
    });

    return()=>
    {
      channel1.unbind_all()
      channel1.unsubscribe()
      channel2.unbind_all()
      channel2.unsubscribe()
      channel6.unbind_all()
      channel6.unsubscribe()
    }

  }, [id,room,deleteRoom,roomName])

  useEffect(() => 
  {
    setSeed(Math.floor(Math.random()*5000))
  }, [])

  return(
    <Link className='sidebarLink' to={`/rooms/${id}`}>
      <div className='sidebarChat'>
        <Avatar src={`https://avatars.dicebear.com/api/male/${seed}.svg`} />
        <div className='sidebarChat_info'>
          <h2>{deleteRoom && roomName ? roomName : name}</h2>
          <p>{lastMessage}</p>
        </div>
      </div>
    </Link>
  )
}

export default SidebarChat