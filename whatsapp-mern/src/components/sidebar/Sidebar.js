import { Add, Chat, DonutLarge, MoreVert, SearchOutlined } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SidebarChat from './SidebarChat'
import axios from '../config/axios'

import Pusher from 'pusher-js'
import {useLocation} from 'react-router-dom'

import '../sidebar/Sidebar-CSS/SidebarHeader.css'
import '../sidebar/Sidebar-CSS/SidebarSearch.css'
import '../sidebar/Sidebar-CSS/SidebarChat.css'
import '../sidebar/Sidebar-CSS/Sidebar.css'
import { useStateValue } from '../config/firebase/StateProvider'

function Sidebar() 
{
    const [rooms, setRooms] = useState([])
    const [{user},dispatch]= useStateValue()
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
        const pusher = new Pusher('47eab3205975d34e7048',
        {
        cluster: 'ap2'
        });

        const channel = pusher.subscribe('message');
        channel.bind('updated',(newMessage)=>
        {
            const msg=Object.keys(newMessage).sort()
            const latest=newMessage[msg[0]]
            setRoomName(latest)
        });

        return()=>
        {
        channel.unbind_all()
        channel.unsubscribe()
        }

    }, [room])

    const createChat=()=>
    {
        const roomName=prompt('Enter name for room')
        if(roomName)
        {
        axios.post('/rooms/new',
        {
            name:roomName
        })
        }
    }

  return (
    <div className='sidebar'>
        <div className='sidebar_header'>
            <Avatar src='{user?.photoURL}'/>
            <div className="sidebar_headerRight">
                <IconButton>
                    <Add onClick={createChat}/>
                </IconButton>
                <IconButton>
                    <DonutLarge/>
                </IconButton>
                <IconButton>
                    <Chat/>
                </IconButton>
                <IconButton>
                    <MoreVert/>
                </IconButton>
            </div>

        </div>
        <div className='sidebar_Search'>
            <div className="sidebar_searchContainer">
            <SearchOutlined/>
            <input placeholder="Search or start new chat" type="text" />
            </div>
        </div>

        <div className="sidebar_chats">
            {rooms.map(room=>
                (
                    <SidebarChat key={room._id} id={room._id} name={room.name} lastroom={roomName} />
                ))
            }
        </div>
    </div>
  )
}

export default Sidebar