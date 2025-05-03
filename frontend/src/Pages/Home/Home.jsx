import './Home.css';
import Link from '../../Router/Link';
import image from '../../Assets/topic.svg';
import pImage from '../../Assets/profile.png';
import qImage from '../../Assets/Q&A.png';
import Aimage from '../../Assets/Home/articles.svg';
import Eimage from '../../Assets/Home/events.svg';
import Fimage from '../../Assets/Home/FAQs.svg';
import invite from '../../Assets/Home/invite.png';
import premium from '../../Assets/Home/premium.png';
import background from '../../Assets/Home/background.jpg';
import Post from '../../Components/Post/Post';
import Card from '../../Components/Card/Card';
import Calendar from '../../Pages/Home/Calendar';

import tstImg from "../../Assets/features/blog.jpg"
import tstImg1 from "../../Assets/features/events.jpg"
import tstImg2 from "../../Assets/features/forum.jpg"
import tstImg3 from "../../Assets/features/group_meeting.jpg"
import tstImg4 from "../../Assets/features/personal_folder.jpg"
import tstImg5 from "../../Assets/features/quizzes.jpg"
import tstImg6 from "../../Assets/features/videos.jpg"
import { useContext, useEffect, useState } from '../../../react_lite/createDOM';
import ProfileDetails from './ProfileDetails';
import FriendCard from './FriendCard';
import { UserContext } from '../../Contexts/UserContext';
import { FriendsContext } from '../../Contexts/FriendsContext';
import { otherUsersContext } from '../../Contexts/OtherUsersContext';
import filterIcon from "../../Assets/icons/filter.svg"
import { formDataToObj } from '../../Util/FormDataToObj';
import CreateReportPopup from './CreateReportPopup/CreateReportPopup';
import PopupBox, { openPopup } from '../../Components/PopupBox/PopupBox';

