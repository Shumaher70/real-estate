import { useContext, useEffect, useState } from 'react';
import { format } from 'timeago.js';

import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import apiRequest from '../../lib/apiRequest';

import './chat.scss';

function Chat({ chats }) {
   const [chat, setChat] = useState(null);
   const { currentUser } = useContext(AuthContext);
   const { socket } = useContext(SocketContext);

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
         socket.emit('sendMessage', {
            receiverId: chat.receiver.id,
            data: res.data,
         });
      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {
      const read = async () => {
         try {
            await apiRequest.put('chats/read/' + chat.id);
         } catch (error) {
            console.log(error);
         }
      };
      if (chat && socket) {
         socket.on('getMessage', (message) => {
            console.log(chat.id === message.chatId);
            if (chat.id === message.chatId) {
               setChat((prev) => ({
                  ...prev,
                  messages: [...prev.messages, message],
               }));
               read();
            }
         });

         return () => {
            socket.off('getMessage');
         };
      }
   }, [socket, chat]);

   return (
      <div className="chat">
         <div className="messages">
            <h1>Messages</h1>

            {chats.map((c) => (
               <div
                  className="message"
                  key={c.id}
                  style={{
                     backgroundColor:
                        c.seenBy.includes(currentUser.id) || chat?.id === c.id
                           ? 'white'
                           : '#fecd514e',
                  }}
                  onClick={() => handleOpenChat(c.id, c.receiver)}
               >
                  <img src={c.receiver.avatar || '/noavatar.png'} alt="" />
                  <span>{c.receiver.username}</span>
                  <p>{c.lastMessage}</p>
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
