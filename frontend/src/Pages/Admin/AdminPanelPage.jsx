
// import { useEffect,useState } from '../../../react_lite/createDOM';
// import './AdminPanelPage.css'; 

// const AdminPanelPage = () => {
//   const [activeSection, setActiveSection] = useState('dashboard');
//   const [users, setUsers] = useState([]);
//   const [blogs, setBlogs] = useState([]);
//   const [stats, setStats] = useState({ totalUsers: 0, totalBlogs: 0 });

  
//   useEffect(() => {
    
//     setStats({ totalUsers: 120, totalBlogs: 50 });
//     setUsers([
//       { id: 1, name: 'John Doe', email: 'john@example.com' },
//       { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
//     ]);
//     setBlogs([
//       { id: 1, title: 'Blog 1', description: 'Blog 1 description' },
//       { id: 2, title: 'Blog 2', description: 'Blog 2 description' },
//     ]);
//   }, []);

//   const handleNavigation = (section) => {
//     setActiveSection(section);
//   };

 
//   const handleDeleteUser = (id) => {
//     setUsers(users.filter(user => user.id !== id));
//   };

  
//   const handleDeleteBlog = (id) => {
//     setBlogs(blogs.filter(blog => blog.id !== id));
//   };

//   return (
//     <div className="admin-panel">
      
//       <div className="sidebar">
//         <h2 className="sidebar-title">Admin Panel</h2>
//         <ul className="sidebar-menu">
//           <li onClick={() => handleNavigation('dashboard')}>Dashboard</li>
//           <li onClick={() => handleNavigation('users')}>User Management</li>
//           <li onClick={() => handleNavigation('blogs')}>Blog Management</li>
//         </ul>
//       </div>

     
//       <div className="main-content">
//         {activeSection === 'dashboard' && (
//           <div className="dashboard-stats">
//             <h3>Dashboard Overview</h3>
//             <div className="stat-card">
//               <h4>Total Users</h4>
//               <p>{stats.totalUsers}</p>
//             </div>
//             <div className="stat-card">
//               <h4>Total Blogs</h4>
//               <p>{stats.totalBlogs}</p>
//             </div>
//           </div>
//         )}

//         {activeSection === 'users' && (
//           <div className="user-management">
//             <h3>User Management</h3>
//             <button className="add-user-btn">Add New User</button>
//             <table className="user-table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map(user => (
//                   <tr key={user.id}>
//                     <td>{user.name}</td>
//                     <td>{user.email}</td>
//                     <td>
//                       <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {activeSection === 'blogs' && (
//           <div className="blog-management">
//             <h3>Blog Management</h3>
//             <button className="add-blog-btn">Add New Blog</button>
//             <table className="blog-table">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Description</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {blogs.map(blog => (
//                   <tr key={blog.id}>
//                     <td>{blog.title}</td>
//                     <td>{blog.description}</td>
//                     <td>
//                       <button className="delete-btn" onClick={() => handleDeleteBlog(blog.id)}>Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminPanelPage;
