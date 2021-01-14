import React from "react";
import ReactDOM from "react-dom";
import { Grid, Paper, TextField, Typography } from "@material-ui/core";

function App() {
    return <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
    >
        <Grid item xs={12}>
            <Paper style={{ padding: 20 }}>
                <Typography variant="h3">Cloud Explorer</Typography>
                <form>
                    <TextField id="password" type="password" label="Password" style={{ width: "100%" }} />
                </form>
            </Paper>
        </Grid>
    </Grid>
}

ReactDOM.render(<App />, document.querySelector("#app"));