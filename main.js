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

    render: function render() {
      return React.createElement(
        "ul",
        { "className" : "games-list" },
        this.props.data.top.map(function(item, ind) {
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

    ReactDOM.render(React.createElement(TopGames, { data : data }), document.getElementById("online-streams"));
}