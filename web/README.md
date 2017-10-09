# LearningStore

The web version is based on the popular Javascript framework [React](https://facebook.github.io/react/ "React").

It is still in development. A live preview can be found [here](https://nokia.github.io/LearningStore/).

## Installation
The easiest way to start a Learning Store project is to:
1. clone the project: `git clone https://github.com/nokia/LearningStore` or get the zip file from github
2. go to LearningStore\web
3. install all dependencies: `npm install`
4. finally start the project: `npm start`

## Configuration
The project contains a configuration file in the directory `web/src`.
The file contains the following data:
* `Name`: the application name  
* `Source`: the basename of the application URL. For example /LearningStore/ for the github pages (complete URL is https://nokia.github.io/LearningStore/)
* `Mapping`: the list of customizable attributes for a store single item.
* `defaultIcon`: the URL of a default Icon for all items (collection and single element).
* `trackingID`: the Google Analytics tracking ID (optional)

## Where to start?
The first steps are to:
* edit the file `web/public/store.json` to define the id, title subtitle, url, menu, carousel and home page of the new store.
* edit the file `web/src/config.js` to define the attributes that define a store item (cf. `Mapping` above). Change the default icon as well. 
* edit the content of the store (see [Content Edition]("EDITION.md") for more information). This is the **main** task!
* edit the html file `web/public/index.html` file to change the browser tab icon (favicon.ico).

## Images
We recommend that images (Icons) are stored in a directory under the directory where the store json file is installed (`public/img` in the example).

## Application size
React production buils are optimized. The current Javascript application is under 250 Kb and CSS is under 10 Kb.