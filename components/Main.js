import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Footer from './Footer';
import FCoreMenu from '../menus/menu/FCoreMenu';
import { Container, Grid } from '@material-ui/core';
import Header from './Header';
import { Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import { connect } from 'react-redux';
import {routes} from '../routes/routes';
import Axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    main: {
        //marginTop: theme.spacing(8),
        marginBottom: theme.spacing(2),
    }
}));

function Main(props) {
    const classes = useStyles();

    useEffect(() => {

        


    }, [])

    return (
        <div className={classes.root}>
           
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <Header />
                        </Grid>
                        <Grid item xs={12}>

                            <FCoreMenu groupId={99} mode=""/>

                        </Grid>
                       
                    </Grid>
                </Grid>

                <Grid item xs={12}>

                    
                    <Route path="/" exact component={Dashboard} />

                    {routes.map((Item, index)=> (
                        <Route key={index} path={Item.path} exact render={(props) => <Item.Component key={props.location.state.info.pageMode} {...props} />} />
                    ))}        
                   
                </Grid>
            </Grid>
            
            <Footer />
        </div>
    );
}
const mapDispatchToProps = (dispatch) => {
    return {
        saveToken: (token) => { dispatch({ type: "SAVE_TOKEN", token }) },
        saveGP: (gp)=> {dispatch({type: "SAVE_GP", gp})}
    }
}
export default connect(null, mapDispatchToProps)(Main);