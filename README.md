# cloud-explorer
An express server that acts as a file explorer for local files on the server

## Dependencies
This project requires Node.js and ImageMagick.

## Setup
To clone the repository and install the npm dependencies, run these commands:
```shell
git clone https://github.com/dtcan/cloud-explorer
cd cloud-explorer
npm i
```

Edit the `config.json` file to list the directories that you want to access remotely in the `paths` array. For each directory, give the name you want displayed and an absolute path to the directory. Here is an example for a Windows machine:
```
{
...
    "paths": [
        {
            "name": "Documents",
            "path": "C:/Users/user/Documents"
        },
        {
            "name": "Pictures",
            "path": "C:\\Users\\user\\Pictures"
        }
    ]
...
}
```

## Build
Run this command from the `cloud-explorer` directory:
```shell
npx webpack
```
This will use webpack to create a bundle for the front-end. You need to run this command again if you make changes to files in the `src` directory.

## Run
Run this command from the `cloud-explorer` directory:
```shell
node .
```
This will run an express server which will serve the front-end and local files. By default, this will be accessible from `localhost:8080`. If you want to use a different port, use the `PORT` variable:
```shell
PORT=4567 node .
```

## Configuration
Aside from choosing the paths, you can also set the `url_root` variable in `config.json`, which will set the parent directory that will be prepended to all URLs. This is useful if you intend to have this explorer be accessible from a subdirectory like `example.com/explorer/` rather than from the root directory `example.com`.
