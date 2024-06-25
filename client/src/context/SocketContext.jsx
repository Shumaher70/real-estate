import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
   const { currentUser } = useContext(AuthContext);
   const [socket, setSocket] = useState(null);

   useEffect(() => {
      setSocket(io('https://real-estate-socket-s0st.onrender.com'));
   }, []);

   useEffect(() => {
      currentUser && socket?.emit('newUser', currentUser.id);
   }, [currentUser, socket]);

   return (
      <SocketContext.Provider value={{ socket }}>
         {children}
      </SocketContext.Provider>
   );
};
