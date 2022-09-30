import React from 'react'
import Avatar from 'react-avatar';
import './Client.css';
export const Client = ({username}) => {
  return (
   <div className="client">
    <Avatar name={username} round="14px" size={50}/>
    <span className='username'>{username}</span>
   </div>
  )
}
