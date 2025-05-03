import { createContext, useEffect, useState } from "../../../frontend/react_lite/createDOM";

export const themeContext = createContext({})

const ThemeContextProvider = ({children}) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

    useEffect(()=>{
        const isc = localStorage.getItem("sidebar-collapsed")
        if(isc === "true") setIsSidebarCollapsed(true)
        else localStorage.setItem("sidebar-collapsed", "false")
    }, [])

    return ( 
        <themeContext.Provider value={{isSidebarCollapsed, setIsSidebarCollapsed}}>
            {children}
        </themeContext.Provider>
     );
}
 
export default ThemeContextProvider;