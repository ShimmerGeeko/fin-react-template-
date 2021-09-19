import { Container, Grid, Typography } from '@material-ui/core';
import React from 'react';

const Dashboard = (props) => {

    return (
        <Container maxWidth="lg">
            <Grid container justify="center" alignItems="center">
                <Grid item xs={12}>
                    <Typography variant="h4">Fincore CBS</Typography>
                </Grid>
            </Grid>
         </Container>
    );
}

export default React.memo(Dashboard);