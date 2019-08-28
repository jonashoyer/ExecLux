import React from 'react';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

// import validateInput from "";
// From https://github.com/oliviertassinari/react-swipeable-views
import SwipeableViews from 'react-swipeable-views';

import {Store} from '../components/context';

import api from '../api';


const tabStyle = {
    margin: "auto"
}

const Form = props => {
    const [formIndex,setFormIndex] = React.useState(null === "/signup" ? 1 : 0);
    const store = React.useContext(Store);

    const handleChange = (value) => {
        setFormIndex(value)
    }

    return (
        <Paper zDepth={2} style={{padding:'48px 64px',boxSizing:"border-box",maxWidth: 450,margin: "auto", marginTop:"20vh"}}>
            <SwipeableViews
            index={formIndex}
            onChangeIndex={handleChange}
            >
                <div style={tabStyle}>
                
                    <Login store={store} />
                    <Button variant="flat" style={{display:"block",margin:"24px auto"}} onClick={()=> handleChange(1)} >
                        Create Account
                    </Button>
                    
                </div>
                <div style={tabStyle}>

                    <Signup store={store} />
                    <Button variant="flat" style={{display:"block",margin:"24px auto"}} onClick={()=> handleChange(0)} >
                    Back to Login
                    </Button>

                </div>
            </SwipeableViews>
        </Paper>
    );
}

const Login = props => {
    const [email,setEmail] = React.useState('');
    const [password,setPassword] = React.useState('');
    const [errors,setErrors] = React.useState({});
    const [isLoading,setLoading] = React.useState(false);

    const validate = () =>{
        const err = {};
        if(!email) err.email = "Can't be blank";
        if(!password) err.password = "Can't be blank";
        return err;
    }

    const onSubmit = e =>{
        e.preventDefault();
        const errors = validate();
        setErrors(errors);

        if(Object.keys(errors).length === 0){

            api.auth.login(email,password).then( res => {
                props.store.setUser(res.data);
            })

            // this.props.login(this.state).catch((err) => {this.setState({errors: err.response ? err.response.data.errors : "Error", isLoading: false})});
        }
    }

    return (
        <div className="login-content">
            <h3>Exec Lux Login</h3>
            <p className="error-text">{errors.global}</p>
            <form id="login-form" onSubmit={onSubmit}>

                <TextField
                name="email"
                style={{display:"block",margin:"auto"}}
                label="Email"
                type="email" 
                value={email}
                fullWidth
                errorText={errors.email}
                onChange={e => setEmail(e.target.value)}
                />
                
                <TextField
                name="password"
                style={{display:"block",margin:"auto",marginTop:15}}
                label="Password"
                type="password" 
                fullWidth
                value={password}
                errorText={errors.password}
                onChange={e => setPassword(e.target.value)}
                />          
                <Button variant="raised" type="submit" value="Submit" form="login-form" color="primary" style={{margin:"24px auto",display:"block"}} disabled={isLoading} >
                    Login
                </Button>    
            </form>
        </div>

    );
}

const Signup = props =>{
    const [name,setName] = React.useState('');
    const [email,setEmail] = React.useState('');
    const [password,setPassword] = React.useState('');
    const [password2,setPassword2] = React.useState('');
    const [errors,setErrors] = React.useState({});
    const [isLoading,setLoading] = React.useState(false);

    const validate = () => {
        const err = {};
        if(!name) err.name = "Can't be blank";
        if(!password) err.password = "Can't be blank";
        if(password !== password2) err.password = "Passwords don't match";
        return err;
    }

    const onSubmit = e => {
        e.preventDefault();
        const errors = validate();
        setErrors(errors);

        if(Object.keys(errors).length === 0){
            api.auth.signup(name,email,password).then( res => {
                props.store.setUser(res.data);
            })
        }
    }
    

    return (

        <div className="login-content">
            <h3>Create account</h3>
            <p className="error-text">{errors.global}</p>
            <form id="create-form" onSubmit={onSubmit}>

            <TextField
            name="name"
            style={{display:"block",margin:"auto"}}
            label="Name"
            value={name}
            fullWidth
            error={errors.name}
            onChange={e=>setName(e.target.value)}
            />

            <TextField
            name="email"
            style={{display:"block",margin:"auto", marginTop:15}}
            label="Email"
            type="email"
            value={email}
            fullWidth
            error={errors.email}
            onChange={e=>setEmail(e.target.value)}
            />
            
            <TextField
            name="password"
            style={{display:"block",margin:"auto", marginTop:15}}
            label="Password"
            type="password" 
            value={password}
            fullWidth
            error={errors.password}
            onChange={e=>setPassword(e.target.value)}
            />      

            <TextField
            name="secpassword"
            style={{display:"block",margin:"auto", marginTop:15}}
            label="Confirm Password"
            fullWidth
            type="password" 
            value={password2}
            error={errors.password}
            onChange={e=>setPassword2(e.target.value)}
            />           

            <Button variant="raised" type="submit" form="create-form" color="primary" style={{margin:"24px auto",display:"block"}} disabled={isLoading} > 
            Create account
            </Button>   
            </form>
        </div>

    );
}

export default Form;


// Login.prototype = {
//     login: React.prototype.func.isRequired
// }

// Login.contextTypes={
//     router:React.prototype.object.isRequired
// }