var clientId = "1xb1e12mtrfjt0r0p805cu00bu6x4xn";
Twitch.init({ "clientId" : clientId }, function(error, status) {
});
var twitchToken;
var concurrentData = {};
remote.require("./handle-con-data").loadConcurrentData(function(data) {
  concurrentData = JSON.parse(data);
});
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
        console.log("Streams", (JSON.parse(data)));
        JSON.parse(data)[(accessView.state.search) ? "streams" : "featured"].map(function(streamData) {
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
        console.log("Top Games", JSON.parse(data).top);
        JSON.parse(data).top.map(function(gameData) {
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
    } else {
      this.setState({});
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
    // event for following the current channel
    if(e.target.className.match(/^follow$/i)) {
      var streamer = e.target.attributes["data-streamer"].value

      ajax({
        url: `https://api.twitch.tv/kraken/users/${concurrentData.username.toLowerCase()}/follows/channels/${streamer}?notifications=true&oauth_token=${twitchToken}`,
        type: "PUT",
        success: function(data) {
          document.querySelector(".follow").addClass("hide");
          document.querySelector(".unfollow").removeClass("hide");
        },
        error: function(err) {
          console.log(`Status: ${err.status}`, `Message: ${err.message}`)
        }
      });
    } else
    // event for unfollowing the current channel
    if(e.target.className.match("unfollow")) {
      var streamer = e.target.attributes["data-streamer"].value

      ajax({
        url: `https://api.twitch.tv/kraken/users/${concurrentData.username.toLowerCase()}/follows/channels/${streamer}?notifications=true&oauth_token=${twitchToken}`,
        type: "DELETE",
        success: function(data) {
          document.querySelector(".unfollow").addClass("hide");
          document.querySelector(".follow").removeClass("hide");
        },
        error: function(err) {
          console.log(`Status: ${err.status}`, `Message: ${err.message}`)
        }
      });
    } else
    // default event for opening streams
    {
      var streamer = e.target.attributes["data-stream-link"].value;

      var videoSrc = `http://player.twitch.tv/?channel=${streamer}`;
      var chatSrc = `http://twitch.tv/${streamer}/chat`;
      var viewer = document.querySelector("#stream-viewer");
      document.querySelector(".follow").dataset.streamer = streamer;
      document.querySelector(".unfollow").dataset.streamer = streamer;

      ajax({
        url: `https://api.twitch.tv/kraken/users/${concurrentData.username.toLowerCase()}/follows/channels/${streamer}`,
        type: "GET",
        success: function(data) {
          document.querySelector(".follow").addClass("hide");
        },
        error: function(err) {
          document.querySelector(".unfollow").addClass("hide");            
          console.log(`Status: ${err.status}`, `Message: ${err.message}`)
        }
      });

      viewer.addClass("open");
      viewer.querySelector("#video-embed iframe").src = videoSrc;
      viewer.querySelector("#chat-embed iframe").src = chatSrc;
      document.body.style.overflow = "hidden";
    }
  },
  loginUser: function() {
    Twitch.login({
      scope: ["user_blocks_edit", "user_blocks_read", "user_follows_edit", "channel_read", "channel_editor", "channel_commercial", "channel_stream", "channel_subscriptions", "user_subscriptions", "channel_check_subscription", "chat_login"]
    });
  },
  render: function render() {
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
            ),
            React.createElement(
              "div",
              { "className" : "follow", "onClick" : this.viewStream },
              "Follow"
            ),
            React.createElement(
              "div",
              { "className" : "unfollow", "onClick" : this.viewStream },
              "Unfollow"
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
              "div",
              { "id" : "chat-cover", "onClick" : this.loginUser }
            ),
            React.createElement(
              "iframe",
              { "src" : "", "frameBorder" : "0" }
            )
          )
        )
      ),
      // render component for the options bar (top-right corner)
      React.createElement(OptionsBar, { "parentAPI" : this })
    )
  }
});

