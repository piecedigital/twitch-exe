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
);
var smallSeparator = React.createElement(
  "span",
  { className : "small-separator" },
  React.createElement(
    "span",
    null
  )
);
var HomePage = React.createClass({
  displayName: "HomePage",

  render: function render() {
    return React.createElement(
      "div",
      { "id" : "front-page" },
      React.createElement(
        "h1",
        { className : "section-title" },
        "Top Streams"
      ),
      React.createElement(TopStreams),
      separator,
      React.createElement(
        "h1",
        { className : "section-title" },
        "Top Games"
      ),
      React.createElement(TopGames),
      separator,
      React.createElement(
        "h1",
        { className : "section-title" },
        "Featured Streams"
      ),
      React.createElement(FeaturedStreams)
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
    return { "streams" : {}, "index" : 1 };
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
      "div",
      { "id" : "top-streams" },
      React.createElement(
        "div",
        { "className" : "top-streams-viewer" },
        React.createElement(
          "iframe",
          { "className" : "video", "src" : `${this.state.streams.featured[this.state.index].stream.channel.url}/embed`, "width" : "100%", "height" : "100%" }
        )
      ),
      React.createElement(
        "div",
        { "className" : "top-streams-info" },
        React.createElement(
          "div",
          { "className" : "top-stream-channel" },
          React.createElement(
            "img",
            { "className" : "", "src" : this.state.streams.featured[this.state.index].stream.channel.logo }
          ),
          React.createElement(
            "span",
            { "className" : "" },
            `${this.state.streams.featured[this.state.index].stream.channel.display_name}<br>playing ${this.state.streams.featured[this.state.index].stream.game}`
          )
        ),
        React.createElement(
          "h1",
          { "className" : "section-title" },
          this.state.streams.featured[this.state.index].title
        ),
        this.state.streams.featured[this.state.index].text
      ),
      React.createElement(
        "ul",
        { "id" : "top-streams-list", "className" : "" },
        this.state.streams.featured.map(function(item, ind) {
          return React.createElement(
            "li",
            { "key" : "top-stream-item" + ind, "className" : "top-stream-item col-6-5-4-3-2-1" },
            React.createElement(
              "img",
              { "src" : item.stream.preview.medium }
            )
          )
        })
      )
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
      { "id" : "games-list", "className" : "" },
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
var FeaturedStreams = React.createClass({
  displayName: "FeaturedStreams",

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
      { "id" : "featured-streams-list", "className" : "" },
      this.state.streams.featured.map(function(item, ind) {
        return React.createElement(
          "li",
          { "key" : "featured-stream-item" + ind, "className" : "featured-stream-item col-3-2-1" },
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