// class Link2 {
//     constructor({ to, label }) {
//         this.to = to;
//         this.label = label;
//         this.element = this.createLink();
//     }

//     createLink() {
//         const linkElement = document.createElement('a');
//         linkElement.href = this.to;
//         linkElement.innerHTML = this.label;
//         linkElement.addEventListener('click', (event) => {
//             event.preventDefault();
//             window.router.navigate(this.to);
//         });
//         return linkElement;
//     }

//     render() {
//         return this.element;
//     }
// }

function Link(props){

    const {to, label} = props

    function linkHandler(){
        event.preventDefault();
        window.router.navigate(this.to);
    }

    return (
        <a onClick={linkHandler} href={to}>
            {label}
        </a>
    );
}

class Router {
    constructor(routes) {
        this.routes = routes;
        this.loadInitialRoute();
        window.addEventListener('popstate', this.handlePopState.bind(this));
    }

    handlePopState() {
        this.navigate(window.location.pathname, false);
    }

    loadInitialRoute() {
        const pathName = window.location.pathname;
        this.navigate(pathName, false);
    }

    navigate(pathName, shouldPush = true) {
        if (shouldPush) {
            window.history.pushState({}, '', pathName);
        }
        const route = this.routes.find(route => route.path === pathName);
        if (route) {
            const view = new route.view();
            document.querySelector('#app').innerHTML = '';
            document.querySelector('#app').appendChild(view.render());
        }
    }
}


// TODO
// Router component
// <Test2>{children}</Test2> - a way to process child elements enclosed by a component tag
// props are not properly parsed in the transpiler - resolve
// useContext
// useReducer
// partitioning the state created by useState
// css bundling
// conditional rendering