import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
export const Home = () => {

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  //create new room
  const createNewRoom = (e) => {
    e.preventDefault();
    try {
      const id = uuidv4();
      setRoomId(id);
      toast.success('Successfully created new room!')
    }
    catch (err) {
      toast.success(err);
    }
  }

  //join room

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error('Room Id and Username required');
      return;
    }

    //redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    })
  }

  //handle enter
  const handleInputEnter=(e)=>{
    if(e.code==='Enter')
    {
      joinRoom();
    }
  }

  return (
    <div className="homePageWrapper">

      <div className="formWrapper">
        <img src="/code-pair.png" className='homePageLogo' />
        <h4 className="mainLabel">Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          <input type="text" className='inputBox' placeholder='ROOM ID' value={roomId} onChange={(e) => { setRoomId(e.target.value) }} onKeyUp={handleInputEnter} />
          <input type="text" className='inputBox' placeholder='USERNAME' value={username} onChange={(e) => { setUsername(e.target.value) }} onKeyUp={handleInputEnter}/>

          <button className="btn joinBtn" onClick={joinRoom}>Join</button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a href="" className='createNewBtn' onClick={createNewRoom}>new room</a>
          </span>
        </div>
      </div>
      <footer>
        Made with 🤍 by codepair team
      </footer>
    </div>
  )
}
