//////////////////////////////
// app ///////////////////////
//////////////////////////////
var pageWrapSmall = function(attrs, content) {
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
var pageWrapNormal = function(attrs, content) {
  var initAttrs = { "className" : "page-wrap-1200" };

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

var normalSeparator = React.createElement(
  "span",
  { className : "normal-separator" },
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
    return { "streamer" : null, "search" : null, "history" : ["HomePage"] };
  },
  changeView: function(e) {
    var searchText = (typeof e === "string") ? { "value" : e } : e.target.attributes["data-search"];
    var searchPage = (typeof e === "string") ? "StreamsListPage" : e.target.attributes["data-page-link"].value;

    this.state.history.push(searchPage);

    this.setState({ "search" : ((searchText) ? searchText.value : null) });
  },
  changeViewPrev: function(e) {
    if(this.state.history.length > 1) {
      this.state.history.pop();
      this.setState({});
    }
  },
  getSearch: function() {
    return this.state.search;
  },
  viewStream: function(e) {
    // event for closing the viewer
    if(e.target.className.match("close")) {
      var viewer = document.querySelector("#stream-viewer");

      viewer.removeClass("open");
      viewer.querySelector("#video-embed iframe").src = "";
      viewer.querySelector("#chat-embed iframe").src = "";
      document.body.style.overflow = "";
    } else
    // event for changing the display of the viewer
    if(e.target.className.match("display")) {
      var viewer = document.querySelector("#stream-viewer");

      viewer.toggleClass("hide");
      if(document.body.style.overflow) {
        document.body.style.overflow = "";
      } else {
        document.body.style.overflow = "hidden";
      }
    } else
    // event for changing the display of the chat
    if(e.target.className.match("chat")) {
      var viewer = document.querySelector("#stream-viewer");

      viewer.toggleClass("hidden-chat");
    } else
    // default event for opening streams
    {
      var streamer = e.target.attributes["data-stream-link"].value;

      var videoSrc = `http://player.twitch.tv/?channel=${streamer}`;
      var chatSrc = `http://twitch.tv/${streamer}/chat`;
      var viewer = document.querySelector("#stream-viewer");

      viewer.addClass("open");
      viewer.querySelector("#video-embed iframe").src = videoSrc;
      viewer.querySelector("#chat-embed iframe").src = chatSrc;
      document.body.style.overflow = "hidden";
    }
  },
  render: function render() {
    console.log( this.state.history )
    return React.createElement(
      "div",
      { "id" : "view-parent" },
      React.createElement(window[this.state.history[this.state.history.length-1]]),
      React.createElement(
        "div",
        { "id" : "stream-viewer" },
        React.createElement(
          "div",
          { "id" : "embed-area"},
          React.createElement(
            "div",
            { "id" : "viewer-controls"},
            React.createElement(
              "div",
              { "className" : "close", "onClick" : this.viewStream }
            ),
            React.createElement(
              "div",
              { "className" : "display", "onClick" : this.viewStream }
            ),
            React.createElement(
              "div",
              { "className" : "chat", "onClick" : this.viewStream }
            )
          ),
          React.createElement(
            "div",
            { "id" : "video-embed"},
            React.createElement(
              "iframe",
              { "src" : "", "frameBorder" : "0" }
            )
          ),
          React.createElement(
            "div",
            { "id" : "chat-embed"},
            React.createElement(
              "iframe",
              { "src" : "", "frameBorder" : "0" }
            )
          )
        )
      ),
      React.createElement(OptionsBar)
    )
  }
});

