var ajax = function(optionsObj) {
  optionsObj = optionsObj || {};

  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function(data) {
  	if(httpRequest.readyState === 4) {
  		if(httpRequest.status < 400) {
        optionsObj.success(data);
  		} else {
        optionsObj.error(data);
      }
  	}
  }
  
  httpRequest.open((optionsObj.type || "GET"), optionsObj.url);
  httpRequest.send((optionsObj.data || null));
}


//////////////////////////////
// app ///////////////////////
//////////////////////////////
function getGames() {
  ajax({
    url: "https://api.twitch.tv/kraken/games/top",
    success: function(data) {
      console.log(JSON.parse(data.target.response));
      topGames(JSON.parse(data.target.response));
    },
    error: function(data) {
      console.log(data)
    }
  });
}
getGames();

function topGames(data) {
  var TopGames = React.createClass({
    displayName: "TopGames",

    render: function() {
      var allProps = this.props;
      return React.createElement(
        "div",
        { "className" : "game-item" },
        React.createElement(
          "h1",
          null,
          this.props.title
        ),
        React.createElement(
          "img",
          { "src" : this.props.src }
        ),
        React.createElement(
          "span",
          { "className" : "stats" },
          React.createElement(
            "span",
            null,
            this.props.viewers
          ),
          "/",
          React.createElement(
            "span",
            null,
            this.props.channels
          )
        )
      );
    }
  });

  data.top.map(function(item) {
    ReactDOM.render(React.createElement(TopGames, { "title" : item.game.name, "src" : item.game.box.small, "viewers" : item.viewers, "channels" : item.channels }), document.getElementById("online-streams"));
  });
}