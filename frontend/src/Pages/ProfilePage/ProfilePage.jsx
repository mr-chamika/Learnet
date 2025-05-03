import { useContext, useEffect, useState } from "../../../react_lite/createDOM";
import "./ProfilePage.css"
import profile from "./man.png";
import Link from "../../Router/Link";
import calendarIcon from "../../Assets/icons/calendar.png"
import locationIcon from "../../Assets/icons/location.png"
import fileIcon from "../../Assets/icons/PersonalFolder/file.png"

// const ProfilePage = () => {

//     const [username, setUsername] = useState("chamika");
//     const [email, setEmail] = useState("example@gmail.com");
//     const [phone, setPhone] = useState("123-456789");
//     const [currentPassword, setCurrentPassword] = useState("");
//     const [newPassword, setNewPassword] = useState("");

//     const handleSubmit = () => {

//         alert("password changed");

//     }

//     return (

//         <section className="profile-page">

//             <h2 className="profile-page-head">Student Profile</h2>

//             <div className="profile-image">

//                 <img src={profile} alt="Profile Image" width={150} height={150} />
//                 <nav>

//                     <a href="https://ugvle.ucsc.cmb.ac.lk/login/index.php">chamikauni2001@gmail.com</a>

//                 </nav>

//             </div>

//             <div className="profile-content">
//                 <div className="personal-courses">

//                     <fieldset>

//                         <legend>Personal info</legend>

//                         <form>

//                             <label>Username</label>
//                             <input value={username}></input>


//                             <label>Email</label>
//                             <input value={email}></input>


//                             <label>Phone</label>
//                             <input value={phone}></input>

//                         </form>

//                     </fieldset>


//                     <fieldset>

//                         <legend>Courses</legend>

//                         <div className="profile-list">

//                             <li><a><Link to="/" label="Computer Systems">Computer Systems</Link></a></li>
//                             <li><a><Link to="/" label="Computer Systems">Discrete Mathematics I</Link></a></li>
//                             <li><a><Link to="/" label="Computer Systems">Data Structures and Algorithms I</Link></a></li>
//                             <li><a><Link to="/" label="Computer Systems">Database I</Link></a></li>
//                             <li><a><Link to="/" label="Computer Systems">Mathematical Methods I</Link></a></li>
//                             <li><a><Link to="/" label="Computer Systems">Enhancement </Link></a></li>
//                             <li><a><Link to="/" label="Computer Systems">Operating Systems</Link></a></li>

//                         </div>

//                     </fieldset>

//                 </div>

//                 <div className="settings">

//                     <fieldset>

//                         <legend>Settings</legend>

//                         <div>

//                             <h3>Password</h3>
//                             <span>Here you can change your login password</span>

//                             <form onSubmit={handleSubmit}>

//                                 <label>Enter Current Password</label>
//                                 <input type="password" value={currentPassword} placeholder="Enter current password..."></input>


//                                 <label>Enter New Password</label>
//                                 <input type="password" value={newPassword} placeholder="Enter new password..."></input>


//                                 <label>Confirm New Password</label>
//                                 <input type="password" placeholder="Enter new password again..."></input>

//                                 <button className="p-update-button" type="submit">Update</button>

//                             </form>

//                         </div>

//                     </fieldset>

//                 </div>

//             </div>

//         </section>

//     );
// }

// export default ProfilePage;

import "./ProfileView.css";
import { routerContext } from "../../Router/Router";
import { otherUsersContext } from "../../Contexts/OtherUsersContext";
import { UserContext } from "../../Contexts/UserContext";
import Card from "../../Components/Card/Card";
import FriendCard from "../Home/FriendCard";

