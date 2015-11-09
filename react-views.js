//////////////////////////////
// app ///////////////////////
//////////////////////////////
var separator = React.createElement(
  "span",
  { className : "separator" },
  React.createElement(
    "span",
    null
  )
)
var smallSeparator = React.createElement(
  "span",
  { className : "small-separator" },
  React.createElement(
    "span",
    null
  )
)
var HomePage = React.createClass({
  displayName: "HomePage",

  render: function render() {
    return React.createElement(
      "div",
      { "id" : "front-page" },
      React.createElement(
        "h1",
        { className : "unset section-title x-pad-1_0" },
        "Top Games"
      ),
      React.createElement(TopGames),
      separator,
      React.createElement(
        "h1",
        { className : "unset section-title x-pad-1_0" },
        "Top Streams"
      ),
      React.createElement(TopStreams)
    );
  }
});

var TopGames = React.createClass({
  displayName: "TopGames",

  getGames: function() {
    var classInstance = this;
    ajax({
      url: "https://api.twitch.tv/kraken/games/top?limit=12",
      success: function(data) {
        classInstance.setState({games: JSON.parse(data.target.response)});
        console.log("Top Games", JSON.parse(data.target.response));
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
    //console.log(nextState)
  },
  render: function render() {
    if(!this.state.games.top) {
      return false;
    }
    return React.createElement(
      "ul",
      { "id" : "games-list", "className" : "unset x-pad-1_0 center-justify" },
      this.state.games.top.map(function(item, ind) {
        return React.createElement(
          "li",
          { "key" : "game-item" + ind, "className" : "game-item col-6-5-4-3-2-1" },
          React.createElement(
            "img",
            { "src" : item.game.box.large }
          ),
          React.createElement(
            "h1",
            { "className" : "title" },
            `${item.game.name}`
          ),
          React.createElement(
            "span",
            { "className" : "stats" },
            React.createElement(
              "span",
              null,
              `Viewers: ${item.viewers}`
            ),
            smallSeparator,
            React.createElement(
              "span",
              null,
              `Channels: ${item.channels}`
            )
          )
        )
      })
    );
  }
});
var TopStreams = React.createClass({
  displayName: "TopStreams",

  getStreams: function() {
    var classInstance = this;
    ajax({
      url: "https://api.twitch.tv/kraken/streams/featured?limit=6",
      success: function(data) {
        classInstance.setState({streams: JSON.parse(data.target.response)});
        console.log("Top Streams", JSON.parse(data.target.response));
      },
      error: function(data) {
        console.log(data)
      }
    });
  },
  getInitialState: function() {
    return { streams : {} };
  },
  componentDidMount: function() {
    this.getStreams();
  },
  componentWillUpdate: function(nextProps, nextState) {
    //console.log(nextState)
  },
  render: function render() {
    if(!this.state.streams.featured) {
      return false;
    }
    return React.createElement(
      "ul",
      { "id" : "streams-list", "className" : "unset x-pad-1_0" },
      this.state.streams.featured.map(function(item, ind) {
        return React.createElement(
          "li",
          { "key" : "stream-item" + ind, "className" : "stream-item inline-block col-3-2-1" },
          React.createElement(
            "img",
            { "src" : item.stream.preview.large }
          ),
          React.createElement(
            "h1",
            { "className" : "title"},
            `${item.title}`
          ),
          React.createElement(
            "span",
            { "className" : "stats" },
            React.createElement(
              "span",
              null,
              `${item.stream.viewers} viewers on ${item.stream.channel.display_name}`
            )
          )
        )
      })
    );
  }
});

ReactDOM.render(React.createElement(HomePage, null), document.getElementById("main-content"));