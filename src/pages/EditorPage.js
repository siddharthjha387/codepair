import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import ACTIONS from '../Actions';
import { Client } from '../components/Client';
import { Editor } from '../components/Editor';
import { initSocket } from '../socket';
import './Editor.css'
export const EditorPage = () => {
  const location = useLocation();
  const {roomID}=useParams();
  const reactNavigator = useNavigate();
  const socketRef = useRef(null);
  
  const [clients, setClients] = useState([
    { socketId: 1, username: "Rakesh" },
    { socketId: 2, username: "Sid" },
    { socketId: 3, username: "Raju" },
  ]);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
      }
      socketRef.current.emit(ACTIONS.JOIN, {
        roomID,
        username: location.state?.username,
      });
    };
    init();
  }, [])

  if (!location.state)
    return <Navigate to="/" />
  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <img src="/code-pair.png" alt="logo" className='logoImage' />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {
              clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))
            }
          </div>
        </div>
        <button className='btn copyBtn'>Copy ROOM ID</button>
        <button className='btn leaveBtn'>Leave</button>
      </div>
      <div className="editorWrap">

        <Editor />
      </div>
    </div>)
}

