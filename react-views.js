Twitch.init({clientId: '1xb1e12mtrfjt0r0p805cu00bu6x4xn'}, function(error, status) {
});
var twitchToken;
//////////////////////////////
// app ///////////////////////
//////////////////////////////

// page wrap and section element components
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
// renders every part of the app
var ViewParent = React.createClass({
  displayName: "ViewParent",

  getInitialState: function() {
    return { "streamer" : null, "search" : null, "history" : ["HomePage"], "searchResults" : [], "limit" : 6*4, "offset" : 0 };
  },
  // go back in history
  changeViewPrev: function(e) {
    if(this.state.history.length > 1) {
      this.state.history.pop();
      this.setState({});
    }
  },
  // ajax for streams data and update the requestResults in the state
  searchForStreamData: function(offset) {
    // sets variable to access the class object
    var elemInstance = this;
    console.log(this.state.search)
    var url = (this.state.search) ? `https://api.twitch.tv/kraken/search/streams?limit=${this.state.limit}&offset=${this.state.limit * this.state.offset}&q=${this.state.search.toLowerCase()}` : `https://api.twitch.tv/kraken/streams/featured?limit=${this.state.limit}&offset=${this.state.limit * this.state.offset}`;

    ajax({
      url: url,
      success: function(data) {
        console.log("Streams", (JSON.parse(data.target.response)));
        JSON.parse(data.target.response)[(accessView.state.search) ? "streams" : "featured"].map(function(streamData) {
          elemInstance.state.searchResults.push(streamData);
        });

        elemInstance.setState({ "offset" : (offset || elemInstance.state.offset+1) });
      },
      error: function(data) {
        console.log(data)
      }
    });
  },
  // ajax for games data and update the requestResults in the state
  searchForGameData: function(offset) {
    var elemInstance = this;
    ajax({
      url: `https://api.twitch.tv/kraken/games/top?limit=${elemInstance.state.limit}&offset=${elemInstance.state.limit * elemInstance.state.offset}`,
      success: function(data) {
        console.log("Top Games", JSON.parse(data.target.response).top);
        JSON.parse(data.target.response).top.map(function(gameData) {
          elemInstance.state.searchResults.push(gameData);
        });

        elemInstance.setState({ "offset" : elemInstance.state.offset+1 });
      },
      error: function(data) {
        console.log(data)
      }
    });
  },
  // search function for feeding data to "searchForStreamData" and "searchForGameData"
  pingForData: function(e) {
    console.log(this.state)
    var searchText = (e.target.attributes["data-search"]) ? e.target.attributes["data-search"].value : null;
    var searchPage = e.target.attributes["data-page-link"].value;

    
    if(this.state.history[this.state.history.length-1] !== searchPage) {
      this.state.history.push(searchPage);
    }
    this.state.search = searchText || null;
    this.state.searchResults = [];
    this.state.offset = 0;

    if(searchPage === "StreamsListPage") {
      this.searchForStreamData()
    }
    if(searchPage === "GamesListPage") {
      this.searchForGameData()
    }
  },
  // opens up the stream viewer
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

      viewer.toggleClass("shrink");
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
      // render component for the main section of the page
      React.createElement(window[this.state.history[this.state.history.length-1]]),
      // render component for the stream viewer (top-left corner)
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
      // render component for the options bar (top-right corner)
      React.createElement(OptionsBar)
    )
  }
});

