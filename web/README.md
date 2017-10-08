# LearningStore

The web version is based on the popular Javascript framework [React](https://facebook.github.io/react/ "React").

It is still in development. A beta version can be found [here](https://nokia.github.io/LearningStore/).

## Installation
The easiest way to start a Learning Store project is to:
1. clone the project: `git clone https://github.com/nokia/LearningStore`
2. go to LearningStore
3. create a new react application: `create-react-app web2`
4. copy all files from web to web2 and replace existing files
5. install all dependencies in [package.json](./package.json "package.json").package.json
6. finally start the project: `npm start`

## Configuration
The project contains a configuration file in the directory `web/src`.
The file contains the following data:
* Name: the application name  
* Source: the basename of the application URL. For example /LearningStore/ for the github pages (complete URL is https://nokia.github.io/LearningStore/)
* Mapping: the list of customizable attributes for a store single item.
* defaultIcon: the URL of a default Icon for all items (collection and single element).
* trackingID: the Google Analytics tracking ID (optional)
