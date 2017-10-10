# Content Edition

All the stores can be edited directly in a web browser. A set of keyboard shortcuts allows to create, modify, save, upload etc. store items.

A store can be entirely created and updated without backend processes, although it would be simpler to have a centralised process which manages automatically all the updates.

To avoid conflict, i.e. two different modifications on the same item, it recommended that there is a **unique owner** for each item of a store. Each owner is reponsible for a set of items and share modifications with the global store owner who can apply various updates on the store before republishing the whole store. 

Sharing is done with the `alt-s` command that saves in a file all the browser saved operations.
Publishing is achieved with `alt-d` that dumps an entire store into a file. The file can then be uploaded to the Web server directly.

## Shortcuts

The following shorcuts are defined and can be used with the keyboard. They will be added to a Toolbar that can be displayed / hidden in a later version for a better user experience.

* `alt-e` edit the current item (collection or single item).
* `alt-n` create a new (single) item.
* `alt-f` create a new collection (f like folder).
* `alt-x` delete the current item (item or collection). This operation is automatically saved.
* `alt-c` copy the current item ID into the clipboard. This is useful before setting the list of collection items.

### Undo / Redo
* `alt-z` undo the last **saved** operation 
* `alt-y` redo the last **undone** operation 

### File operations
* `alt-s` download to a local file all modifications saved in the browser (so that it can be shared with others).
* `alt-o` load one or more files (containing saved modifications).
* `alt-d` save locally the complete store (so that it can be uploaded to the server).

### Other
* `alt-l` open the logs of saved operations
* `alt-w` shows work in progress (WIP) according to the selected store (toggle command)
* `alt-h` Go Home
* `alt-r` reset all **saved** operations. Better consult the logs before doing this...
 
## File export / import

### Export
Modifications saved in the browser can be exported to a file at any time. The file name is automatically generated according to the following convention: `A-browserID.uniqueID.json`

It is wise to save modifications before closing the browser in case the browser clears its cache when closing.

Since a new file is generated at each `alt-s` command, the old files can be deleted. Only the most recent file is relevant.

### Import
Files can be loaded in the browser with the `alt-o` command. Multiple files can be selected.

### Conflicts
Conflicts may be detected during the import operation when two items with the same ID are loaded. The logs can be checked (`alt-l` command) to see the files and item IDs which conflict. 

**NB:** Conflicting items are not imported.
Non conflicting items are imported.

However it is safer to reject all imports in case of conflicts, with the `alt-r` command and resolve the conflicts before importing again.

## Local Storage
The application relies on the HTML5 local storage API. The following names are used to make data persistent:
* localStorage.authorID: stores the browser / author unique ID.
* localStorage.edit: contains the saved operations.
* localStorage.editPos: defines the current position in localStorage.edit after undo / redo operations. 




