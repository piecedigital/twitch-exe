//////////////////////////////
// app ///////////////////////
//////////////////////////////
function topGames() {
  var TopGames = React.createClass({
    displayName: "TopGames",

    getGames: function() {
      var classInstance = this;
      ajax({
        url: "https://api.twitch.tv/kraken/games/top",
        success: function(data) {
          classInstance.setState({games: JSON.parse(data.target.response)});
          console.log(JSON.parse(data.target.response));
          console.log(classInstance)
        },
        error: function(data) {
          console.log(data)
        }
      });
    },
    getInitialState: function() {
      return { games : {} };
    },
    componentDidMount: function() {
      this.getGames();
    },
    componentWillUpdate: function(nextProps, nextState) {
      console.log(nextState)
    },
    render: function render() {
      if(!this.state.games.top) {
        return false;
      }
      return React.createElement(
        "ul",
        { "className" : "games-list" },
        this.state.games.top.map(function(item, ind) {
          return React.createElement(
            "li",
            { "key" : item + ind, "className" : "game-item" },
            React.createElement(
              "h1",
              null,
              item.game.title
            ),
            React.createElement(
              "img",
              { "src" : item.game.box.small }
            ),
            React.createElement(
              "span",
              { "className" : "stats" },
              React.createElement(
                "span",
                null,
                item.viewers
              ),
              "/",
              React.createElement(
                "span",
                null,
                item.channels
              )
            )
          )
        })
      );
    }
  });

  ReactDOM.render(React.createElement(TopGames, null), document.getElementById("online-streams"));
}
topGames();