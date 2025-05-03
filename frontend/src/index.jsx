import createDOM, { addComponent } from "../react_lite/createDOM";
import "./index.css";

import Chat from "./Pages/Chat/Chat";
import Main from "./Pages/Main";
import Router from "./Router/Router";
import Block from "./Components/Block/Block";
import Profile from "./Components/Profile/Profile";
import Button from "./Components/Button/Button";
import Views from "./Pages/Forum/Views/Views";
import Answered from "./Pages/Forum/Answered/Answered";
import Voted from "./Pages/Forum/Voted/Voted";
import Question from "./Pages/Question/Question";
import Post from "./Components/Post/Post";
import PersonalProfile from './Components/PersonalProfile/PersonalProfile';
import Answer from './Components/Post/Answer/Answer';
import MyAnswer from './Components/Post/MyAnswer/MyAnswer';
import Tag from './Components/Tag/Tag';
import PremiumCard from "./Components/PremiumCard/PremiumCard";
import Img2 from './Assets/p-icon.png';
import Approved from './Assets/approved.png';
import Searched from "./Pages/Searched/Searched";

// import Test from "./test";
// import Test2 from "./test2";
// import Test3 from "./test3";

import "./index.css"

// importing images
import image from "./Assets/topic.svg";
import img from "./Assets/group.svg";
import pImage from "./Assets/profile.png"
import qImage from "./Assets/Q&A.png";
import eventImage from "./Assets/Home/events.svg";
import articleImage from "./Assets/Home/articles.svg";
import faqImage from "./Assets/Home/FAQs.svg";
import premium from "./Assets/Home/premium.png";
import invite from "./Assets/Home/invite.png";
import background from "./Assets/Home/background.jpg";
import Home from "./Pages/Home/Home";
import Forum from "./Pages/Forum/Forum";
import PersonalFolder from "./Pages/PersonalFolder/PersonalFolder";
import Invite from './Pages/Home/Invite/Invite';
import Premium from './Pages/Home/Premium/Premium';
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Logout from "./Pages/Logout/Logout";
import NotFound from "./Pages/NotFound/NotFound";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Settings from "./Pages/Settings/Settings";
import CreateNote from "./Components/CreateNote/CreateNote";
import Contents from "./Pages/PersonalFolder/Contents/Contents";
import Video from "./Components/Video/Video";
import Note from "./Components/Note/Note";
import UserContextProvider, { UserContext } from "./Contexts/UserContext";
import FolderContextProvider from "./Contexts/FolderContext";
import ThemeContextProvider from "./Contexts/ThemeContext";
import FolderContentContextProvider from "./Contexts/FolderContentContext";
import { NotesProvider } from "./Contexts/NotesContext";
import TermsAndConditions from "./Pages/Terms/TermsAndConditions";
import PrivacyPolicy from "./Pages/Terms/PrivacyPolicy";
import EmailVerification from "./Pages/EmailVerification/EmailVerification";
import { VideoProvider } from "./Contexts/VideosContext";
import { LinksProvider } from "./Contexts/LinksContext";
import ChatBox from "./Pages/Chat/ChatBox/ChatBox";
import OtherUsersContextProvider from "./Contexts/OtherUsersContext";
import PersonalSchedule from "./Pages/PersonalSchedule/PersonalSchedule";
//import Calendar from "./Pages/PersonalSchedule/tabs/Calendar/Calendar";
//import Event
// import UserContextProvider from "./Contexts/UserContextProvider";
// import ProductContextProvider from "./Contexts/productContext";
// import ChatContextProvider from "./Contexts/ChatContext";
import CreateEvent from "./Components/Tabs/Other/CreateEvent";
import CreateTask from "./Components/Tabs/Other/CreateTask";
import UpdateTask from "./Components/Tabs/Other/UpdateTask";
//import Tabs from "./Components/Tabs/Tabs";
// import UserContextProvider from "./Contexts/UserContextProvider";
// import ProductContextProvider from "./Contexts/productContext";
// import ChatContextProvider from "./Contexts/ChatContext";
import PostContextProvider from "./Contexts/postContext";
import Icon from './Assets/Question/person.png';
import MyPost from './Components/MyPost/MyPost';
import MyBlock from "./Components/MyBlock/MyBlock";
import MyQuestions from "./Pages/Forum/MyQuestions/MyQuestion";
import EditQuestion from "./Pages/EditQuestion/EditQuestion";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";