const ProfileView = ({ }) => {
    const {params} = useContext(routerContext)
    const id = params.id
    const {user: currentUser} = useContext(UserContext)
    const {users, fetchUsersIfNotExist} = useContext(otherUsersContext)
    const [files, setFiles] = useState([])
    const [friends, setFriends] = useState([])
    const user = id ? users[id] : currentUser
    if(id){
        user.userId = id
    }

    const [pages, setPages] = useState({
        files: 0,
        links: 0,
        videos: 0,
        notes: 0
    })

    useEffect(()=>{
        if(id){
            fetchUsersIfNotExist([id])
        }
    }, [id])

    if(id && !users[id]){
        return (
            <div className="center-aligned-message-container">
                Loading...
            </div>
        );
    }

    useEffect(()=>{
        fetch("http://localhost:8080/file/get-public", {
            method: "POST",
            headers: {
                authorization: `bearer ${currentUser.token}`
            },
            body: JSON.stringify({userId: user.userId})
        })
        .then(res=>res.json())
        .then(data=>{
            if(!data.error){
                console.log("file data : ", data)
                setFiles(data.map(v=>{v.type = "file"; return v}))
            }
        })


        fetch("http://localhost:8080/friends/get-friend-list", {
            method: "POST",
            headers: {
                authorization: `bearer ${currentUser.token}`
            },
            body: JSON.stringify({
                userId: user.userId
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log("friends : gg : ", data)
            if(!data.error){
                const friends = data.friends.filter(id=>id!=currentUser.userId)
                setFriends(friends)
                fetchUsersIfNotExist(friends)
            }
        })
    }, [currentUser, user])

    // const user = {
    //     name : "gm",
    //     email: "gm@gmail.com",
    //     bio: "gg",
    //     location: "amb",
    //     joinDate: "2024-01-19"

    // }

  const [activeTab, setActiveTab] = useState("friends");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio,
    location: user.location
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically call an API to update the user
    console.log("Saving:", formData);
    setIsEditing(false);
    // Update the user object with new data
    Object.assign(user, formData);
  };

  const tabs = [
    // { id: "overview", label: "Overview" },
    // { id: "activity", label: "Activity" },
    // { id: "settings", label: "Settings" },
    // { id: "connections", label: "Connections" },
    { id: "friends", label: "Friends" },
    { id: "files", label: "Files" }
  ];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={profile} alt="Profile" />
          {isEditing && (
            <button className="avatar-edit-btn">
              <i className="fas fa-camera"></i> Change
            </button>
          )}
        </div>
        
        <div className="profile-info">
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="edit-input"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="edit-input"
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="edit-textarea"
                rows="3"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="edit-input"
              />
            </div>
          ) : (
            <div>
              <h1>{user.name}</h1>
              <p className="profile-email">{user.email}</p>
              <p className="profile-bio">{user.bio}</p>
              <div className="profile-meta">
                <span><img src={locationIcon} /> {user.location}</span>
                <span><img src={calendarIcon} /> Joined {user.joinDate}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="profile-actions">
          {isEditing ? (
            <div>
              <button className="btn-save" onClick={handleSave}>
                Save Changes
              </button>
              <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="profile-content">
        {activeTab === "overview" && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Posts</h3>
                <p>{user.stats?.posts}</p>
              </div>
              <div className="stat-card">
                <h3>Friends</h3>
                <p>{user.stats?.friends}</p>
              </div>
              <div className="stat-card">
                <h3>Engagement</h3>
                <p>{user.stats?.engagement}</p>
              </div>
            </div>
            
            <div className="recent-activity">
              <h2>Recent Activity</h2>
              <ul>
                {user.recentActivity?.length > 0 ? (
                  user.recentActivity.map((activity, index) => (
                    <li key={index}>
                      <span className="activity-date">{activity.date}</span>
                      <span className="activity-text">{activity.text}</span>
                    </li>
                  ))
                ) : (
                  <p>No recent activity</p>
                )}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="activity-section">
            <h2>Your Activity</h2>
            <p>Detailed activity log would appear here</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-section">
            <h2>Account Settings</h2>
            <div className="settings-option">
              <h3>Privacy</h3>
              <p>Control who can see your profile and activity</p>
            </div>
            <div className="settings-option">
              <h3>Notifications</h3>
              <p>Manage your notification preferences</p>
            </div>
            <div className="settings-option">
              <h3>Security</h3>
              <p>Change password and security settings</p>
            </div>
          </div>
        )}

        {activeTab === "connections" && (
          <div className="connections-section">
            <h2>Your Connections</h2>
            <div className="connections-grid">
              {user.connections?.length > 0 ? (
                user.connections.map(connection => (
                  <div key={connection.id} className="connection-card">
                    <img src={connection.avatar} alt={connection.name} />
                    <h4>{connection.name}</h4>
                    <p>{connection.mutualConnections} mutual connections</p>
                  </div>
                ))
              ) : (
                <p>No connections yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "friends" && (
          <div className="friends-section">
            <h2>Friends</h2>
            <div className="friends-grid">
              {friends?.length > 0 ? (
                friends.map((friendId, index) => (
                    <FriendCard friendId={friendId} key={friendId} isSent={false}/>
                ))
              ) : (
                <p>No files yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "files" && (
          <div className="files-section">
            <h2>Files uploaded</h2>
            <div className="file-grid">
              {files?.length > 0 ? (
                files.map((file, index) => (
                    <Card data={file} key={`column1-${index}`} />
                ))
              ) : (
                <p>No files yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Default props in case none are provided
// ProfileView.defaultProps = {
//   user: {
//     name: "John Doe",
//     email: "john@example.com",
//     avatar: "https://via.placeholder.com/150",
//     bio: "Software developer and open source enthusiast",
//     location: "San Francisco, CA",
//     joinDate: "January 2020",
//     stats: {
//       posts: 42,
//       followers: 128,
//       following: 56,
//       engagement: "78%"
//     },
//     recentActivity: [
//       { date: "Today", text: "Posted a new article" },
//       { date: "Yesterday", text: "Commented on a discussion" },
//       { date: "2 days ago", text: "Followed Jane Smith" }
//     ],
//     connections: [
//       { id: 1, name: "Jane Smith", avatar: "https://via.placeholder.com/80", mutualConnections: 5 },
//       { id: 2, name: "Mike Johnson", avatar: "https://via.placeholder.com/80", mutualConnections: 3 },
//       { id: 3, name: "Sarah Williams", avatar: "https://via.placeholder.com/80", mutualConnections: 8 }
//     ]
//   }
// };

export default ProfileView;