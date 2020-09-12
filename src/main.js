import React from "react";
import { AppBar, Icon, IconButton, Toolbar, Typography } from "@material-ui/core";

export class Header extends React.Component {
    render() {
        return <>
            <AppBar position="fixed">
                <Toolbar>
                    {
                        this.props.back ?
                        <IconButton edge="start" color="inherit" component="a" href={this.props.back}>
                            <Icon>arrow_back</Icon>
                        </IconButton> :
                        <></>
                    }
                    <Typography variant="h6">{this.props.title}</Typography>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </>;
    }
}

export function addListItem(list, path, label) {
    var item = document.createElement("li");
    var link = document.createElement("a");
    link.setAttribute("href", path);
    link.innerHTML = label;
    item.appendChild(link);
    list.appendChild(item);
}
