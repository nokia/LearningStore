# LearningStore
The Nokia Learning Store is an application that directs learners to today's hottest learning offers: products, technology and business skills.

The Learning Store eliminates the need for lengthy searches and multiple access points to find relevant learning resources. Clear, simple icons point users to key learning topics while a left menu bar specifies user groups and topics.

The Learning Store is one place to browse for all learning needs. A recognizable and understandable format patterned after today's most familiar on-line applications.

A [live preview](https://nokia.github.io/LearningStore/ "The Open Source Learning Store") of the open source version is available (it is still under development) and can be compared to the production version of the [Nokia Learning Store](http://learningstore.nokia.com). 

## Technology
The store is architectured as a Single Page Application (SPA) so that there is no delay when browsing and searching the store.

It is developed in Javascript and relies on the popular [React](https://facebook.github.io/react/ "React") framework (the Facebook framework).

All the data are prepared through a backend process and loaded once in the application. This allows a fast and responsive user experience.

The data are structured in [JSON](https://en.wikipedia.org/wiki/JSON) files. A startup file, called store.json and one file per store. The JSON files are common to the web and mobile applications.

### Store.json
The file contains an array where each entry describes a store. A store is represented by the following data: id, title, subtitle and url.

    "id": "customer",
    "title": "Customer Store",
    "subtitle": "Access the best learning offers for today's products and technologies to help you achieve your business objectives.",
    "url": "http://learningstore.nokia.com/customer",

Each entry describes also the home page of the store. The store home page includes: a carousel, a homepage section (usually below the carousel) and a menu. 

#### Carousel
The carousel structure is an array that contains an image and one of url, id or html. `Url` points to any URL, `id` is the ID of a store item and `html` is a page that is displayed when the user clicks on the image of the carousel.

        "carousel": [
        {
            "img": "img/carousel-video-demo.jpg",
            "url": "https://www.youtube.com/embed/uSTzkzBNkXE"
        },
        {
            "img": "img/carousel-sr-prod-overviews.jpg",
            "id": "n.1477658737129"
        }]

#### Homepage
The homepage structure is an array that contains sections of featured store items.

        "homepage": [
        {
            "title": "Featured Technologies",
            "items": ["n.1472887445473", "n.1472887514849", "n.1472887540319", "n.1472887576282", "n.1472887595746", "n.1472887632557"]
        }]

`title` is the title of the section and `items` is the array of store items represented by their IDs.

#### Menu
The menu structure is an array describing the store menu.

        "menu": [
        {
            "title": "What's New",
            "id": "c.33"
        },
        {
            "title": "Professional Development",
            "category": true,
            "content":[
            {
                "title": "Personal Skills",
                "id": "c.25"
            },
            {
                "title": "Innovation & Change",
                "id": "n.1464255805872"
            },

A menu entry needs a `title` and either an item ID or a submenu (`content`). In addition, a menu entry can be regrouped into a `category` menu in order to save space.

### Process flow
The standard process flow is the following:


    App.js -> Home.js -> Store.js -> Item.js

`App.js` is the entry point of the application. `Home.js` displays the list of stores available. `Store.js` displays the homepage of the selected store and `Item.js` shows the details of a store item.

## Content Edition

All the stores can be edited directly in a web browser. A set of keyboard shortcuts allows to create, modify, save, upload etc. store items. See [Content Edition](web/EDITION.md "Content Edition") for more information.


## License

This project is licensed under the BSD-3-Clause license - see the [LICENSE](https://github.com/nokia/LearningStore/blob/master/LICENSE).