// options - nav, search, login/out
var OptionsBar = React.createClass({
  "displayName": "OptionsBar",

  componentDidMount: function() {
    // eleminstance in any declaration is so that scoped variables still have access to "this"
    var elemInstance = this;

    // event listeners for option elements
    document.querySelector(".nav.search").addEventListener("submit", function(e) {
      e.preventDefault();
      accessView.pingForData({
        "target": {
          "attributes": {
            "data-search": {
              "value": e.target[0].value
            },
            "data-page-link": {
              "value": "StreamsListPage"
            }
          }
        }
      });
    });

    // click event for back navigation
    document.querySelector(".nav.prev").addEventListener("click", function() {
      accessView.changeViewPrev()
    });

    // check for user login data
    remote.getCurrentWebContents().session.cookies.get({
      "name": "name"
    }, function(err, cookies) {
      console.log(cookies);
      if(cookies.length > 0) {
        // if user is logged in, hide connect button
        document.querySelector(".nav.log").addClass("hide");
        twitchToken = Twitch.getToken();
      }
    });
  },
  // function to log the user in
  loginUser: function(e) {
    Twitch.login({
      scope: ["user_blocks_edit", "user_blocks_read", "user_follows_edit", "channel_read", "channel_editor", "channel_commercial", "channel_stream", "channel_subscriptions", "user_subscriptions", "channel_check_subscription", "chat_login"]
    });
  },
  // function to log the user out
  logoutUser: function() {
    Twitch.logout(function() {
      remote.getCurrentWebContents().session.clearStorageData({
        storages: ["cookies"]
      }, function(err) {
        if(err) throw err;

        console.log("storage data cleared")
      });
      console.log("user logged out");
    });
    Twitch.getStatus({ "force" : true }, function(err, status) {
      if(err) throw err;

      //console.log(status)
      if(status.authenticated) {
        document.querySelector(".nav.log").addClass("hide");
      } else {
        document.querySelector(".nav.log").removeClass("hide");
      }
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
        { "className" : "nav log"
        },
        React.createElement(
          "img",
          { "src" : "http://ttv-api.s3.amazonaws.com/assets/connect_dark.png", "className" : "twitch-connect", href : "#", "onClick" : this.loginUser }
        ),
        React.createElement(
          "span",
           { "onClick" : this.logoutUser },
          "Logout"
        )
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
              { "key" : "game-item" + ind, "className" : "game-item col-6-5-4-3-2-1", "data-page-link" : "StreamsListPage", "data-search": item.game.name, "onClick" : accessView.pingForData },
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
            { "className" : "pointer link bold inline-block", "data-page-link" : "GamesListPage", "onClick" : accessView.pingForData },
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
            { "className" : "pointer link bold inline-block", "data-page-link" : "StreamsListPage", "onClick" : accessView.pingForData },
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

  render: function render() {
    return pageWrapSmall(
      null,
      React.createElement(
        "div",
        { "id" : "top-games" },
        React.createElement(
          "ul",
          { "id" : "games-list", "className" : "" },
          accessView.state.searchResults.map(function(item, ind) {
            return React.createElement(
              "li",
              { "key" : "game-item" + ind, "className" : "game-item col-6-5-4-3-2-1", "data-page-link" : "StreamsListPage", "data-search": item.game.name, "onClick" : accessView.pingForData },
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
            { "className" : "pointer link bold inline-block", "onClick" : accessView.searchForGameData },
            "Load more games"
          )
        )
      )
    )
  }
});
var StreamsPage = React.createClass({
  "displayName": "StreamsPage",

  render: function render() {
    var elemInstance = this;
    console.log(accessView.state.searchResults)
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
            `Live Streams ${(accessView.state.search) ? `for "${accessView.state.search}"` : ""}`
          )
        ),
        React.createElement(
          "ul",
          { "id" : "featured-streams-list", "className" : "" },
          accessView.state.searchResults.map(function(item, ind) {
            return React.createElement(
              "li",
              { "key" : "featured-stream-item" + ind, "className" : "featured-stream-item col-6-5-4-3-2-1", "data-stream-link" : ((!accessView.state.search) ? item.stream.channel.name : item.channel.name), "onClick" : accessView.viewStream },
              React.createElement(
                "img",
                { "src" : ((!accessView.state.search) ? item.stream.preview.large : item.preview.large) }
              ),
              React.createElement(
                "h1",
                { "className" : "title"},
                `${((!accessView.state.search) ? item.title : item.channel.status)}`
              ),
              React.createElement(
                "span",
                { "className" : "stats" },
                React.createElement(
                  "span",
                  null,
                  `${((!accessView.state.search) ? item.stream.viewers : item.viewers)} viewers on `,
                  React.createElement(
                    "span",
                    { "className" : "bold" },
                    `${((!accessView.state.search) ? item.stream.channel.name : item.channel.display_name)}`
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
            { "className" : "pointer link bold inline-block", "onClick" : accessView.searchForStreamData },
            "Load more streams"
          )
        )
      )
    )
  }
});

var accessView = ReactDOM.render(React.createElement(ViewParent, null), document.getElementById("main-content"));