// import Sidebar from "./Components/Sidebar/Sidebar";
// import Topbar from "./Components/Topbar/Topbar";
// import Link from "./Router/Link";
// import Profile from "./Components/Profile/Profile";
// import PersonalSchedule from "./Pages/PersonalSchedule/PersonalSchedule";
// import ChatBox from "./Components/ChatBox/ChatBox";
// import MessageBox from "./Components/MessageBox/MessageBox";

// import BlogsPage from "./Pages/blogs/BlogsPage";
import Blog from "./Pages/blogs/Blog/Blog";
import AdminPanelPage from "./Pages/Admin/AdminPanelPage";

import CreateBlog from "./Pages/blogs/CreateBlog/CreateBlog";
import UpdateBlog from "./Pages/blogs/updateBlog/UpdateBlog";
// import MyBlogsPage from "./Pages/blogs/MyBlog/MyBlogsPage";
import BlogsPage from "./Pages/blogs/BlogsPage/BlogsPage";
import { FilesProvider } from "./Contexts/FilesContext";
import PdfViewer from "./Components/pdfViewer/pdfViewer";
import FriendsContextProvider from "./Contexts/FriendsContext";
import PayHereCheckout from "./Pages/Home/Premium/Payment";
import ForgotPassword from "./Pages/Login/ForgotPassword.jsx/ForgotPassword";
import { SelectedTaskProvider } from "./Contexts/SelectedTaskContext";
import UpdateEvent from "./Components/Tabs/Other/UpdateEvent";

