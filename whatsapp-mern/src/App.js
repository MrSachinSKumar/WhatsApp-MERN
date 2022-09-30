
import './App.css';
import Chat from './components/chat/Chat';
import Sidebar from './components/sidebar/Sidebar';
import {BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Login from './components/login/Login'
import { useStateValue } from './components/config/firebase/StateProvider';

function App() 
{
  const [{user},dispatch]=useStateValue()

  return (
    <div className="app">
      {!user ? (
        <Login/>
      ): (
          <div className='app_body'>
              <Router>
                <Sidebar/>
                    <Routes>  
                      <Route element={<Chat/>} path='/rooms/:id'/>
                      <Route element={<Chat/>} exact path='/'/>  
                    </Routes>
              </Router>
          </div>
      )} 
    </div>
  );
}

export default App;

//nodemon server.js