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
                <Typography variant="h3">{title}</Typography>
                <form onSubmit={e => {
                        e.preventDefault();
                        var data = new FormData(e.target);
                        
                        fetch(rootDir + "auth", {
                            method: "POST",
                            headers: {
                                'Content-Type': "application/x-www-form-urlencoded"
                            },
                            body: "pass="+data.get("pass")
                        }).then(r => r.json())
                        .then(response => {
                            if(response && response.success) {
                                document.location = rootDir;
                            }else {
                                alert(response.error || "Unknown error");
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            alert("Request failed. Check the console for details.");
                        });
                    }}>
                    <TextField name="pass" type="password" label="Password" style={{ width: "100%" }} />
                </form>
            </Paper>
        </Grid>
    </Grid>
}

ReactDOM.render(<App />, document.querySelector("#app"));