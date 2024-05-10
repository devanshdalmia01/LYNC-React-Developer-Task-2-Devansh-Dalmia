# File Explorer by Devansh Dalmia

![File Explorer Logo made using AI](./src/Assets/for_readme.png)

# Overview

File Explorer is a web-based application designed to simulate a file system interface within a browser, allowing users to manage files and folders as they would on a traditional desktop. This application serves as a personal storage solution where users can upload, organize, rename, delete, and recover files or folders. It includes a recycle bin feature to restore or permanently remove items, mimicking the functionality of desktop operating systems.

# Features

-   **File and Folder Management**: Create folders, upload files, rename and delete files and folders.
-   **Recycle Bin**: Temporary storage for deleted items with options to restore or permanently delete.
-   **UUID-based Navigation**: Secure and robust handling of file paths using UUIDs.
-   **Interactive UI**: User-friendly interface with context menus.

# Table of Contents

1. [Demo](#demo)
2. [Installation](#installation)
3. [Usage Guide](#usage-guide)
4. [Edge Cases](#edge-cases)
5. [Future Scope](#future-scope)
6. [Dependencies And Technology Stack](#dependencies-and-technology-stack)
7. [Contribution](#contribution)
8. [Authors](#authors)
9. [License](#license)

# Demo

[Live Demo](https://fileexplorer-devansh.netlify.app/)

Please Note:

1. Use of Google Chrome is recommend.
2. Use on laptop/desktop for the best possible experience as of now.

# Installation

## Prerequisites

Ensure you have the following installed:

-   Node.js (v14.x or later)<br/>
-   npm (v6.x or later) or yarn (v1.22.x or later)<br/>
-   A modern web browser (Chrome, Firefox, Edge, or Safari)

1. Clone the repo

    ```sh
    git clone https://github.com/devanshdalmia01/LYNC-React-Developer-Task-2.git
    ```

2. Install NPM packages

    ```sh
    cd LYNC-React-Developer-Task-2 && npm install
    ```

3. Run

    ```sh
    npm run dev
    ```

4. Open http://localhost:5173/ to view it in the browser

# Usage Guide

## Navigating the Application

-   **Home**: Access the main interface by navigating to the root URL `/`.
-   **Recycle Bin**: Click on the `recycle bin icon` or navigate to `/recyclebin` to view deleted items.
-   **Folders**: You can `double click` on the folders to navigate into them or you can `single click` on the `sidebar` to go to that particular folder
-   **Backwards/Forwards**: You can navigate across appliation using browser's backward and forward buttons. The built in `Go Back` button will only take you to `previous directory` of the current path.

## Managing Files and Folders

### **Creating File/Folder**<br/>

Use the `Upload File` or `Add Folder` buttons to add files or folders

### **Renaming**<br/>

`Right-click` on a file or folder from `sidebar` and select `Rename` to update its name, or you can select the file/folder from main area and then click `Rename button` from navbar or you can click on `context menu button` from file/folder and then click `Rename`

### **Deleting**

`Right-click` on a file or folder from `sidebar` and select `Delete` to delete it, or you can select the file/folder from main area and then click `Delete button` from navbar or you can click on `context menu button` from file/folder and then click `Delete`

### **Restoring**

When inside recycle bin, you can select the file/folder from main area and then click `Restore button` from navbar or you can click on `context menu button` from file/folder and then click `Rename`

### **Permanently Delete**

When inside recycle bin, you can select the file/folder from main area and then click `Permanent Delete` from navbar or you can click on `context menu button` from file/folder and then click `Permanent Delete`

### **Empty Recycle Bin**

When inside recycle bin, you can click `Empty Recycle Bin` from navbar to delete everything

# Edge Cases Handled

1. **Parent-Child Data Consistency**: Ensures that all operations (add, delete, restore) maintain consistent parent-child relationships in the database to prevent orphaned records or incorrect hierarchy representations.

2. **Nested/Malformed URLs**: Redirects excessively nested or malformed URLs to correct paths or to a 404 page if no valid path can be derived.

3. **Concurrent Database Access**: Handles operations on the database transactionally to prevent race conditions and ensure data integrity, especially during simultaneous accesses or modifications.

# Future Scope

1. **Drag and Drop**: Implement drag-and-drop functionality for moving files and folders within the interface.

2. **File Viewing**: Add support for viewing different file types directly within the browser, such as PDFs, images, and text files.

3. **Copy/Cut/Paste**: Introduce functionality to copy, cut, and paste files and folders, enhancing user interaction and usability.

4. **Advanced Search**: Develop an advanced search feature that allows users to search content within files and across different folder levels.

5. **File Information**: To develop a sidebar overlay to view all the information related to a file or folder selected

6. **Keyboard Support**: Implement comprehensive keyboard navigation and shortcuts to enhance accessibility and user efficiency.

7. **Multiple Selection**: Enable selecting multiple files or folders simultaneously to delete, move, or apply other operations, similar to desktop file managers.

# Dependencies And Technology Stack

I used a tried and tested tech stack. This resulted in a fast, performant, and easily-extensible web app that should be fairly future-proof for the coming next several years. I used:

-   [React.js](https://reactjs.org) - For building the user interface.
-   [Tailwind CSS](https://tailwindcss.com) - For styling the application.
-   [Dexie.js](https://dexie.org) - A wrapper for IndexedDB used for client-side storage.
-   [Headless UI](https://headlessui.com) - For accessible UI components, particularly for modals and menu.
-   [React Router](https://reactrouter.com) - For handling navigation within the application.
-   [React Toastify](https://www.npmjs.com/package/react-toastify) - For intuitive notifications to the user.
-   [Memoize One](https://www.npmjs.com/package/memoize-one) - To memoize repeated function call and improve performance.
-   [React Icons](https://react-icons.github.io/react-icons/) - For adding icons.
-   [React Tooltip](https://www.npmjs.com/package/react-tooltip) - For adding tooltips to increase user experience.
-   [Use Double Click](https://www.npmjs.com/package/use-double-click) - For correctly handling double and single clicks.
-   [UUID](https://www.npmjs.com/package/uuid) - To get unique Ids

# Contribution

Contributions are welcome! Please fork the repository and submit pull requests to the main branch. For major changes, please open an issue first to discuss what you would like to change.

# Author

## Devansh Dalmia

-   [LinkedIn](https://www.linkedin.com/in/devanshdalmia1/)
-   [GitHub](https://github.com/devanshdalmia01/)
-   [Email](mailto:devanshdalmia1@gmail.com)

# License

[MIT](https://opensource.org/licenses/MIT)
