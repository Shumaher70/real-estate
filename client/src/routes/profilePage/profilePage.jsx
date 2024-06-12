import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import apiRequest from '../../lib/apiRequest';
import Chat from '../../components/chat/Chat';
import List from '../../components/list/List';
import './profilePage.scss';
import { AuthContext } from '../../context/AuthContext';

function ProfilePage() {
   const { currentUser, updateUser } = useContext(AuthContext);
   const { username, email, avatar } = currentUser;

   const navigate = useNavigate();

   const handleLogout = async () => {
      try {
         await apiRequest.post('/auth/logout');
         updateUser(null);
         localStorage.removeItem('user');
         navigate('/');
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <div className="profilePage">
         <div className="details">
            <div className="wrapper">
               <div className="title">
                  <h1>User Information</h1>
                  <Link to="/profile/update">
                     <button>Update Profile</button>
                  </Link>
               </div>
               <div className="info">
                  <span>
                     Avatar:
                     <img src={avatar || '/noavatar.png'} alt={username} />
                  </span>
                  <span>
                     Username: <b>{username}</b>
                  </span>
                  <span>
                     E-mail: <b>{email}</b>
                  </span>
                  <button onClick={handleLogout}>Logout</button>
               </div>
               <div className="title">
                  <h1>My List</h1>
                  <button>Create New Post</button>
               </div>
               <List />
               <div className="title">
                  <h1>Saved List</h1>
               </div>
               <List />
            </div>
         </div>
         <div className="chatContainer">
            <div className="wrapper">
               <Chat />
            </div>
         </div>
      </div>
   );
}

export default ProfilePage;
