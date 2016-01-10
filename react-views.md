# React Views

This is where the magic happens. This is where the entire enterface is created and changed. I'm using React to programatically generate the user interface for all of the current views.

There are various React classes for which I contain my view components:
* pageWrapSmall - This class creates an element with a max width of 960px
* pageWrapNormal - This class creates an element with a max width of 1200px
* section - This creates a `<section>` element
* normalSeparator - This creates an element separator that gives itself plenty of space
* smallSeparator - This creates an element separator that gives itself minimal space
* ViewParent - This is the main parent of all of the components. This handles the components for the main content, the options bar, and the stream viewer
* OptionsBar - This component has the UI for the available options: back navigation, search, login/logout, and account

These are the various pages:
* HomePage, GamesListPage, StreamsListPagem, AccountInfoPage - Handles the `HomePage`/`GamesPage`/`StreamsPage`/`AccountPage` component 

... and their components with the actual view content:
* TopStreams, TopGames, FeaturedStreams - These emulate the home page of the Twitch.tv website
* GamesPage - This pages lists the top games from clicking on "view all games" button on the `HomePage`
* StreamsPage - This pages lists the results of a game search from clicking on a game listed on the `HomePage` or `GamesPage` view
* AccountPage - this page lists the followed and following channels of the currently logged in user

## "Why the third degree of separation?"
I have `HomePage`/`GamesPage`/`StreamsPage`/`AccountPage` loading other components so that I can access the methods on `ViewParent` directly from the child components. A child component cannot directly access the methods of it's parent, but a grandchild can a access the methods of its grandparent if I assign the data returned from the `ReactDOM` function to a variable. E.g., `var accessView = ReactDOM.render(React.createElement(ViewParent, null), document.getElementById("main-content"));`

Now the grandchild components can acces `ViewParent` from the variable `accessView`. It may not be the best way to do this but it was the first way I discovered to circumvent this parent-child access limitation. I also prefer this clarity over chaining the object reference to the child components, from `ViewParent`, to then be accessed via `this.props`.