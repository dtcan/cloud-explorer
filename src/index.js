import React from "react";
import ReactDOM from "react-dom";
import { Header } from "./main";
import { List, ListItem, ListItemText } from "@material-ui/core";

function App() {
    return <>
        <Header title={title} />
        <List>
            {paths.map((path, i) => (
                <ListItem button component="a" href={rootDir + "dir/" + i}>
                    <ListItemText primary={path.name} />
                </ListItem>
            ))}
        </List>
    </>;
}

ReactDOM.render(<App />, document.querySelector("#app"));
