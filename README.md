# Twitch Exe

***

## Summary
Twitch Exe is a desktop application that delivers a smooth viewing experience for enjoying live broadcasts from [Twitch.tv](http://twitch.tv/)

Unlike the viewing experience on (Twitch.tv)[http://twitch.tv/] itself, Twitch Exe provides a app-like user expereince to the user. Built into [Electron](http://electron.atom.io/)(formally Atom Shell) Twitch Exe is essentially a single-page application.

***

## Tech Stack and Reasoning

* [Electron](https://electron.atom.io/)
* [Node](https://nodejs.org/)
* [React](https://facebook.github.io/react/)

### Electron - "Why Electron?"
My primary reason for deciding to do the project in Electron was because I wanted an isolated environment where I could use some of the lastest features of ES6 and not have to deal with legacy- and cross-browser comppatability issues. This would give me the opportunity of creating true app-like experience without those constraints.

### Node - "Why Node?"
Electrons uses Node to provide the toolset necessary to create a desktop application like that of traditional desktop applications. This means it provides access to the files system so you can save and load files, spin up servers, pretty much anything that you can do with Node.

I use the Node API in Twitch Exe to load and save data to and from files, and I'm spinning up a small server in order to interface with the Twitch API better.

### React - "Why React?"
This was my second encounter with React, and my first time building a full project using it. I knew this project would be my opportunity to learn it.

Once I started to learn and understand it I realized that this would be the tool for the job. I knew I needed a tool to build my interfaces programatically and that's was pretty much all I needed. Angular would have been the othe option but it would've been overkill in my opinion, and, honestly, I'm not a fan of it. All I needed was a way to programatically render my views and React does just that perfectly. I'm not even using jquery in this project. I require it but only for the Twitch SDK, which uses it.

***

## Code Design
I wouldn't say that I pursued any particular style of coding, but the closest that I got to here would be functional. I prefer to break my code operations into smaller functions. That's soemthing I did the more I wrote and I find that it made my code cleaner and more manageable.

***

# Thanks for viewing! :)
### Checkout my links below

[Twitter](http://twitter.com/PieceDigital) | [Github](piecedigital.github.io) | [LinkedIn](linkedin.com/in/pdstudios)