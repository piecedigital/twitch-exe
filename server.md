# Server

The purpose of server.js is so that the app can behave correctly with with Twitch API. Basically, in order for user authentication to work I need provide a valid URI and a small, simple server was the only way to achieve this. Electron would otherwise have a file URI which wont work with the Twitch API.