// options - nav, search, login/out
var OptionsBar = React.createClass({
  "displayName": "OptionsBar",

  componentDidMount: function() {
    console.log(this.props)

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
    /*Twitch.getStatus(function(err, status) {
      if(err) throw err;
      if(status.authenticated) {
        document.querySelector(".nav.log").addClass("hide");
        document.querySelector("#chat-cover").addClass("hide");
        twitchToken = Twitch.getToken();
      }
    });*/
    var eleminstance = twitchToken;
    remote.getCurrentWebContents().session.cookies.get({
      "name": "name"
    }, function(err, cookies) {
      //console.log(cookies);
      if(cookies.length > 0) {
        // if user is logged in, hide connect button
        document.querySelector(".nav.log").addClass("hide");
        document.querySelector("#chat-cover").addClass("hide");

        // set the token
        twitchToken = Twitch.getToken();
        // sets the current user name if it doesn't exist
        if(!concurrentData.username) {
          ajax({
            url: `https://api.twitch.tv/kraken/channel?oauth_token=${twitchToken}`,
            success: function(data) {
              data = JSON.parse(data);
              console.log(data);
              concurrentData.username = data.display_name;
              concurrentData.links = data._links;
              remote.require("./handle-con-data").saveConcurrentData(concurrentData);
            },
            error: function(data) {
              console.log(data)
            }
          });
        }
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
    var eleminstance = this;

    Twitch.logout(function() {
      remote.getCurrentWebContents().session.clearStorageData({
        storages: ["cookies"]
      }, function(err) {
        if(err) throw err;

        console.log("storage data cleared");
      });
      twitchToken = null;
      concurrentData.username = null;
      concurrentData.links = null;
      console.log("user logged out");
      var newHistory = eleminstance.props.parentAPI.state.history.filter(function(elem) {
        if( !elem.match(/AccountInfoPage/i) ) {
          return elem;
        }
      });
      eleminstance.props.parentAPI.setState({ "history" : newHistory });
    });
    Twitch.getStatus({ "force" : true }, function(err, status) {
      if(err) throw err;

      //console.log(status)
      if(status.authenticated) {
        document.querySelector(".nav.log").addClass("hide");
        document.querySelector("#chat-cover").addClass("hide");
      } else {
        document.querySelector(".nav.log").removeClass("hide");
        document.querySelector("#chat-cover").removeClass("hide");
      }
    });
  },
  render: function render() {
    var eleminstance = this;
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
        ),
        React.createElement(
          "span",
           { "data-page-link" : "AccountInfoPage", "onClick" : this.props.parentAPI.pingForData },
          "Account"
        )
      )
    )
  }
});
// react pages
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
var AccountInfoPage = React.createClass({
  displayName: "AccountInfoPage",

  render: function render() {
    return React.createElement(
      "div",
      { "id" : "account-page" },
      section(
        null,
        React.createElement(AccountPage)
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
        elemInstance.setState({streams: JSON.parse(data)});
        console.log("Top Streams", JSON.parse(data));
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
        elemInstance.setState({games: JSON.parse(data)});
        console.log("Top Games", JSON.parse(data));
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
        elemInstance.setState({streams: JSON.parse(data)});
        console.log("Top Streams", JSON.parse(data));
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

/* pages page */
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
/* streams page */
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
/* account page */
var AccountPage = React.createClass({
  "displayName": "StreamsPage",

  getInitialState: function() {
    return { "following" : [], "followingOffset" : 1, "followers" : [], "followersOffset" : 1 }
  },
  componentDidMount: function() {
    var eleminstance = this;

    // get list of streams the current user is following
    ajax({
      url: `https://api.twitch.tv/kraken/users/${concurrentData.username.toLowerCase()}/follows/channels`,
      success: function(data) {
        data = JSON.parse(data);

        // check the live status of each stream
        data.follows.map(function(elem) {
          ajax({
            url: `https://api.twitch.tv/kraken/streams/${elem.channel.name}`,
            success: function(dataToCheckLive) {
              dataToCheckLive = JSON.parse(dataToCheckLive)

              // sets a key value to online or offline, depending on the status of the stream
              elem.stream = dataToCheckLive.stream;

              // push the stream object to the array
              eleminstance.state.following.push(elem);

              // refresh the state-dependent components
              eleminstance.setState({});
            },
            error: function(err) {
              console.log(`Status: ${err.status}`, `Message: ${err.message}`)
            }
          });
        });
      },
      error: function(err) {
        console.log(`Status: ${err.status}`, `Message: ${err.message}`)
      }
    });

    // get list of user following the current user
    ajax({
      url: concurrentData.links.follows,
      success: function(data) {
        data = JSON.parse(data);
        data.follows.map(function(elem) {
          eleminstance.state.followers.push(elem);
        });
        eleminstance.setState({});
      },
      error: function(err) {
        console.log(`Status: ${err.status}`, `Message: ${err.message}`)
      }
    });
  },
  refreshStreams: function(e) {
    var eleminstance = this;

    if(e.target.attributes["data-section"].value === "following") {
      this.state.following.map(function(elem, ind) {
        ajax({
          url: `https://api.twitch.tv/kraken/streams/${elem.channel.name}`,
          success: function(dataToCheckLive) {
            dataToCheckLive = JSON.parse(dataToCheckLive)

            // sets a key value to online or offline, depending on the status of the stream
            eleminstance.state.following[ind].stream = dataToCheckLive.stream;
            // console.log(eleminstance.state.following[ind])

            // refresh the state-dependent components
            eleminstance.setState({ "following" : eleminstance.state.following });
          },
          error: function(err) {
            console.log(`Status: ${err.status}`, `Message: ${err.message}`)
          }
        });
      });
    }
  },
  render: function render() {
    var eleminstance = this;

    return pageWrapNormal(
      null,
      React.createElement(
        "div",
        { "id" : "top-streams" },
        // page title
        pageWrapNormal(
          null,
          React.createElement(
            "h1",
            { "className" : "section-title" },
            `Account Info of ${concurrentData.username}`
          )
        ),
        // separator
        pageWrapSmall(
          null,
          normalSeparator
        ),
        // section title
        pageWrapNormal(
          null,
          React.createElement(
            "div",
            null,
            React.createElement(
              "div",
              { "className" : "col-2 left-justify" },
              React.createElement(
                "h1",
                { "className" : "section-title" },
                `Streams you follow`
              )
            ),
            React.createElement(
              "div",
              { "className" : "col-2 right-justify" },
              React.createElement(
                "div",
                { "className" : "btn", "data-section" : "following", "onClick" : this.refreshStreams },
                `Refresh streams`
              )
            )
          )
        ),
        // section
        React.createElement(
          "ul",
          { "id" : "following-streams-list", "className" : "" },
          this.state.following.map(function(item, ind) {
            return React.createElement(
              "li",
              { "key" : "following-stream-item" + ind, "className" : "following-stream-item col-6-5-4-3-2-1", "data-stream-link" : item.channel.name, "onClick" : accessView.viewStream },
              React.createElement(
                "img",
                { "src" : item.channel.logo }
              ),
              React.createElement(
                "h1",
                { "className" : "title"},
                `${item.channel.display_name}`
              ),
              React.createElement(
                "span",
                { "className" : "stats" },
                React.createElement(
                  "span",
                  { "className" : `bold${(item.stream) ? " online" : " offline"} ` },
                  `${(item.stream) ? `Online playing ${item.channel.game}` : "Offline" }`
                )
              )
            )
          })
        ),
        // section manual pagination
        React.createElement(
          "div",
          { "className" : "right-justify" },
          React.createElement(
            "div",
            { "className" : "pointer link bold inline-block", "data-section" : "following", "onClick" : () => console.log("would load more followings") },
            "Load more streams"
          )
        ),
        // separator
        pageWrapSmall(
          null,
          normalSeparator
        ),
        // section title
        pageWrapNormal(
          null,
          React.createElement(
            "h1",
            { "className" : "section-title" },
            `Users that follow you`
          )
        ),
        // section
        React.createElement(
          "ul",
          { "id" : "followers-streams-list", "className" : "" },
          this.state.followers.map(function(item, ind) {
            return React.createElement(
              "li",
              { "key" : "followers-stream-item" + ind, "className" : "followers-stream-item col-6-5-4-3-2-1"/*, "data-stream-link" : (item.user.name), "onClick" : accessView.viewStream*/ },
              React.createElement(
                "img",
                { "src" : item.user.logo || "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png" }
              ),
              React.createElement(
                "h1",
                { "className" : "title"},
                `${item.user.display_name}`
              )
            )
          })
        ),
        // section manual pagination
        React.createElement(
          "div",
          { "className" : "right-justify" },
          React.createElement(
            "div",
            { "className" : "pointer link bold inline-block", "data-section" : "followers", "onClick" : () => console.log("would load more followers") },
            "Load more users"
          )
        )
      )
    )
  }
});

var accessView = ReactDOM.render(React.createElement(ViewParent, null), document.getElementById("main-content"));