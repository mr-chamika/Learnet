import { createContext, setContext, useState } from "../../react_lite/createDOM";

class RouterDetailsNew {
    constructor(routes, redirects){
        function splitRoutePaths(routes){
            for(let route of routes){
                if(route.index) continue
                route.splitPath = RouterDetailsNew.splitPathFunc(route.path)
                splitRoutePaths(route.children)
            }
        }

        splitRoutePaths(routes)

        this.routes = routes
        if(redirects){
            this.redirects = redirects
        }else{
            this.redirects = {}
        }
    }

    static splitPathFunc(path){
        return path.trim().split("/").filter(s=>s !== "")
    }

    static pathMatch(path, routes){
        const urlParams = {}
        function util(splitPath, routes){
            for(let route of routes){
                if(route.index) continue
                let i
                for(i = 0; i < route.splitPath.length; i++){
                    if(route.splitPath.length < 1) throw Error("Router Error : format of the path(s) provided to the router is incorrect.")
                    if(route.splitPath[i][0] === ":"){
                        urlParams[route.splitPath[i].slice(1)] = splitPath[i]
                        continue
                    }
                    if(splitPath[i] !== route.splitPath[i]) break
                }

                if(i === route.splitPath.length){
                    const pathRemaining = splitPath.slice(route.splitPath.length)
                    if(pathRemaining.length){

                        const child = util(pathRemaining, route.children)
                        if(!child) continue
                        return {type: route.element.name, props: route.props, children: [child], componentFunction: route.element}
                    }else{
                        // sending the index page as a child elemet if available
                        if(route.children && route.children[0] && route.children[0].index){
                            if(!route.element.name) throw Error("route.element.name is null")
                            if(!route.children[0].element.name) throw Error("route.children[0].element.name is null")
                            return {
                                type: route.element.name,
                                props: route.props,
                                children: [
                                    {
                                        type: route.children[0].element.name,
                                        props: route.children[0].props,
                                        children: [],
                                        componentFunction: route.children[0].element
                                    }
                                ],
                                componentFunction: route.element
                            }
                        }
                        if(!route.element.name) throw Error("route.element.name is null")
                        return {type: route.element.name, props: route.props, children: [], componentFunction: route.element}
                    }
                }
            }
        }

        // return value format : [route, urlParams]
        return [util(RouterDetailsNew.splitPathFunc(path), routes, 0), urlParams]
    }

    configPopStateListener(setCurrentRoute, setParams){
        window.addEventListener('popstate', ()=>{
            const [route, params] = this.#handlePopState.bind(this)()
            setCurrentRoute(route)
            setParams(params)
        });
    }

    #handlePopState() {
        return this.#navigate(window.location.pathname, false);
    }

    loadInitialRoute() {
        const pathName = window.location.pathname;
        return this.#navigate(pathName, false);
    }

    #navigate(pathName, shouldPush = true) {

        // if(pathName === "/"){
        //     if(localStorage.getItem("token")){
        //         return this.#navigate("/user", true)
        //     }
        // }

        // checking redirects before navigating to the provided path
        let redirect
        if((redirect = this.redirects[pathName])){ // if there is a redirect defined for the path provided
            if(redirect.condition()){
                return this.#navigate(redirect.to, true)
            }
        }


        if (shouldPush) {
            window.history.pushState({}, '', pathName);
        }
        let [route, urlParams] = RouterDetailsNew.pathMatch(pathName, this.routes)
        if(!route){
            route = this.routes.find(route => route.path === "*")

            if(!route) throw Error("(Router Error) Matching route for the path cannot be found. Add fallback route with the path='*' ")

            route = {
                type: route.element.name,
                props: route.props,
                children: [],
                componentFunction: route.element
            }
        }
        return [route, urlParams]
    }

    navigateTo(pathName){
        return this.#navigate(pathName, true)
    }
}

class RouterDetails {
    constructor(routes) {
        this.routes = routes;
    }

    static pathMatch(path, routes){
        function util(path, routes){
            for(let route of routes){
                if(route.index) continue
                if(path.slice(0, route.path.length) === route.path){
                    const pathRemaining = path.slice(route.path.length)
                    if(pathRemaining){
                        const child = RouterDetails.pathMatch(pathRemaining, route.children)
                        if(!child) continue
                        return {type: route.element.name, props: route.props, children: [child], componentFunction: route.element}
                    }else{
                        // sending the index page as a child elemet if available
                        // console.log(route.element.name)
                        if(route.children && route.children[0] && route.children[0].index){
                            if(!route.element.name) throw Error("route.element.name is null")
                            if(!route.children[0].element.name) throw Error("route.children[0].element.name is null")
                            return {
                                type: route.element.name,
                                props: route.props,
                                children: [
                                    {
                                        type: route.children[0].element.name,
                                        props: route.children[0].props,
                                        children: [],
                                        componentFunction: route.children[0].element
                                    }
                                ],
                                componentFunction: route.element
                            }
                        }
                        if(!route.element.name) throw Error("route.element.name is null")
                        return {type: route.element.name, props: route.props, children: [], componentFunction: route.element}
                    }
                }
            }
            return null
        }

        return util(path, routes)
    }

    configPopStateListener(setCurrentRoute){
        window.addEventListener('popstate', ()=>setCurrentRoute(this.#handlePopState.bind(this)));
    }

    #handlePopState() {
        return this.#navigate(window.location.pathname, false);
    }

    loadInitialRoute() {
        const pathName = window.location.pathname;
        return this.#navigate(pathName, false);
    }

    #navigate(pathName, shouldPush = true) {
        if (shouldPush) {
            window.history.pushState({}, '', pathName);
        }
        // let route = this.routes.find(route => route.path === pathName);
        let route = RouterDetails.pathMatch(pathName, this.routes)
        if(!route){
            // console.log("route : ", route)
            // route = this.routes[this.routes.length - 1]
            route = this.routes.find(route => route.path === "*")

            if(!route) throw Error("(Router Error) Matching route for the path cannot be found. Add fallback route with the path='*' ")

            route = {
                type: route.element.name,
                props: route.props,
                children: [],
                componentFunction: route.element
            }
        }
        
        // console.log("route : ", route)
        return route
    }

    navigateTo(pathName){
        return this.#navigate(pathName, true)
    }
}

export const routerContext = createContext(null, "router")

const Router = ({routes, redirects}) => {

    // redirects are of the form
    // redirects = {
    //     "the path": {
    //         condition: "function that returns a boolean",
    //         to: "where to be redirected if the condition satisfied"
    //     }
    // }

    // const router = new RouterDetails(routes)
    const router = new RouterDetailsNew(routes, redirects)
    const [initRoute, urlParams] = router.loadInitialRoute()
    const [currentRoute, setCurrentRoute] = useState(initRoute)
    const [params, setParams] = useState(urlParams)
    router.configPopStateListener(setCurrentRoute, setParams)
    const goto = (path) => {
        const [route, params] = router.navigateTo(path)
        if(params){
            setParams(params)
        }
        setCurrentRoute(route)
    }

    const key = Date.now().toString()
    console.log("key : ", key)
    setContext(routerContext, {goto, params, key})

    return (
        <div>
            {[currentRoute]}
        </div>
    );
}
 
export default Router;
// addComponent("Router", Router)

