import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import ACTIONS, { JOINED } from '../Actions';
import { Client } from '../components/Client';
import { Editor } from '../components/Editor';
import MessageIcon from '@mui/icons-material/Message';
import { initSocket } from '../socket';

import './EditorPage.css'
import Chatbox from '../components/Chatbox';
export const EditorPage = () => {
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const [style, setStyle] = useState("mainWrap");


  const [clients, setClients] = useState([]);
  const handleCopyRoomId = async () => {
    // console.log("Siddharth");
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id copied")
    }
    catch (err) {
      toast.error('Error in copying');
      console.log(err);
    }
  }

  const handleChatBtn=()=>{
    if(style==='mainWrap')
    setStyle("mainWrap2")
    else
    setStyle("mainWrap")
  }

  const leaveRoom = () => {
    reactNavigator('/');
  }
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
        roomId,
        username: location.state?.username,
      });

      //listening to joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`)
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      )

      //listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        })
      })

    };
    init();
    return () => {

      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    }

  }, [])



  if (!location.state)
    return <Navigate to="/" />


  return (
    <div className={style}>
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
        <button className='btn chatBtn' onClick={handleChatBtn}>Chat</button>
        <button className='btn copyBtn' onClick={handleCopyRoomId}>Copy ROOM ID</button>
        <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
      </div>  
      <div className="editorWrap">

        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => { codeRef.current = code; }} />
      </div>
      {/* <div className="chatIcon"><MessageIcon/></div> */}
      
     {(style==='mainWrap2') && <Chatbox socketRef={socketRef} roomId={roomId} handleChatBtn={handleChatBtn}/>}
    </div>)
}

