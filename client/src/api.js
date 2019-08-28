import axios from 'axios';

export default {
    auth:{
        signup: (name,email,password,) => axios.post('/api/auth/signup',{email,password,name}),
        login: (email,password) => axios.post('/api/auth/login',{email,password}),
        changePassword: (oldPassword, newPassword) => axios.post('/api/auth/change-password', {oldPassword,newPassword})
    },
    user: {
        fetch: () => axios.get('/api/user'),
        performance: (start,end) => axios.get(`/api/performance/${start}/${end}`)
    },
    project:{
        fetch: id => axios.get(`/api/project/${id}`),
        fetchList: () => axios.get('/api/project/fetch-list'),
        fetchSettings: id => axios.get(`/api/project/settings/${id}`),
        create: name => axios.post('/api/project/create',{name}),
        remove: projectId => axios.post('/api/project/remove', {projectId}),
        setEncryption: (key,projectId) => axios.post('/api/project/set-encryption',{key,projectId}),
        validateKey: (hash,projectId) => axios.post('/api/project/validate',{hash,projectId}),
    },
    password:{
        create: (data,projectId) => axios.post('/api/password/create',{data,projectId}),
        edit: (id,data,projectId) => axios.post('/api/password/edit',{id,data,projectId}),
        delete: (id,projectId) => axios.post('/api/password/remove',{id,projectId})
    },
    timer:{
        start: (name,start,projectId) => axios.post('/api/timer/create',{name,start,projectId}),
        end: (id,end,projectId) => axios.post('/api/timer/end',{id,end,projectId}),
        create:(name,start,end,projectId) => axios.post('api/timer/create',{name,start,end,projectId}),
        edit:(id,name,start,end,projectId) => axios.post('/api/timer/edit',{id,name,start,end,projectId}),
        delete: (id,projectId) => axios.post('/api/timer/remove',{id,projectId})
    },
    todo:{
        create: (projectId) => axios.post('/api/todo/create',{projectId}),
        edit: (id,data,projectId) => axios.post('/api/todo/edit',{id,data,projectId}),
        delete: (id,projectId) => axios.post('/api/todo/remove',{id,projectId}),
        updateOrder:(projectId,order) => axios.post('/api/todo/order',{projectId,order})
    }
}