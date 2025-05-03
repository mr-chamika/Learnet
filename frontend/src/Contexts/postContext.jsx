import { createContext, useState } from "../../react_lite/createDOM";

export const postContext = createContext({});

const PostContextProvider = ({ children }) => {

    const [load, setLoad] = useState(false);

    return (

        <postContext.Provider value={{ load, setLoad }}>

            {children}

        </postContext.Provider>

    );

}

export default PostContextProvider;