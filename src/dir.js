import React from "react";
import ReactDOM from "react-dom";
import { Header } from "./main";
import { AppBar, Grid, Icon, IconButton, List, ListItem, ListItemIcon, ListItemText, Slider, Toolbar, Typography } from "@material-ui/core";

const ICON_MAP = {
    "application": "insert_drive_file",
    "audio": "audiotrack",
    "directory": "folder",
    "image": "photo",
    "video": "slideshow"
}

class AudioPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: "", progress: 0 };
        this.audioElement = document.querySelector("#audio");
        this.audioElement.addEventListener("timeupdate", this.updateProgress.bind(this));
    }
    updateProgress() {
        var progress = this.audioElement.duration ? this.audioElement.currentTime / this.audioElement.duration : 0;
        this.setState(state => {
            return {
                name: state.name,
                progress: progress
            }
        });
    }
    loadAudio(file) {
        this.audioElement.pause();
        this.audioElement.src = file.path;
        this.audioElement.load();
        this.audioElement.play();
        if('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: file.name,
                album: directory.name
            });
        }
        this.setState({ name: file.name, progress: 0 });
    }
    togglePlay() {
        this.setState(state => {
            if(this.audioElement.paused) {
                this.audioElement.play();
            }else {
                this.audioElement.pause();
            }
            return {
                name: state.name,
                progress: state.progress
            }
        });
    }
    unloadAudio() {
        this.audioElement.pause();
        this.audioElement.src = undefined;
        this.audioElement.load();
        this.setState({ name: "", progress: 0 });
    }
    seekTo(percent) {
        this.audioElement.currentTime = this.audioElement.duration * percent;
        this.updateProgress();
    }
    render() {
        const SEEK_RESOLUTION = 1000;
        return <>
            <Toolbar />
            <AppBar position="fixed" style={{ top: "auto", bottom: 0 }}>
                {
                    this.state.name ?
                    <Toolbar>
                        <Grid container direction="column" justify="center" alignItems="center">
                            <Grid item style={{ padding: 10 }}>
                                <Typography style={{ textAlign: "center" }}>{this.state.name}</Typography>
                            </Grid>
                            <Grid container item direction="row" justify="center" alignItems="center">
                                <Grid item>
                                    <IconButton edge="start" color="inherit" onClick={this.togglePlay.bind(this)}>
                                        <Icon>{ this.audioElement.paused ? "play_arrow" : "pause" }</Icon>
                                    </IconButton>
                                    <IconButton edge="start" color="inherit" onClick={this.unloadAudio.bind(this)}>
                                        <Icon>stop</Icon>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={9}>
                                    <Slider
                                        color="secondary" style={{ width: "100%" }} aria-labelledby="continuous-slider"
                                        max={SEEK_RESOLUTION} value={this.state.progress * SEEK_RESOLUTION}
                                        onChange={(_,v) => { this.seekTo(v / SEEK_RESOLUTION) }} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Toolbar> : <></>
                }
            </AppBar>
        </>
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.parent = directory.path.substring(0, directory.path.lastIndexOf("/") + 1);
        if(this.parent.length > 0) {
            this.parent = "/dir/" + this.parent;
        }else {
            this.parent = "/";
        }
    }
    onFileClick(file) {
        if(this.audioPlayer && file.type.startsWith("audio")) {
            this.audioPlayer.loadAudio(file);
        }else {
            console.log(file);
        }
    }
    render() {
        return <>
            <Header title={directory.name} back={this.parent} />
            <List>
                {directory.directories.map(dir => (
                    <ListItem button component="a" href={dir.path}>
                        <ListItemIcon>
                            <Icon>{ICON_MAP["directory"]}</Icon>
                        </ListItemIcon>
                        <ListItemText primary={dir.name} />
                    </ListItem>
                ))
                .concat(directory.files.map(file => {
                    const fileConst = file;
                    return (
                        <ListItem button onClick={() => { this.onFileClick(fileConst) }}>
                            <ListItemIcon>
                                <Icon>{ICON_MAP[file.type.substring(0, file.type.indexOf("/"))] || ICON_MAP["application"]}</Icon>
                            </ListItemIcon>
                            <ListItemText primary={file.name} />
                        </ListItem>
                    )
                }))}
            </List>
            <div id="extra"></div>
        </>;
    }
}

document.title = directory.name + " - " + document.title;
var app = ReactDOM.render(<App />, document.querySelector("#app"));
if(directory.type == "audio") {
    app.audioPlayer = ReactDOM.render(<AudioPlayer />, document.querySelector("#extra"));
}