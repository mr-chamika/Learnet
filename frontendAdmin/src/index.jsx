import createDOM, { addComponent } from "../../frontend/react_lite/createDOM";
import "./index.css"

// import Chat from "./Pages/Chat/Chat";
import Main from "./Pages/Main";
import Router from "../../frontend/src/Router/Router";
// import Forum from "./Pages/Forum/Forum";
// import PersonalFolder from "./Pages/PersonalFolder/PersonalFolder";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Logout from "./Pages/Logout/Logout";
import NotFound from "./Pages/NotFound/NotFound";
// import LandingPage from "./Pages/LandingPage/LandingPage";
// import Settings from "./Pages/Settings/Settings";
// import CreateNote from "./Components/CreateNote/CreateNote";
// import Contents from "./Pages/PersonalFolder/Contents/Contents";
// import Video from "./Components/Video/Video";
// import Note from "./Components/Note/Note";
import UserContextProvider, { UserContext } from "./Contexts/UserContext";
// import FolderContextProvider from "./Contexts/FolderContext";
import ThemeContextProvider from "./Contexts/ThemeContext";
import Dashboard from "./Pages/Dashboard/Dashboard";
// import FolderContentContextProvider from "./Contexts/FolderContentContext";
// import { NotesProvider } from "./Contexts/NotesContext";
// import TermsAndConditions from "./Pages/Terms/TermsAndConditions";
// import PrivacyPolicy from "./Pages/Terms/PrivacyPolicy";
import EmailVerification from "./Pages/EmailVerification/EmailVerification";
import Users from "./Pages/Users/Users";
import UserDetails from "./Pages/Users/UserDetails";
import EditUserDetails from "./Pages/Users/EditUserDetails";
import OtherUsersContextProvider from "./Contexts/OtherUsersContext";
import Report from "./Pages/Report/Report";
import Domains from "./Pages/Domains/Domain";
import AddDomain from "./Pages/Domains/AddDomain";
// import { VideoProvider } from "./Contexts/VideosContext";
// import { LinksProvider } from "./Contexts/LinksContext";
// import ChatBox from "./Pages/Chat/ChatBox/ChatBox";
// import OtherUsersContextProvider from "./Contexts/OtherUsersContext";





// import Sidebar from "./Components/Sidebar/Sidebar";
// import Topbar from "./Components/Topbar/Topbar";
// import Link from "./Router/Link";
// import Profile from "./Components/Profile/Profile";
// import PersonalSchedule from "./Pages/PersonalSchedule/PersonalSchedule";
// import ChatBox from "./Components/ChatBox/ChatBox";
// import MessageBox from "./Components/MessageBox/MessageBox";

const App = () => {

    const routes = [
        { 
            path: '/admin',
            element: Main,
            props : {},
            children: [
                {
                    // path: '/',
                    index: true,
                    element: Dashboard,
                    props : {},
                    children: []
                },
                {
                    path: "/users",
                    element: Users,
                    props : {},
                    children: []
                },
                {
                    path: "/users/user/:Id",
                    element: UserDetails,
                    props : {},
                    children: []
                },
                {
                    path: "/users/user/:Id/edit",
                    element: EditUserDetails,
                    props : {},
                    children: []
                },
                {
                    path: "/reports",
                    element: Report,
                    props : {},
                    children: []
                },
                {
                    path: "/domains",
                    element: Domains,
                    props : {},
                    children: []
                },
                {
                    path: "/domains/add",
                    element: AddDomain,
                    props : {},
                    children: []
                },
                // { 
                //     path: '/chat',
                //     element: Chat,
                //     props : {},
                //     children: []
                // },
                // { 
                //     path: '/forum',
                //     element: Forum,
                //     props : {},
                //     children: []
                // },
                // { 
                //     path: '/personal-folder',
                //     element: PersonalFolder,
                //     props : {},
                //     children: [
                //         {
                //             index: "true",
                //             element: Contents,
                //             props: {},
                //             children: []
                //         },
                //         {
                //             path: "/note-editor/:noteId",
                //             element: CreateNote,
                //             props: {},
                //             children: []
                //         },
                //         {
                //             path: "/note/:id",
                //             element: Note,
                //             props: {},
                //             children: []
                //         },
                //         {
                //             path: "/video/:id",
                //             element: Video,
                //             props: {},
                //             children: []
                //         }
                //     ]
                // },
                // { 
                //     path: '/settings',
                //     element: Settings,
                //     props : {},
                //     children: []
                // },
            ]
        },
        { 
            path: '/login',
            element: Login,
            props : {},
            children: []
        },
        { 
            path: '/signup',
            element: Signup,
            props : {},
            children: []
        },
        { 
            path: '/signup/email-verification',
            element: EmailVerification,
            props : {},
            children: []
        },
        { 
            path: '/logout',
            element: Logout,
            props : {},
            children: []
        },
        // { 
        //     path: '/terms-of-services',
        //     element: TermsAndConditions,
        //     props : {},
        //     children: []
        // },
        // { 
        //     path: '/privacy-policy',
        //     element: PrivacyPolicy,
        //     props : {},
        //     children: []
        // },
        { 
            path: '*',
            element: NotFound,
            props : {},
            children: []
        },
    ];

    const redirects = {
		"/": {
			condition: function () { return localStorage.getItem("token") !== null },
			to: "/admin"
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
                        <OtherUsersContextProvider>
                            <Router routes={routes} redirects={redirects}/>
                        </OtherUsersContextProvider>
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

createDOM(App, document.getElementById("root"))