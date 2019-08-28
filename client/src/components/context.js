import React from 'react';
import axios from "axios";

let init = {};
const token = localStorage.getItem('token');
if(token){
    init.hasAuth = !!token;
    axios.defaults.headers.common.authorization = `Bearer ${token}`;
}
init.projectId = localStorage.getItem('selectedProject');

const context = React.createContext();

export const Consumer = context.Consumer;

export const Provider = props => {
    const [store,setStore] = React.useState(init);

    React.useEffect(()=>{
        localStorage.setItem('selectedProject', store.projectId);
    },[store.projectId]);

    const set = obj => setStore({...store,...obj});
    const setUser = token => {
        set({hasAuth:!!token});
        axios.defaults.headers.common.authorization = `Bearer ${token}`;
        localStorage.setItem('token',token);
    }
    const setDialog = (Component, props) => {
        set({dialog:{Component,props}});
    }

    const setProject = id => {
        set({projectId:id});
    }

    return (
        <context.Provider value={{...store, set, setUser, setDialog, setProject}}>
            {props.children}
        </context.Provider>
    )
}

export const Store = context;