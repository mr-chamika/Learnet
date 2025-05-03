import { useContext, useEffect } from "../../react_lite/createDOM";
import NotificationStack from "../Components/NotificationStack/NotificationStack";
import Sidebar from "../Components/Sidebar/Sidebar";
import Topbar from "../Components/Topbar/Topbar";
import { FilesProvider } from "../Contexts/FilesContext";
import FolderContentContextProvider from "../Contexts/FolderContentContext";
import FolderContextProvider from "../Contexts/FolderContext";
import FriendsContextProvider from "../Contexts/FriendsContext";
import { LinksProvider } from "../Contexts/LinksContext";
import { NotesProvider } from "../Contexts/NotesContext";
import NotificationsContextProvider from "../Contexts/NotificationsContext";
import OtherUsersContextProvider from "../Contexts/OtherUsersContext";
import PostContextProvider from "../Contexts/postContext";
import { SelectedTaskProvider } from "../Contexts/SelectedTaskContext";
import { UserContext } from "../Contexts/UserContext";
import { VideoProvider } from "../Contexts/VideosContext";
import { routerContext } from "../Router/Router";

const Main = ({children}) => {

    // const {user} = useContext(UserContext)
    // const {goto} = useContext(routerContext)

    // useEffect(()=>{
    //     if(!user.token) goto("/login")
    // }, [])

    return (
        <div className="main cont">
            <FriendsContextProvider>
                <FolderContextProvider>
                    <FolderContentContextProvider>
                        <NotesProvider>
                            <VideoProvider>
                                <LinksProvider>
                                    <FilesProvider>
                                        <OtherUsersContextProvider>
                                            <PostContextProvider>
                                                <SelectedTaskProvider>
                                                    <NotificationsContextProvider>
                                                        <NotificationStack />
                                                    </NotificationsContextProvider>
                                                    <div className="main-box">
                                                        <Topbar />
                                                        <div className="bottom">
                                                            {children}
                                                            <Sidebar />
                                                        </div>
                                                    </div>
                                                </SelectedTaskProvider>
                                            </PostContextProvider>
                                        </OtherUsersContextProvider>
                                    </FilesProvider>
                                </LinksProvider>
                            </VideoProvider>
                        </NotesProvider>
                    </FolderContentContextProvider>
                </FolderContextProvider>
            </FriendsContextProvider>
        </div>
    );
}

export default Main;