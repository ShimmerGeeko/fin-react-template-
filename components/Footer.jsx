import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { Grid } from '@material-ui/core';

function Copyright() {
  return (
    <Typography variant="body2" style={{ color: "white" }}>
      <Link style={{ color: "white" }} href="https://www.finacus.co.in/">
        All rights reserved &#169; Finacus
        </Link> 2007 {' - '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({

  footer: {
    padding: theme.spacing(0.8, 0),
    marginTop: 'auto',
    backgroundColor: "#58585A"
  },
}));
const Footer = () => {

  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Container maxWidth="lg">
        <Grid container justify="flex-start">
          <Grid item xs={2}>
            <Typography variant="body1" style={{ color: "white" }}>Finacus Application.</Typography>
          </Grid>
          <Grid item xs={7}></Grid>
          <Grid item xs={3}>
            <Copyright />
          </Grid>
        </Grid>

        
      </Container>
    </footer>
  )
}

export default Footer;