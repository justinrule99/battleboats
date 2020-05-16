# Group 30: Battleboats (Com S 319)

Javascript Based Battleship Game

Voted 4th best project out of 48 in Com S 319 Spring 2020

Justin Rule, Joe Slater, Isaac Reed, Alan Zapinski

# Running Locally

* Clone the repository
* Type `yarn` in a terminal to install dependencies
    [(Install yarn)](https://classic.yarnpkg.com/en/docs/install/#windows-stable)
* `yarn client` will start the React front-end only
  * Client runs on `localhost:3000`
* `yarn server` will start the express `server.js` only
  * Server runs on `localhost:8080`
* `yarn dev` will start both server and client concurrently

# About

The frontend was created entirely in [react](https://reactjs.org/), with styling help from [react-bootstrap](https://react-bootstrap.github.io/) and graphical help from [react-p5](https://www.npmjs.com/package/react-p5).

Battleboats implements a MySQL database to store user information and high scores. Passwords are hashed and salted with [bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme). 

We created a simple REST API with [Node](https://nodejs.org/en/) to connect our database and frontend.

Note: This project was imported from a GitLab project after completion, so commit history is incomplete. 

Last updated 5/16/2020