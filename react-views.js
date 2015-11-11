//////////////////////////////
// app ///////////////////////
//////////////////////////////
var pageWrap = function(attrs, content) {
  var initAttrs = { "className" : "page-wrap-960" };

  for(var key in attrs) {
    initAttrs[key] = (initAttrs[key]) ? `${initAttrs[key]} ${attrs[key]}` : `${attrs[key]}`;
  };

  return React.createElement(
    "div",
    initAttrs,
    content
  );
};
var section = function(attrs, content) {
  return React.createElement(
    "section",
    attrs,
    content
  );
};

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

// view parent
var ViewParent = React.createClass({
  displayName: "ViewParent",

  getInitialState: function() {
    return { "page" : HomePage };
  },
  changeView: function(e) {
    this.setState({ "page" : e.target.attributes["data-page-link"].value});
  },
  changeView: function(e) {
    this.setState({ "page" : e.target.attributes["data-stream-link"].value});
  },
  render: function render() {
    return React.createElement(
      "div",
      { "id" : "view-page" },
      React.createElement(this.state.page)
    )
  }
});

// stream views
//////////////////////////////
var StreamViewer = React.createClass({
  displayName: "StreamViewer",

  render: function render() {
    return React.createElement(
    );
  }
});
// react views
//////////////////////////////
var HomePage = React.createClass({
  displayName: "HomePage",

  render: function render() {
    return React.createElement(
      "div",
      { "id" : "home-page" },
      section(
        { "className" : "off-black" },
        React.createElement(TopStreams)
      ),
      pageWrap(
        null,
        separator
      ),
      section(
        null,
        pageWrap(
          null,
          React.createElement(
            "h1",
            { className : "section-title" },
            "Top Games"
          )
        )
      ),
      section(
        null,
        React.createElement(TopGames)
      ),
      pageWrap(
        null,
        separator
      ),
      section(
        null,
        pageWrap(
          null,
          React.createElement(
            "h1",
            { className : "section-title" },
            "Featured Streams"
          )
        )
      ),
      section(
        null,
        React.createElement(FeaturedStreams)
      )
    );
  }
});
var StreamListPage = React.createClass({
  displayName: "StreamListPage",

  render: function render() {
    return React.createElement(
      "div",
      { "id" : "home-page" },
      "new page"
    );
  }
});

// page components
//////////////////////////////
/* home page */
var TopStreams = React.createClass({
  displayName: "TopStreams",

  getStreams: function() {
    // sets variable to access the class object
    var elemInstance = this;
    ajax({
      url: "https://api.twitch.tv/kraken/streams/featured?limit=6",
      success: function(data) {
        elemInstance.setState({streams: JSON.parse(data.target.response)});
        console.log("Top Streams", JSON.parse(data.target.response));
      },
      error: function(data) {
        console.log(data)
      }
    });
  },
  getInitialState: function() {
    return { "streams" : {}, "index" : 0 };
  },
  componentDidMount: function() {
    this.getStreams();
  },
  setStream: function(e) {
    //console.log(accessView.changeView());

    this.setState({ "index" : e.target.parentNode.attributes["data-item-index"].value });
    document.querySelector(".top-stream-item.selected").className = document.querySelector(".top-stream-item.selected").className.replace(/selected/gi, "");
    e.target.parentNode.className = e.target.parentNode.className + " selected";
  },
  render: function render() {
    if(!this.state.streams.featured) {
      return false;
    }
    // sets variable to access the class object
    var elemInstance = this;

    return pageWrap(
      { "className" : "" },
      React.createElement(
        "div",
        { "id" : "top-streams" },
        React.createElement(
          "div",
          { "className" : "top-streams-viewer" },
          React.createElement(
            "iframe",
            { "className" : "video", "src" : `${this.state.streams.featured[this.state.index].stream.channel.url}/embed`, "width" : "100%", "height" : "100%", "frameBorder" : "0" }
          )
        ),
        React.createElement(
          "div",
          { "className" : "top-streams-info" },
          React.createElement(
            "div",
            { "className" : "top-stream-channel" },
            React.createElement(
              "div",
              { "className" : "image-div" },
              React.createElement(
                "img",
                { "className" : "", "src" : this.state.streams.featured[this.state.index].stream.channel.logo }
              )
            ),
            React.createElement(
              "div",
              { "className" : "details-div" },
              React.createElement(              "span",
                { "className" : "" },
                `${this.state.streams.featured[this.state.index].stream.channel.display_name}`
              ),
              React.createElement(
                "br",
                null
              ),
              React.createElement(
                "span",
                null,
                `playing ${this.state.streams.featured[this.state.index].stream.game}`
              )
            )
          ),
          React.createElement(
            "h1",
            { "className" : "section-title" },
            this.state.streams.featured[this.state.index].title
          ),
          React.createElement(
            "p",
            null,
            this.state.streams.featured[this.state.index].text.replace(/<br>[\n]*.*/gi, "").replace(/<(\/)?p>/gi, ""),
            React.createElement(
              "br",
              null
            ),
            React.createElement(
              "br",
              null
            ),
            React.createElement(
              "a",
              { "href" : "#", "className" : "stream-link", "data-stream-link" : this.state.streams.featured[this.state.index].stream.channel.display_name, "onClick" : accessView.changeView },
              "watch this stream"
            )
          )
        ),
        React.createElement(
          "ul",
          { "id" : "top-streams-list", "className" : "" },
          this.state.streams.featured.map(function(item, ind) {
            return React.createElement(
              "li",
              { "key" : "top-stream-item" + ind, "className" : `${(ind === elemInstance.state.index) ? "selected" : ""} top-stream-item col-6-5-4-3-2-1`, "data-item-index" : ind },
              React.createElement(
                "img",
                { "src" : item.stream.preview.medium, "onClick" : elemInstance.setStream }
              )
            )
          })
        )
      )
    )
  }
});
var TopGames = React.createClass({
  displayName: "TopGames",

  getGames: function() {
    var elemInstance = this;
    ajax({
      url: "https://api.twitch.tv/kraken/games/top?limit=12",
      success: function(data) {
        elemInstance.setState({games: JSON.parse(data.target.response)});
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
    return pageWrap(
      null,
      React.createElement(
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
      )
    )
  }
});
var FeaturedStreams = React.createClass({
  displayName: "FeaturedStreams",

  getStreams: function() {
    var elemInstance = this;
    ajax({
      url: "https://api.twitch.tv/kraken/streams/featured?limit=6",
      success: function(data) {
        elemInstance.setState({streams: JSON.parse(data.target.response)});
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
    return pageWrap(
      null,
      React.createElement(
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
      )
    )
  }
});

var accessView = ReactDOM.render(React.createElement(ViewParent, null), document.getElementById("main-content"));