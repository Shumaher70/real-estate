import { useContext, useState } from 'react';
import { format } from 'timeago.js';

import { AuthContext } from '../../context/AuthContext';
import apiRequest from '../../lib/apiRequest';

import './chat.scss';

function Chat({ chats }) {
   const [chat, setChat] = useState(null);
   const { currentUser } = useContext(AuthContext);

   const handleOpenChat = async (id, receiver) => {
      try {
         const res = await apiRequest('/chats/' + id);

         setChat({ ...res.data, receiver });
      } catch (error) {
         console.log(error);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      const text = formData.get('text');
      if (!text) return;

      try {
         const res = await apiRequest.post('/messages/' + chat.id, { text });
         setChat((prev) => ({
            ...prev,
            messages: [...prev.messages, res.data],
         }));
         e.target.reset();
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div className="chat">
         <div className="messages">
            <h1>Messages</h1>

            {chats.map((chat) => (
               <div
                  className="message"
                  key={chat.id}
                  style={{
                     backgroundColor: chat.seenBy.includes(currentUser.id)
                        ? 'white'
                        : '#fecd514e',
                  }}
                  onClick={() => handleOpenChat(chat.id, chat.receiver)}
               >
                  <img src={chat.receiver.avatar || '/noavatar.png'} alt="" />
                  <span>{chat.receiver.username}</span>
                  <p>{chat.lastMessage}</p>
               </div>
            ))}
         </div>
         {chat && (
            <div className="chatBox">
               <div className="top">
                  <div className="user">
                     <img
                        src={chat.receiver.avatar || '/noavatar.png'}
                        alt=""
                     />
                     {chat.receiver.username}
                  </div>
                  <span className="close" onClick={() => setChat(null)}>
                     X
                  </span>
               </div>
               <div className="center">
                  {chat.messages.map((message) => (
                     <div
                        className="chatMessage"
                        key={message.id}
                        style={{
                           alignSelf:
                              message.userId === currentUser.id
                                 ? 'flex-end'
                                 : 'flex-center',
                           textAlign:
                              message.userId === currentUser.id
                                 ? 'right'
                                 : 'left',
                        }}
                     >
                        <p>{message.text}</p>
                        <span>{format(message.createdAt)}</span>
                     </div>
                  ))}
               </div>
               <form onSubmit={handleSubmit} className="bottom">
                  <textarea name="text"></textarea>
                  <button>Send</button>
               </form>
            </div>
         )}
      </div>
   );
}

export default Chat;