const Home = () => {

    // const cardData = {
    //     title: "Prepositions",
    //     createdOn: "2024-12-05",
    //     lisence: "GNU public",
    //     description: "Note on prepositions and predicates in discrete mathematics Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim id veritatis, eveniet quod voluptate atque ab quae modi earum nesciunt tempore ea quas rem neque rerum quibusdam doloribus ipsam magni.Maxime, quasi voluptas dignissimos sint praesentium ipsam eligendi at quibusdam modi doloremque quia sit, labore voluptatem natus ab consequuntur cum, debitis nemo beatae itaque dolores perferendis expedita similique blanditiis. Odio! Consequuntur excepturi est culpa adipisci harum aspernatur dolores obcaecati, nulla nisi quisquam. Nulla veniam numquam impedit molestias hic ducimus dolorum, enim, mollitia ad dicta maiores at temporibus itaque sequi ipsum?",
    //     tags: ["Discrete Mathematics", "Mathematics", "Logic"],
    //     thumbnail: tstImg,
    //     votes: 10,
    //     comments: 5
    // }

    const { user } = useContext(UserContext)
    const [page, setPage] = useState(0)

    // const cardData = [
    //     {
    //         title: "Prepositions",
    //         createdOn: "2024-12-05",
    //         license: "GNU public",
    //         description: "Note on prepositions and predicates in discrete mathematics. Dive deep into the basics of logic and reasoning within mathematics.",
    //         tags: ["Discrete Mathematics", "Mathematics", "Logic"],
    //         thumbnail: tstImg1,
    //         votes: 10,
    //         comments: 5
    //     },
    //     {
    //         title: "Algebra Basics",
    //         createdOn: "2025-01-10",
    //         license: "MIT License",
    //         description: "An introduction to algebraic concepts, including variables, equations, and inequalities. Master the foundations of algebra.",
    //         tags: ["Algebra", "Mathematics", "Education"],
    //         thumbnail: tstImg2,
    //         votes: 23,
    //         comments: 12
    //     },
    //     {
    //         title: "Introduction to Logic Gates",
    //         createdOn: "2025-01-15",
    //         license: "Creative Commons",
    //         description: "Learn the basics of logic gates such as AND, OR, NOT, and XOR. Understand how they are applied in digital circuits.",
    //         tags: ["Electronics", "Logic Gates", "Digital Systems"],
    //         thumbnail: tstImg3,
    //         votes: 15,
    //         comments: 8
    //     },
    //     {
    //         title: "Graph Theory Concepts",
    //         createdOn: "2025-02-01",
    //         license: "Apache License 2.0",
    //         description: "Explore graph theory, including vertices, edges, paths, and cycles. Useful for computer science and real-world applications.",
    //         tags: ["Graph Theory", "Computer Science", "Mathematics"],
    //         thumbnail: tstImg4,
    //         votes: 30,
    //         comments: 14
    //     },
    //     {
    //         title: "Set Theory Essentials",
    //         createdOn: "2025-02-15",
    //         license: "BSD License",
    //         description: "Understand the fundamentals of set theory: unions, intersections, subsets, and complements. Ideal for math enthusiasts.",
    //         tags: ["Set Theory", "Mathematics", "Foundations"],
    //         thumbnail: tstImg5,
    //         votes: 20,
    //         comments: 10
    //     },
    //     {
    //         title: "Calculus Primer",
    //         createdOn: "2025-02-20",
    //         license: "GPL",
    //         description: "A brief introduction to calculus concepts, including limits, derivatives, and integrals. Perfect for beginners.",
    //         tags: ["Calculus", "Mathematics", "Education"],
    //         thumbnail: tstImg6,
    //         votes: 18,
    //         comments: 9
    //     },
    //     {
    //         title: "Discrete Structures",
    //         createdOn: "2025-03-01",
    //         license: "GNU public",
    //         description: "Dive into discrete structures: sets, graphs, and Boolean algebra. Learn how they shape modern computer science.",
    //         tags: ["Discrete Mathematics", "Structures", "Logic"],
    //         thumbnail: tstImg1,
    //         votes: 12,
    //         comments: 6
    //     },
    //     {
    //         title: "Number Theory Fundamentals",
    //         createdOn: "2025-03-10",
    //         license: "Creative Commons",
    //         description: "An introduction to number theory, covering prime numbers, modular arithmetic, and divisors.",
    //         tags: ["Number Theory", "Mathematics", "Education"],
    //         thumbnail: tstImg5,
    //         votes: 16,
    //         comments: 7
    //     },
    //     {
    //         title: "Probability Basics",
    //         createdOn: "2025-03-15",
    //         license: "MIT License",
    //         description: "Learn the basics of probability, from events and sample spaces to expected values and distributions.",
    //         tags: ["Probability", "Statistics", "Mathematics"],
    //         thumbnail: tstImg3,
    //         votes: 22,
    //         comments: 11
    //     },
    //     {
    //         title: "Introduction to Cryptography",
    //         createdOn: "2025-03-20",
    //         license: "Apache License 2.0",
    //         description: "Understand the basics of cryptography: encryption, decryption, and hashing. Protect data in a digital world.",
    //         tags: ["Cryptography", "Security", "Mathematics"],
    //         thumbnail: tstImg2,
    //         votes: 25,
    //         comments: 13
    //     }
    // ];

    const [cardData, setCardData] = useState([])
    const {fetchUsersIfNotExist} = useContext(otherUsersContext)
    const [lastIds, setLastIds] = useState([])
    const [filter, setFilter] = useState({
        files: true,
        links: true,
        videos: true,
        notes: true,
        groups: true,
        communities: true,
    })
    const [showFilter, setShowFilter] = useState(false)

    // const midIndex = Math.ceil(cardData.length / 2);
    // const column1 = cardData.slice(0, midIndex);
    // const column2 = cardData.slice(midIndex);

    const [show, setShow] = useState(true)

    const detailsPannelToggle = (e) => {
        setShow(prev => !prev)
    }

    const [activeTab, setActiveTab] = useState("all")

    const friendList = [
        { name: "Gishan", university: "UCSC" },
        { name: "Senesh", university: "UCSC" },
        { name: "Randila", university: "UCSC" },
    ]

    // const friendRequests = [
    //     {name: "Gishan", university: "UCSC"},
    //     {name: "Senesh", university: "UCSC"},
    //     {name: "Randila", university: "UCSC"},
    // ]

    const { requestsReceived, requestsSent } = useContext(FriendsContext)
    const friendRequests = requestsReceived ? requestsReceived : []

    const [friendSuggestions, setFriendSuggestions] = useState([])
    const suggestionsRequestsSent = []
    requestsSent?.forEach(r => {
        suggestionsRequestsSent.push([true, r])
    })
    friendSuggestions?.forEach(r => {
        if (requestsSent.indexOf(r) < 0) {
            suggestionsRequestsSent.push([false, r])
        }
    })

    console.log("ggggggggggg : ", suggestionsRequestsSent, requestsSent, friendSuggestions)

    useEffect(() => {
        fetch("http://localhost:8080/friends/suggestions", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("friend suggestions : ", data)
                if (!data.error) {
                    setFriendSuggestions(data)
                } else {
                    console.log(data.error)
                }
            })
            .catch(err => console.log(err))
    }, [user])

    const getFeed = () => {
        console.log("=================== get feed called")
        const scrollTop = document.querySelector(".feed-container")?.scrollTop || 0
        console.log("file feed : top : ", scrollTop)
        fetch("http://localhost:8080/feed/random", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                page,
                lastIds,
                includeOnly: filter
            })
        })
        .then(res=>res.json())
        .then(data=>{
            const feedContainer = document.querySelector(".home-page .feed-container")
            const st = feedContainer.scrollTop
            console.log("feed top : ", st)
            if(!data.error){
                console.log("file feed : ", data)
                setCardData(prev=>{
                    // return [...prev, ...data]
                    const sortedItems = [
                        ...(data.feed.files ? data.feed.files.map(v=>{v.type="file"; return v}) : []),
                        ...(data.feed.links ? data.feed.links.map(v=>{v.type="link"; return v}) : []),
                        ...(data.feed.videos ? data.feed.videos.map(v=>{v.type="video"; return v}) : []),
                        ...(data.feed.notes ? data.feed.notes.map(v=>{v.type="note"; return v}) : []),
                        ...(data.feed.groups ? data.feed.groups.map(v=>{v.type="group"; return v}) : []),
                        ...(data.feed.communities ? data.feed.communities.map(v=>{v.type="community"; return v}) : []),
                    ].sort((a, b) => {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    });
                    // prev.push()
                    return [...prev, ...sortedItems]
                })
                setPage(prev=>prev+1)
                setLastIds(data.lastIds)
                // const feedElement = document.querySelector(".feed-container")
                // if(feedElement){
                //     feedElement.scrollTop = scrollTop
                // }
            }
            const feedContainerUpdated = document.querySelector(".home-page .feed-container")
            // feedContainerUpdated.scrollTop = st
            console.log("fater update : ", feedContainerUpdated.scrollTop)
        })

    }

    useEffect(()=>{
        if(user.token){
            console.log("get feed called : ", user)
            getFeed()
        }
    }, [user.token])

    const loadmoreHandler = () => {
        getFeed()
    }

    useEffect(() => {
        console.log(" [...friendRequests, ...friendSuggestions] : ", friendRequests)
        fetchUsersIfNotExist([...friendRequests, ...friendSuggestions, ...(requestsSent ? requestsSent : [])])
    }, [friendRequests, friendSuggestions, requestsSent])

    console.log("card data : ", cardData)

    // CONTENT FILTERING =============================

    const filterChangeHandler = (e) => {
        e.stopPropagation()
        const fd = new FormData(e.target)
        const updatedFilterValues = formDataToObj(fd)
        setFilter(prev=>{
            const newFilter = {}
            Object.keys(prev).forEach(key=>{
                if(updatedFilterValues[key]){
                    newFilter[key] = true
                }else{
                    newFilter[key] = false
                }
            })
            return newFilter
        })
        setShowFilter(false)
    }
    const showFilterHandler = (e)=>{e.stopPropagation();setShowFilter(true)}

    const filteredCardData = cardData.filter(item=>filter[item.type + "s"])
    console.log("filtered card data : ", filteredCardData, cardData)

    // ==============================================


    // SEARCH =======================================
    const [search, setSearch] = useState("")
    const [searchActive, setSearchActive] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [lastIdsSearch, setLastIdsSearch] = useState([])

    const getSearchFeed = (search) => {
        fetch("http://localhost:8080/feed/search", {
            method: "POST",
            headers: {
                authorization: `bearer ${user.token}`
            },
            body: JSON.stringify({
                search,
                lastIds: lastIdsSearch,
                includeOnly: filter
            })
        })
        .then(res=>res.json())
        .then(data=>{
            console.log("search results : ", data)
            const feedContainer = document.querySelector(".home-page .feed-container")
            const st = feedContainer.scrollTop
            if(!data.error){
                setSearchResults(prev=>{
                    const sortedItems = [
                        ...(data.feed.files ? data.feed.files.map(v=>{v.type="file"; return v}) : []),
                        ...(data.feed.links ? data.feed.links.map(v=>{v.type="link"; return v}) : []),
                        ...(data.feed.videos ? data.feed.videos.map(v=>{v.type="video"; return v}) : []),
                        ...(data.feed.notes ? data.feed.notes.map(v=>{v.type="note"; return v}) : []),
                        ...(data.feed.groups ? data.feed.groups.map(v=>{v.type="group"; return v}) : []),
                        ...(data.feed.communities ? data.feed.communities.map(v=>{v.type="community"; return v}) : []),
                    ].sort((a, b) => {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    });
                    // prev.push()
                    return [...prev, ...sortedItems]
                })
                setLastIdsSearch(data.lastIds)
                setSearchActive(true)
            }
            const feedContainerUpdated = document.querySelector(".home-page .feed-container")
            feedContainerUpdated.scrollTop = st
        })
    }

    const searchHandler = (e) => {
        e.preventDefault()
        const fd = new FormData(e.target)
        const data = formDataToObj(fd)
        const search = data.search
        getSearchFeed(search)
    }

    const searchFeedLoadMore = (e) => {
        getSearchFeed(search)
    }

    const clearSearchHandler = (e) => {
        setSearchResults([])
        setLastIdsSearch([])
        setSearchActive(false)
        setSearch("")
    }
    // ==============================================

    const [contentToReport, setContentToReport] = useState(null)
    const createReportPopupHandler = (e, contentType, contentId) => {
        e.stopPropagation()
        setContentToReport({contentType, contentId})
        openPopup(document.querySelector(".home-page .popup-box.create-report"))
    }

    return (
        <section className="home-page" onClick={()=>setShowFilter(false)}>
            {/* <ProfileDetails /> */}
            <div className="left-pannel">
                <div className="topbar">
                    <div className="left">
                        {/* <button className={activeTab === "all" ? "tab-button active" : "tab-button"} onClick={(e)=>setActiveTab("all")}>All</button>
                        <button className={activeTab === "files" ? "tab-button active" : "tab-button"} onClick={(e)=>setActiveTab("files")}>Images</button>
                        <button className={activeTab === "notes" ? "tab-button active" : "tab-button"} onClick={(e)=>setActiveTab("notes")}>PDFs</button>
                        <button className={activeTab === "events" ? "tab-button active" : "tab-button"} onClick={(e)=>setActiveTab("events")}>Events</button>
                        <button className={activeTab === "groups" ? "tab-button active" : "tab-button"} onClick={(e)=>setActiveTab("groups")}>Groups</button>
                        <button className={activeTab === "communities" ? "tab-button active" : "tab-button"} onClick={(e)=>setActiveTab("communities")}>Communities</button> */}
                        <div className="filter">
                            <img src={filterIcon} onClick={showFilterHandler}/>
                            {   showFilter &&
                                (
                                    <form className="filter-context" onSubmit={filterChangeHandler} onClick={e=>e.stopPropagation()}>
                                        <div className="filter-context-title">Show only</div>
                                        {   
                                            Object.entries(filter).map(([key, value])=>{
                                                return (
                                                    <div className="item">
                                                        <span>{key}</span>
                                                        <input type="checkbox" name={key} value={value} checked={value} />
                                                    </div>
                                                )
                                            })
                                        }
                                        <button className="icon-button" type="submit">Apply</button>
                                    </form>
                                )
                            }
                        </div>
                        <form className="search-form" onSubmit={searchHandler}>
                            <input type="text" name="search" value={search} placeholder="search for content" onChange={(e)=>setSearch(e.target.value)}/>
                            <button className="icon-button" type="submit">Search</button>
                            {
                                searchActive && (
                                    <button className="icon-button" type="button" onClick={clearSearchHandler}>Clear</button>
                                )
                            }
                        </form>
                    </div>
                    <div className="right">
                        {/* <button className="icon-button">Add File</button>
                        <button className="icon-button">Create Event</button> */}
                        {/* {!show && (<button className="icon-button" onClick={detailsPannelToggle}>&lt;show</button>)}
                        {show && (<button className="icon-button" onClick={detailsPannelToggle}>close&gt;</button>)} */}
                    </div>
                </div>
                <div className="feed-container" id="feed-container">
                    <PopupBox className="create-report" key="1">
                        <CreateReportPopup contentId={contentToReport?.contentId} contentType={contentToReport?.contentType} />
                    </PopupBox>
                    <div className="feed">
                        {/* <div className="feed-column">
                            {column1.map((item, index) => {
                                return (
                                    <Card data={item} key={`column1-${index}`} />
                                )
                            })}
                        </div> */}
                        {   searchActive ?
                            (
                                <div className="feed-column">
                                    {searchResults.map((item, index) => {
                                        return (
                                            <Card data={item} key={`column1-${index}`} openReportPopup={createReportPopupHandler}/>
                                        )
                                    })}
                                    <button className="icon-button load-more" onClick={searchFeedLoadMore}>Load more</button>
                                </div>
                            ) : (
                                <div className="feed-column">
                                    {filteredCardData.map((item, index) => {
                                        return (
                                            <Card data={item} key={`column1-${index}`} openReportPopup={createReportPopupHandler}/>
                                        )
                                    })}
                                    <button className="icon-button load-more" onClick={loadmoreHandler}>Load more</button>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="friend-list-container">
                <div className="friend-requests">
                    <div className="title">Friend Requests</div>
                    <div className="list">
                        {
                            friendRequests.map((friend, index) => {
                                return (
                                    <FriendCard friendId={friend} isRequest={true} key={index} />
                                )
                            })
                        }
                    </div>
                </div>
                <div className="friends">
                    <div className="title">Friends Suggestions</div>
                    <div className="list">
                        {
                            suggestionsRequestsSent.map((v, index) => {
                                return (
                                    <FriendCard friendId={v[1]} key={v[1]} isSent={v[0]} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            {show && 
            (<div className="details-pannel">
                <div className="topbar">
                    <span>Details</span>
                </div>
                <div className="bottom">
                    <Calendar />
                </div>
            </div>
            )}
        </section>
    );
}

export default Home;

// {/* <img className="background" src={background}></img> */}

// <div className="top">

// <div className="top-image">

//     <img src={image} width="100px" height="110px"></img>

// </div>

// <div className="top-topic">

//     <h1>Welcome to Learnet, John!</h1>
//     <p>Explore resources for share knowledge and win the future together.</p>

// </div>

// <div className="top-button">

//     <Link className="home-profile-image" to='/user/profile-page'><img src={pImage} width="50px" height="50px"></img></Link>
//     <Link className="ask-image" to="/user/ask"><img src={qImage} width="50px" height="47px"></img></Link>

// </div>

// </div>

// <div className="sections">

// <div className="events">

//     <h4>Upcomming events</h4>
//     <img src={Eimage} height='250px' width='100px'></img>
//     <ol className="sides">

//         <li><a href="/">Event 1</a></li>
//         <li><a href="/">Event 2</a></li>
//         <li><a href="/">Event 3</a></li>
//         <li><a href="/">Event 4</a></li>
//         <li><a href="/">Event 1</a></li>

//     </ol>

// </div>

// <div className="popular-questions">

//     <h4>Most asked questions</h4>
//     <img src={Fimage} height='500px' width='300px'></img>

//     <ol className="list">

//         <li><Link to="/user/post" label="Post" >Strapi error while installing dependencies (windows)</Link></li>
//         <li><Link to="/user/post" label="Post">'Close Enough' Matching of Rows from Two Pandas Data Frames Comparing Multiple Columns</Link></li>
//         <li><Link to="/user/post" label="Post">What bits in an arm64 instruction is the operation code?</Link></li>



//     </ol>

// </div>

// <div className="blogs">

//     <h4>Most popular aricles</h4>
//     <img src={Aimage} height='250px' width='100px'></img>

//     <ol className="sides">

//         <li><a href="/">Top IT Skills in Demand for 2024</a></li>
//         <li><a href="/">The Role of IoT in Smart Cities</a></li>
//         <li><a href="/">Networking Tips for IT Professionals</a></li>
//         <li><a href="/">The Role of IoT in Smart Cities</a></li>


//     </ol>

// </div>

// </div>

// <div className="home-bottom">

// <div className="invite">

//     <img width="30px" height="30px" src={invite}></img>
//     <Link to="/user/invite">Invite Friends</Link>

// </div>

// <div className="premium">

//     <img width="30px" height="30px" src={premium}></img>
//     <Link to="/user/premium">Get Premium</Link>

// </div>

// </div>