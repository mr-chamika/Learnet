import { createContext, useEffect, useState } from "../../react_lite/createDOM";

export const themeContext = createContext({})

const ThemeContextProvider = ({children}) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [darkTheme, setDarkTheme] = useState(false)

    useEffect(()=>{
        const isc = localStorage.getItem("sidebar-collapsed")
        if(isc === "true") setIsSidebarCollapsed(true)
        else localStorage.setItem("sidebar-collapsed", "false")

        const themeLS = localStorage.getItem("theme")
        // if(localStorage.getItem("dark-theme") === "true"){
        //     setDarkTheme(true)
        // }

        if(themeLS === "light"){
            setDarkTheme(false)
        }else if(themeLS === "dark"){
            setDarkTheme(true)
        }else if(themeLS === "device"){
            const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
            // console.log(isDarkMode ? "Dark mode" : "Light mode");
            setDarkTheme(isDarkMode)
    
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
            const updateTheme = (event) => {
                const isDarkMode = event.matches ? true : false;
                if(isDarkMode){
                    document.querySelector(".app").classList.add("dark")
                }else{
                    document.querySelector(".app").classList.remove("dark")
                }
            };
    
            mediaQuery.addEventListener("change", updateTheme);
        }

        return ()=>{
            if(themeLS === "device"){
                mediaQuery.removeEventListener("change", updateTheme)
            }
        }
    }, [])

    const toggleTheme = () => {
        document.querySelector(".app").classList.toggle("dark")
        if(localStorage.getItem("dark-theme") === "true"){
            localStorage.setItem("dark-theme", "false")
        }else{
            localStorage.setItem("dark-theme", "true")
        }
    }

    return ( 
        <themeContext.Provider value={{isSidebarCollapsed, setIsSidebarCollapsed, toggleTheme}}>
            {children}
        </themeContext.Provider>
     );
}
 
export default ThemeContextProvider;