const App = () => {

	const routes = [
		{
			path: "/",
			element: LandingPage,
			props: {},
			children: [],
		},
		// {
		// 	path: "/profile",
		// 	element: Profile,
		// 	props: {},
		// 	children: []
		// },
		// {
		// 	path: "/forum",
		// 	element: Forum,
		// 	props: {},
		// 	children: []
		// },
		{
			path: "/user",
			element: Main,
			props: {},
			children: [
				{
					// path: '/',
					index: true,
					element: Home,
					props: {},
					children: [],
				},
				{
					path: '/home',
					element: Home,
					props: {},
					children: []
				},
				{
					path: '/profile',
					element: ProfilePage,
					props: {},
					children: []
				},
				{
					path: '/profile/:id',
					element: ProfilePage,
					props: {},
					children: []
				},
				{
					path: "/invite",
					element: Invite,
					props: {},
					children: []
				},
				{
					path: "/premium",
					element: Premium,
					props: {},
					children: []
				},
				{
					path: "/premium/pay",
					element: PayHereCheckout,
					props: {},
					children: []
				},
				{
					path: "/ask",
					element: Question,
					props: {},
					children: []
				},
				{
					path: "/edit/:id",
					element: EditQuestion,
					props: {},
					children: []
				},
				{
					path: "/myquestions",
					element: MyQuestions,
					props: {},
					children: []
				},
				{
					path: '/post/:id',
					element: Post,
					props: {},
					children: []
				},
				{
					path: '/mypost/:id',
					element: MyPost,
					props: {},
					children: []
				},
				{
					path: "/chat",
					element: Chat,
					props: {},
					children: [],
				},
				{
					path: "/search/:params",
					element: Searched,
					props: {},
					children: [],
				},
				{
					path: "/forum",
					element: Forum,
					props: {},
					children: [],
				},
				{
					path: "/personal-folder",
					element: PersonalFolder,
					props: {},
					children: [
						{
							index: "true",
							element: Contents,
							props: {},
							children: [],
						},
						{
							path: "/note-editor/:noteId",
							element: CreateNote,
							props: {},
							children: [],
						},
						{
							path: "/note/:noteId",
							element: Note,
							props: {},
							children: [],
						},
						{
							path: "/video/:id",
							element: Video,
							props: {},
							children: [],
						},
						{
							path: "/pdf/:fileId",
							element: PdfViewer,
							props: {},
							children: [],
						},
					],
				},
				{
					path: "/personal-schedule",
					element: PersonalSchedule,
					props: {},
					children: [
						{
							index: "true",
							element: Contents,
							props: {},
							children: [],
						},
						//{
						// path: "/:tab?",
						//element: Tabs,
						//props: {},
						//children: [],    
						//},
					],
				},
				{
					path: "/personal-schedule/create-event",
					element: CreateEvent,
					props: {},
					children: [],
				}, {
					path: "/personal-schedule/update-event",
					element: UpdateEvent,
					props: {},
					children: [],
				},
				{
					path: "/personal-schedule/create-task",
					element: CreateTask,
					props: {},
					children: [],
				},
				{
					path: "/personal-schedule/update-task",
					element: UpdateTask,
					props: {},
					children: [],
				},
				{
					path: "/settings",
					element: Settings,
					props: {},
					children: [],
				},
				// {
				//   path: "/blogs",
				//   element: BlogsPage, 
				//   props: {},
				//   children: [],
				// },
				{
					path: "/blogs/blog/:id",
					element: Blog,
					props: {},
					children: [],
				},
				{
					path: "/blogs/create",
					element: CreateBlog,
					props: {},
					children: [],
				},
				{
					path: "/blogs/update/:Id",
					element: UpdateBlog,
					props: {},
					children: [],
				},
				{
					path: "/blogs",
					element: BlogsPage,
					props: {},
					children: [],
				},
				{
					path: "/blogs/:at",
					element: BlogsPage,
					props: {},
					children: [],
				},
			],
		},
		{
			path: "/login",
			element: Login,
			props: {},
			children: [],
		},
		{
			path: "/forgot-password",
			element: ForgotPassword,
			props: {},
			children: [],
		},
		{
			path: "/signup",
			element: Signup,
			props: {},
			children: [],
		},
		{
			path: '/signup/email-verification/:id',
			element: EmailVerification,
			props: {},
			children: []
		},
		{
			path: "/logout",
			element: Logout,
			props: {},
			children: [],
		},
		{
			path: '/terms-of-services',
			element: TermsAndConditions,
			props: {},
			children: []
		},
		{
			path: '/privacy-policy',
			element: PrivacyPolicy,
			props: {},
			children: []
		},
		{
			path: "*",
			element: NotFound,
			props: {},
			children: [],
		},
	];

	const redirects = {
		"/": {
			condition: function () { return localStorage.getItem("token") !== null },
			to: "/user"
		},
		"/user": {
			condition: function () { return localStorage.getItem("token") === null },
			to: "/login"
		}
	}


	return (
		<div className="app">
			<ThemeContextProvider>
				<UserContextProvider>
					<Router routes={routes} redirects={redirects} />
				</UserContextProvider>
			</ThemeContextProvider>
		</div>
	);

	// return (
	//     <div>
	//         <span>hello world</span>
	//         <UserContextProvider>
	//             <Settings>
	//                 <Settings>
	//                     <div>
	//                         test
	//                     </div>
	//                 </Settings>
	//             </Settings>
	//         </UserContextProvider>
	//     </div>
	// );
}

export default App;

// addComponent("App", App)
// addComponent("Link", Link)
// addComponent("Main", Main)
// addComponent("Sidebar", Sidebar)
// addComponent("Topbar", Topbar)
// addComponent("Profile", Profile)

// addComponent("Home", Home)
// addComponent("Chat", Chat)
// addComponent("Forum", Forum)
// addComponent("PersonalFolder", PersonalFolder)
// addComponent("PersonalSchedule", PersonalSchedule)

// addComponent("ChatBox", ChatBox)
// addComponent("MessageBox", MessageBox)

// addComponent("Login", Login)
// addComponent("Signup", Signup)
// addComponent("Logout", Logout)




createDOM(App, document.getElementById("root"));
