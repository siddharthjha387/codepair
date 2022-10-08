import React, { useEffect, useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
import { useLocation } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
function Chatbox({ socketRef, roomId,handleChatBtn}) {
    const location = useLocation();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
   
    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      }
    const handleOnChange = (e) => {
        
        setMessage(e.target.value);
    }

    const handleSendMessage = (e) => {
        
        if (message) {
            const username=location.state?.username;
            const time=formatAMPM(new Date());
            socketRef.current.emit("sendMessage", { roomId,message,username,time });
            setMessage("");
        } else alert("empty input");
        
    }

   
const onKeyDown=(event)=>{
    if (event.key === 'Enter') {
        handleSendMessage();
      }
}
    
    useEffect(() => {
        if (socketRef.current) {
            console.log(socketRef.current);
        socketRef.current.on("message", (message) => {
            setMessages((messages) => [...messages, message]);
            
        });
    }


    }, [socketRef.current]);

    
    return (
        <div className="chatbox">
            <div className="close"><CloseIcon onClick={handleChatBtn}/></div>
            <div className="chatbox-heading">
                In-call messages
            </div>
            <div className='messages scrollbar' id="style-15">
                {messages.map((messages, i) => {
                    return (
                        <div key={i} className='message'>
                             <b> {messages.username}</b>&nbsp; {messages.time}
                             <br />
                            {messages.message}
                            
                           
                        </div>
                    );
                })}
            </div>
          
            <div className="message-box-container">
                <input className='message-box' aria-label="Send a message to everyone" placeholder="Send a message to everyone"  onKeyDown={onKeyDown} onChange={handleOnChange} value={message}/>
                <div className="send-button"><SendIcon onClick={handleSendMessage} /></div>
            </div>
        </div>
    )
}

export default Chatbox