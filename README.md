<a id="readme-top"></a>
<h1 align="center"> BookMark </h1>
BookMark was created to keep track of url links in a more visual way. 
Users can log in and save their URL's by category and store them in their catalog of resources. 
<br />

<h3 align="center">
  <a href=""> *DEMO (WIP)*</a> | <a href="https://github.com/Michaela-K/BookMark/issues">* Report a Bug *</a>
</h3>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About the Project <a id="about"></a>

![BookMark Demo](public/BookMark-Demo.gif)

### Built With 

- Express
- Node.js
- JavaScript
- PostgreSQL
- SASS

<p align="right"><a href="#readme-top">back to top</a></p>


<!-- GETTING STARTED -->
## Getting Started <a id="getting-started"></a>

### Installation <a id="installation"></a>

1. Clone the repo
   ```sh
   git clone git@github.com:Michaela-K/BookMark.git
   ```
2. Install NPM packages in the root directory
   ```sh
   npm install
   ```
3. Fix to binaries for sass
   ```sh 
   npm rebuild node-sass
   ```
4. Create a `.env` file
   ```sh
   PORT=8000 (or another port you prefer)

   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=(your username name here)
   DB_PASS=(your password here)
   DB_NAME=bookmark
   ```
5. Reset database 
   ```sh
   npm run db:reset
   ```
    Check the db folder to see what gets created and seeded

6. Start the app
   ```sh
   npm run local
   Visit `http://localhost:8000/`
   ```
<p align="right"><a href="#readme-top">back to top</a></p>


## Features <a id="features"></a>
- [ ] Host project (Work in Progress)
- [x] Log in to view navbar options
- [x] Search through resources
- [x] Create a new bookmark/resource
- [x] Create a new category
- [x] View all categories
- [x] On the My-Resources page, view resources created and resources liked
- [x] View and edit user profile
- [x] View, edit or delete a resource
- [x] Rate, Comment or Like a resource
- [ ] Responsiveness to be improved

<p align="right"><a href="#readme-top">back to top</a></p>