// options - nav, search, login/out
var OptionsBar = React.createClass({
  "displayName": "OptionsBar",

  componentDidMount: function() {
    document.querySelector(".nav.search").addEventListener("submit", function(e) {
      e.preventDefault();
      accessView.changeView(e.target[0].value)
    });
    document.querySelector(".nav.prev").addEventListener("click", function() {
      console.log("clicked prev")
      accessView.changeViewPrev()
    });
  },
  render: function render() {
    return React.createElement(
      "div",
      { "id" : "options-bar"},
      React.createElement(
        "div",
        { "className" : "nav prev" }
      ),
      React.createElement(
        "form",
        { "className" : "nav search" },
        React.createElement(
          "input",
          { "type" : "text", "name" : "search", "min" : "1", "placeholder" : "Search..." }
        ),
        React.createElement(
          "input",
          { "type" : "submit", "value" : "GO" }
        )
      ),
      React.createElement(
        "div",
        { "className" : "nav log"},
        "Log"
      )
    )
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
      pageWrapSmall(
        null,
        normalSeparator
      ),
      section(
        null,
        pageWrapSmall(
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
      pageWrapSmall(
        null,
        normalSeparator
      ),
      section(
        null,
        pageWrapSmall(
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
var GamesListPage = React.createClass({
  displayName: "GamesListPage",

  render: function render() {
    return React.createElement(
      "div",
      { "id" : "games-list-page" },
      section(
        null,
        React.createElement(GamesPage)
      )
    );
  }
});
var StreamsListPage = React.createClass({
  displayName: "StreamsListPage",

  render: function render() {
    return React.createElement(
      "div",
      { "id" : "streams-page" },
      section(
        null,
        React.createElement(StreamsPage)
      )
    )
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
    if(!e.target.parentNode.className.match(/selected/gi)) {
      this.setState({ "index" : e.target.parentNode.attributes["data-item-index"].value });
      document.querySelector(".top-stream-item.selected").removeClass("selected");
      e.target.parentNode.addClass("selected");
    }
  },
  render: function render() {
    if(!this.state.streams.featured) {
      return false;
    }
    // sets variable to access the class object
    var elemInstance = this;

    return pageWrapSmall(
      { "className" : "" },
      React.createElement(
        "div",
        { "id" : "top-streams", "className" : "right-justify" },
        React.createElement(
          "div",
          { "className" : "top-streams-viewer" },
          React.createElement(
            "iframe",
            { "className" : "video", "src" : `http://player.twitch.tv?channel=${this.state.streams.featured[this.state.index].stream.channel.name}`, "width" : "100%", "height" : "100%", "frameBorder" : "0" }
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
              { "href" : "#", "className" : "stream-link", "data-stream-link" : this.state.streams.featured[this.state.index].stream.channel.name, "onClick" : accessView.viewStream },
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
    return pageWrapSmall(
      null,
      React.createElement(
        "div",
        { "id" : "top-games" },
        React.createElement(
          "ul",
          { "id" : "games-list", "className" : "" },
          this.state.games.top.map(function(item, ind) {
            return React.createElement(
              "li",
              { "key" : "game-item" + ind, "className" : "game-item col-6-5-4-3-2-1", "data-page-link" : "StreamsListPage", "data-search": item.game.name, "onClick" : accessView.changeView },
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
        ),
        React.createElement(
          "div",
          { "className" : "right-justify" },
          React.createElement(
            "div",
            { "className" : "pointer link bold inline-block", "data-page-link" : "GamesListPage", "onClick" : accessView.changeView },
            "View all games"
          )
        )
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
    return pageWrapSmall(
      null,
      React.createElement(
        "div",
        { "id" : "featured-streams" },
        React.createElement(
          "ul",
          { "id" : "featured-streams-list", "className" : "" },
          this.state.streams.featured.map(function(item, ind) {
            return React.createElement(
              "li",
              { "key" : "featured-stream-item" + ind, "className" : "featured-stream-item col-3-2-1", "data-stream-link" : item.stream.channel.name, "onClick" : accessView.viewStream },
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
                  `${item.stream.viewers} viewers on `,
                  React.createElement(
                    "span",
                    { "className" : "bold" },
                    `${item.stream.channel.display_name}`
                  )
                )
              )
            )
          })
        ),
        React.createElement(
          "div",
          { "className" : "right-justify" },
          React.createElement(
            "div",
            { "className" : "pointer link bold inline-block", "data-page-link" : "StreamsListPage", "onClick" : accessView.changeView },
            "View all streams"
          )
        )
      )
    )
  }
});

/* streams page */
var GamesPage = React.createClass({
  displayName: "TopGames",

  getGames: function() {
    var elemInstance = this;
    ajax({
      url: `https://api.twitch.tv/kraken/games/top?limit=${elemInstance.state.limit}&offset=${elemInstance.state.limit * elemInstance.state.offset}`,
      success: function(data) {
        console.log("Top Games", JSON.parse(data.target.response).top);
        JSON.parse(data.target.response).top.map(function(gameData) {
          elemInstance.state.games.push(gameData);
        });

        elemInstance.setState({ "offset" : elemInstance.state.offset+1 });
      },
      error: function(data) {
        console.log(data)
      }
    });
  },
  getInitialState: function() {
    return { games : [], "limit" : 6*5, "offset" : 0 };
  },
  componentDidMount: function() {
    this.getGames();
  },
  componentWillUpdate: function(nextProps, nextState) {
    //console.log(nextState)
  },
  render: function render() {
    if(!this.state.games) {
      return false;
    }
    return pageWrapSmall(
      null,
      React.createElement(
        "div",
        { "id" : "top-games" },
        React.createElement(
          "ul",
          { "id" : "games-list", "className" : "" },
          this.state.games.map(function(item, ind) {
            return React.createElement(
              "li",
              { "key" : "game-item" + ind, "className" : "game-item col-6-5-4-3-2-1", "data-page-link" : "StreamsListPage", "data-search": item.game.name, "onClick" : accessView.changeView },
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
        ),
        React.createElement(
          "div",
          { "className" : "right-justify" },
          React.createElement(
            "div",
            { "className" : "pointer link bold inline-block", "onClick" : this.getGames },
            "Load more games"
          )
        )
      )
    )
  }
});
var StreamsPage = React.createClass({
  "displayName": "StreamsPage",

  getStreams: function() {
    // sets variable to access the class object
    var elemInstance = this;
    this.search = accessView.getSearch();

    var url = (this.search) ? `https://api.twitch.tv/kraken/search/streams?limit=${this.state.limit}&offset=${this.state.limit * this.state.offset}&q=${this.search.toLowerCase()}` : `https://api.twitch.tv/kraken/streams/featured?limit=${this.state.limit}&offset=${this.state.limit * this.state.offset}`;

    ajax({
      url: url,
      success: function(data) {
        console.log("Streams", (JSON.parse(data.target.response)));
        JSON.parse(data.target.response)[(elemInstance.search) ? "streams" : "featured"].map(function(streamData) {
          elemInstance.state.streams.push(streamData);
        });

        elemInstance.setState({ "offset" : elemInstance.state.offset+1 });
      },
      error: function(data) {
        console.log(data)
      }
    });
  },
  getInitialState: function() {
    return { "streams" : [], "limit" : 5*5, "offset" : 0 };
  },
  componentDidMount: function() {
    this.getStreams();
  },

  render: function render() {
    if(!this.state.streams) {
      return false;
    }
    var elemInstance = this;
    console.log(this.state)
    return pageWrapNormal(
      null,
      React.createElement(
        "div",
        { "id" : "top-streams" },
        pageWrapNormal(
          null,
          React.createElement(
            "h1",
            { "className" : "section-title" },
            `Live Streams ${(this.search) ? `for ${this.search}` : ""}`
          )
        ),
        React.createElement(
          "ul",
          { "id" : "featured-streams-list", "className" : "" },
          this.state.streams.map(function(item, ind) {
            return React.createElement(
              "li",
              { "key" : "featured-stream-item" + ind, "className" : "featured-stream-item col-5-4-3-2-1", "data-stream-link" : ((!elemInstance.search) ? item.stream.channel.name : item.channel.name), "onClick" : accessView.viewStream },
              React.createElement(
                "img",
                { "src" : ((!elemInstance.search) ? item.stream.preview.large : item.preview.large) }
              ),
              React.createElement(
                "h1",
                { "className" : "title"},
                `${((!elemInstance.search) ? item.title : item.channel.status)}`
              ),
              React.createElement(
                "span",
                { "className" : "stats" },
                React.createElement(
                  "span",
                  null,
                  `${((!elemInstance.search) ? item.stream.viewers : item.viewers)} viewers on `,
                  React.createElement(
                    "span",
                    { "className" : "bold" },
                    `${((!elemInstance.search) ? item.stream.channel.name : item.channel.display_name)}`
                  )
                )
              )
            )
          })
        ),
        React.createElement(
          "div",
          { "className" : "right-justify" },
          React.createElement(
            "div",
            { "className" : "pointer link bold inline-block", "onClick" : this.getStreams },
            "Load more streams"
          )
        )
      )
    )
  }
});

var accessView = ReactDOM.render(React.createElement(ViewParent, null), document.getElementById("main-content"));