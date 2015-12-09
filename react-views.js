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
    return { "streamers" : [], "streamerInView" : 0, "hoveredStreamer" : null, "historyPoint" : 0, "history" : [{ page : "HomePage", search : "" }], "streamSearchResults" : [], "channelSearchResults" : [], "limit" : 6*4, "streamOffset" : 0, "channelOffset" : 0, "gameOffset" : 0 };
  },
  // go back in history
  changeViewPrev: function(e) {
    if(this.state.history.length > 1) {
      this.state.history.pop();
      var historyPoint = this.state.history[this.state.history.length-1];

      this.state.streamSearchResults = [];
      this.state.channelSearchResults = [];
      this.state.streamOffset = 0;
      this.state.channelOffset = 0;
      this.state.gameOffset = 0;

      if(historyPoint.page === "StreamsListPage") {
        this.searchForStreamData();
        this.searchForChannelData();
      }
      if(historyPoint.page === "GamesListPage") {
        this.searchForGameData();
      } else {
        this.setState({});
      }
    }
  },
  // ajax for streams data and update the requestResults in the state
  searchForStreamData: function(offset) {
    // sets variable to access the class object
    var elemInstance = this;
    var historyPoint = this.state.history[this.state.history.length-1];

    var url = (historyPoint.search) ? `https://api.twitch.tv/kraken/search/streams?limit=${this.state.limit}&offset=${this.state.limit * this.state.streamOffset}&q=${historyPoint.search.toLowerCase()}` : `https://api.twitch.tv/kraken/streams/featured?limit=${this.state.limit}&offset=${this.state.limit * this.state.streamOffset}`;

    ajax({
      url: url,
      success: function(data) {
        //console.log("Streams", (JSON.parse(data)));
        JSON.parse(data).streams.map(function(streamData) {
          elemInstance.state.streamSearchResults.push(streamData);
        });

        elemInstance.setState({ "streamOffset" : (offset || elemInstance.state.streamOffset+1), search : "" });
      },
      error: function(data) {
        //console.log(data)
      }
    });
  },
  searchForChannelData: function(offset) {
    // sets variable to access the class object
    var elemInstance = this;
    var historyPoint = this.state.history[this.state.history.length-1];

    var url = (historyPoint.search) ? `https://api.twitch.tv/kraken/search/channels?limit=${this.state.limit}&offset=${this.state.limit * this.state.channelOffset}&q=${historyPoint.search.toLowerCase()}` : `https://api.twitch.tv/kraken/channels/featured?limit=${this.state.limit}&offset=${this.state.limit * this.state.channelOffset}`;

    ajax({
      url: url,
      success: function(data) {
        //console.log("Channels", (JSON.parse(data)));
        JSON.parse(data).channels.map(function(channelData) {
          elemInstance.state.channelSearchResults.push(channelData);
        });

        elemInstance.setState({ "channelOffset" : (offset || elemInstance.state.channelOffset+1), search : "" });
      },
      error: function(data) {
        //console.log(data)
      }
    });
  },
  // ajax for games data and update the requestResults in the state
  searchForGameData: function(offset) {
    var elemInstance = this;
    ajax({
      url: `https://api.twitch.tv/kraken/games/top?limit=${elemInstance.state.limit}&offset=${elemInstance.state.limit * elemInstance.state.gameOffset}`,
      success: function(data) {
        //console.log("Top Games", JSON.parse(data).top);
        JSON.parse(data).top.map(function(gameData) {
          elemInstance.state.streamSearchResults.push(gameData);
        });

        elemInstance.setState({ "gameOffset" : elemInstance.state.gameOffset+1, search : "" });
      },
      error: function(data) {
        //console.log(data)
      }
    });
  },
  // search function for feeding data to "searchForStreamData" and "searchForGameData"
  pingForData: function(e) {
    //console.log(this.state)
    var historyPoint = this.state.history[this.state.history.length-1];
    var searchText = (e) ? ( (e.target.attributes["data-search"]) ? e.target.attributes["data-search"].value : historyPoint.search ) : historyPoint.search;
    console.log(searchText)
    var searchPage = (e) ? e.target.attributes["data-page-link"].value : historyPoint.page;

    if(historyPoint !== searchPage) {
      this.state.history.push({ page : searchPage, search : searchText });
    }
    historyPoint.search = searchText || historyPoint.search;
    this.state.streamSearchResults = [];
    this.state.channelSearchResults = [];
    this.state.streamOffset = 0;
    this.state.channelOffset = 0;
    this.state.gameOffset = 0;

    if(historyPoint.page === "StreamsListPage") {
      this.searchForStreamData();
      if(this.state.search) {
        this.searchForChannelData();
      }
    }
    if(historyPoint.page === "GamesListPage") {
      this.searchForGameData();
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
      //viewer.querySelector("#video-embed iframe").src = "";
      //viewer.querySelector("#embed-area iframe").src = "";
      document.body.style.overflow = "";
      this.setState({ "streamers" : [] })
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
          //console.log(`Status: ${err.status}`, `Message: ${err.message}`)
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
          //console.log(`Status: ${err.status}`, `Message: ${err.message}`)
        }
      });
    } else
    // default event for opening streams
    {
      var streamer = e.target.attributes["data-stream-link"].value;
      this.state.streamers = [streamer];
      this.setState({ "streamerInView" : 0 });
      //var videoSrc = `http://player.twitch.tv/?channel=${streamer}`;
      //var chatSrc = `http://twitch.tv/${streamer}/chat`;
      var viewer = document.querySelector("#stream-viewer");
      //document.querySelector(".follow").dataset.streamer = streamer;
      //document.querySelector(".unfollow").dataset.streamer = streamer;

      ajax({
        url: `https://api.twitch.tv/kraken/users/${concurrentData.username.toLowerCase()}/follows/channels/${streamer}`,
        type: "GET",
        success: function(data) {
          document.querySelector(".follow").addClass("hide");
          document.querySelector(".unfollow").removeClass("hide");
        },
        error: function(err) {
          document.querySelector(".follow").removeClass("hide");
          document.querySelector(".unfollow").addClass("hide");
          //console.log(`Status: ${err.status}`, `Message: ${err.message}`)
        }
      });

      viewer.addClass("open").removeClass("shrink");
      //viewer.querySelector("#video-embed iframe").src = videoSrc;
      //viewer.querySelector("#chat-embed iframe").src = chatSrc;
      document.body.style.overflow = "hidden";
    }
  },
  toggleChat: function(e) {
    var newStreamerInView = e.target.attributes["data-chat"].value;

    this.setState({ "streamerInView" : parseInt(newStreamerInView) });

    // change the follow/unfollow button for the currently "in view" streamer
    var streamer = this.state.streamers[newStreamerInView];
    //console.log("streamer", streamer);
    ajax({
      url: `https://api.twitch.tv/kraken/users/${concurrentData.username.toLowerCase()}/follows/channels/${streamer}`,
      type: "GET",
      success: function(data) {
        document.querySelector(".follow").addClass("hide");
        document.querySelector(".unfollow").removeClass("hide");
      },
      error: function(err) {
        document.querySelector(".follow").removeClass("hide");
        document.querySelector(".unfollow").addClass("hide");
        //console.log(`Status: ${err.status}`, `Message: ${err.message}`)
      }
    });
  },
  loginUser: function() {
    Twitch.login({
      scope: ["user_blocks_edit", "user_blocks_read", "user_follows_edit", "channel_read", "channel_editor", "channel_commercial", "channel_stream", "channel_subscriptions", "user_subscriptions", "channel_check_subscription", "chat_login"]
    });
  },
  appendStreamer: function() {
    if(this.state.streamers.length < 4) {
      this.state.streamers.push(this.state.hoveredStreamer);
      document.querySelector("#stream-viewer").addClass("open").removeClass("shrink");
      document.body.style.overflow = "hidden";
      this.setState({});

      // change the follow/unfollow button for the currently "in view" streamer
      var streamer = this.state.streamers[this.state.streamerInView];
      ajax({
        url: `https://api.twitch.tv/kraken/users/${concurrentData.username.toLowerCase()}/follows/channels/${streamer}`,
        type: "GET",
        success: function(data) {
          document.querySelector(".follow").addClass("hide");
          document.querySelector(".unfollow").removeClass("hide");            
        },
        error: function(err) {
          document.querySelector(".follow").removeClass("hide");
          document.querySelector(".unfollow").addClass("hide");            
          //console.log(`Status: ${err.status}`, `Message: ${err.message}`)
        }
      });
    }
  },
  componentDidMount: function() {
    var eleminstance = this;

    document.addEventListener("mousedown", function(e) {
      ////console.log(e);
      if(e.button === 0) {
        if(e.target.hasClass("streamer-opt")) {
          eleminstance.appendStreamer()
        }
        document.querySelector("#context-menu.streamer-options").addClass("hide");
      } else
      if(e.button === 2) {
        if(e.target.hasClass(["featured-stream-item", "following-stream-item", "followers-stream-item"])) {
          eleminstance.state.hoveredStreamer = event.target.attributes["data-stream-link"].value;
          document.querySelector("#context-menu.streamer-options").removeClass("hide");
          document.querySelector("#context-menu.streamer-options").css({
            "top": `${e.clientY}px`,
            "left": `${e.clientX}px`
          });
        } else
        if(e.target.hasClass("toggle-chat")) {
          if(eleminstance.state.streamers.length > 1) {
            eleminstance.state.streamers.splice( parseInt(e.target.attributes["data-chat"].value), 1 );
            if(parseInt(e.target.attributes["data-chat"].value) > eleminstance.state.streamers.length-1) {
              eleminstance.state.streamerInView = eleminstance.state.streamers.length-1;
            }
            eleminstance.setState({});
          }
        } else {
          document.querySelector("#context-menu.streamer-options").addClass("hide");
        }
      }
    });
  },
  render: function render() {
    var eleminstance = this;
    return React.createElement(
      "div",
      { "id" : "view-parent" },
      // render component for the main section of the page
      React.createElement(window[this.state.history[this.state.history.length-1].page], { "parentAPI" : this }),
      // render component for the stream viewer (top-left corner)
      React.createElement(
        "div",
        { "id" : "stream-viewer" },
        React.createElement(
          "div",
          { "id" : "viewer-controls"},
          React.createElement(
            "div",
            { "className" : "ctrl close", "onClick" : this.viewStream }
          ),
          React.createElement(
            "div",
            { "className" : "ctrl display", "onClick" : this.viewStream }
          ),
          React.createElement(
            "div",
            { "className" : "ctrl chat", "onClick" : this.viewStream }
          ),
          React.createElement(
            "div",
            { "className" : "ctrl follow", "data-streamer" : `${this.state.streamers[this.state.streamerInView]}`, "onClick" : this.viewStream },
            `Follow ${this.state.streamers[this.state.streamerInView]}`
          ),
          React.createElement(
            "div",
            { "className" : "ctrl unfollow", "data-streamer" : `${this.state.streamers[this.state.streamerInView]}`, "onClick" : this.viewStream },
            `Unfollow ${this.state.streamers[this.state.streamerInView]}`
          ),
          this.state.streamers.map(function(streamer, ind) {
            return React.createElement(
              "div",
              { "className" : "ctrl toggle-chat", "data-chat" : ind, "onClick" : `${eleminstance.toggleChat}`, "title" : `${streamer}`, "key" : `toggle${ind}` },
              `Chat ${ind}`
            )
          })
        ),
        React.createElement(
          "div",
          { "id" : `embed-area`},
          React.createElement(
            "div",
            { "className" : `video-embed${(this.state.streamers.length === 3) ? " three" : ""}` },
            this.state.streamers.map(function(streamer, ind) {
              return React.createElement(
                "div",
                { "className" : `video embed-size-${eleminstance.state.streamers.length}${(ind === eleminstance.state.streamerInView) ? " in-view" : " out-view"}`, "key" : `video${ind}` },
                React.createElement(
                  "iframe",
                  { "src" : `http://player.twitch.tv/?channel=${streamer}`, "frameBorder" : "0" }
                )
              )
            })
          ),
          this.state.streamers.map(function(streamer, ind) {
            return React.createElement(
              "div",
              { "className" : `chat-embed${(ind === eleminstance.state.streamerInView) ? "" : " hide"}`, "key" : `chat-embed${ind}` },
              React.createElement(
                "div",
                { "className" : `chat-${ind}` },
                React.createElement(
                  "div",
                  { "className" : "chat-cover", "onClick" : eleminstance.loginUser }
                ),
                React.createElement(
                  "iframe",
                  { "src" : `http://twitch.tv/${streamer}/chat`, "frameBorder" : "0" }
                )
              )
            )
          })
        )
      ),
      // render component for the options bar (top-right corner)
      React.createElement(OptionsBar, { "parentAPI" : this }),
      React.createElement(
        "ul",
        { "id" : "context-menu", "className" : "streamer-options hide" },
        React.createElement(
          "li",
          { "className" : "streamer-opt" },
          "Add Streamer To View"
        )
      )
    )
  }
});

// options - nav, search, login/out
var OptionsBar = React.createClass({
  "displayName": "OptionsBar",

  componentDidMount: function() {
    //console.log(this.props)

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

      e.target[0].value = "";
    });

    // click event for back navigation
    document.querySelector(".nav.prev").addEventListener("click", function() {
      accessView.changeViewPrev()
    });

    // check for user login data
    var eleminstance = twitchToken;
    remote.getCurrentWebContents().session.cookies.get({
      "name": "name"
    }, function(err, cookies) {
      ////console.log(cookies);
      if(cookies.length > 0) {
        // if user is logged in, hide connect button
        document.querySelector(".nav.log").addClass("hide");
        document.querySelector("#embed-area").addClass("logged-in");

        // set the token
        twitchToken = Twitch.getToken();
        // sets the current user name if it doesn't exist
        if(!concurrentData.username) {
          ajax({
            url: `https://api.twitch.tv/kraken/channel?oauth_token=${twitchToken}`,
            success: function(data) {
              data = JSON.parse(data);
              //console.log(data);
              concurrentData.username = data.display_name;
              concurrentData.links = data._links;
              remote.require("./handle-con-data").saveConcurrentData(concurrentData);
            },
            error: function(data) {
              //console.log(data)
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

        //console.log("storage data cleared");
      });
      twitchToken = null;
      concurrentData.username = null;
      concurrentData.links = null;
      //console.log("user logged out");
      var newHistory = eleminstance.props.parentAPI.state.history.filter(function(elem) {
        if( !elem.match(/AccountInfoPage/i) ) {
          return elem;
        }
      });
      eleminstance.props.parentAPI.setState({ "history" : newHistory });
    });
    Twitch.getStatus({ "force" : true }, function(err, status) {
      if(err) throw err;

      ////console.log(status)
      if(status.authenticated) {
        document.querySelector(".nav.log").addClass("hide");
        document.querySelector("#embed-area").addClass("logged-in");
      } else {
        document.querySelector(".nav.log").removeClass("hide");
        document.querySelector("#embed-area").removeClass("logged-in");
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

  componentDidMount: function() {
    this.props.parentAPI.searchForGameData();
  },
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

  componentDidMount: function() {
    this.props.parentAPI.searchForStreamData();
    this.props.parentAPI.searchForChannelData();
  },
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
        //console.log("Top Streams", JSON.parse(data));
      },
      error: function(data) {
        //console.log(data)
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
        //console.log("Top Games", JSON.parse(data));
      },
      error: function(data) {
        //console.log(data)
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
    ////console.log(nextState)
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
        //console.log("Top Streams", JSON.parse(data));
      },
      error: function(data) {
        //console.log(data)
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
    ////console.log(nextState)
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
          accessView.state.streamSearchResults.map(function(item, ind) {
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
    var historyPoint = accessView.state.history[accessView.state.history.length-1];
    console.log(historyPoint)
    //console.log(accessView.state.streamSearchResults);
    //console.log(accessView.state.channelSearchResults);

    return pageWrapNormal(
      null,
      React.createElement(
        "div",
        { "id" : "top-streams" },
        /* section title */
        pageWrapNormal(
          null,
          React.createElement(
            "h1",
            { "className" : "section-title" },
            `Live Streams ${(historyPoint.search) ? `for "${historyPoint.search}"` : ""}`
          )
        ),
        /* section */
        React.createElement(
          "ul",
          { "id" : "featured-streams-list", "className" : "" },
          accessView.state.streamSearchResults.map(function(item, ind) {
            return React.createElement(
              "li",
              { "key" : "featured-stream-item" + ind, "className" : "featured-stream-item col-6-5-4-3-2-1", "data-stream-link" : ((item.stream) ? item.stream.channel.name : item.channel.name), "onClick" : accessView.viewStream },
              React.createElement(
                "img",
                { "src" : ((item.stream) ? item.stream.preview.large : item.preview.large) }
              ),
              React.createElement(
                "h1",
                { "className" : "title"},
                `${((item.title) ? item.title : item.channel.status)}`
              ),
              React.createElement(
                "span",
                { "className" : "stats" },
                React.createElement(
                  "span",
                  null,
                  `${((item.stream) ? item.stream.viewers : item.viewers)} viewers on `,
                  React.createElement(
                    "span",
                    { "className" : "bold" },
                    `${((item.stream) ? item.stream.channel.name : item.channel.display_name)}`
                  )
                )
              )
            )
          })
        ),
        /* section manual pagination */
        React.createElement(
          "div",
          { "className" : "right-justify" },
          React.createElement(
            "div",
            { "className" : "pointer link bold inline-block", "onClick" : accessView.searchForStreamData },
            "Load more streams"
          )
        ),
        /* separator */
        pageWrapSmall(
          null,
          normalSeparator
        ),
        /* section title */
        pageWrapNormal(
          null,
          React.createElement(
            "h1",
            { "className" : "section-title" },
            `Channel results ${(accessView.state.historyPoint.search) ? `for "${accessView.state.historyPoint.search}"` : ""}`
          )
        ),
        /* section */
        React.createElement(
          "ul",
          { "id" : "featured-streams-list", "className" : "" },
          accessView.state.channelSearchResults.map(function(item, ind) {
            return React.createElement(
              "li",
              { "key" : "featured-stream-item" + ind, "className" : "featured-stream-item col-6-5-4-3-2-1", "data-stream-link" : item.name, "onClick" : accessView.viewStream },
              React.createElement(
                "img",
                { "src" : item.logo }
              ),
              React.createElement(
                "h1",
                { "className" : "title"},
                `${item.display_name}`
              )
            )
          })
        ),
        /* section manual pagination */
        React.createElement(
          "div",
          { "className" : "right-justify" },
          React.createElement(
            "div",
            { "className" : "pointer link bold inline-block", "onClick" : accessView.searchForChannelData },
            "Load more streams"
          )
        )
      )
    )
  }
});
/* account page */
var AccountPage = React.createClass({
  "displayName": "AccountPage",

  getInitialState: function() {
    return { "following" : [], "followingLimit" : 6*4, "followingOffset" : 0, "followers" : [], "followersLimit" : 6*4, "followersOffset" : 0, "filter" : "all" };
  },
  componentDidMount: function() {
    var elemInstance = this;

    // get list of streams the current user is following
    this.loadFollowingChannels();

    // get list of user following the current user
    this.loadFollowerChannels();
  },
  loadFollowingChannels: function(offset) {
    if(typeof offset !== "number") {
      offset = this.state.followingOffset+1;
    }
    var elemInstance = this;

    // get list of streams the current user is following
    ajax({
      url: `https://api.twitch.tv/kraken/users/${concurrentData.username.toLowerCase()}/follows/channels?offset=${elemInstance.state.followingOffset * elemInstance.state.followingLimit}&limit=${elemInstance.state.followingLimit}`,
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
              elemInstance.state.following.push(elem);

              // refresh the state-dependent components
              elemInstance.setState({ "followingOffset" : offset });
            },
            error: function(err) {
              //console.log(`Status: ${err.status}`, `Message: ${err.message}`)
            }
          });
        });
      },
      error: function(err) {
        //console.log(`Status: ${err.status}`, `Message: ${err.message}`)
      }
    });
  },
  loadFollowerChannels: function(offset) {
    if(typeof offset !== "number") {
      offset = this.state.followingOffset+1;
    }
    var elemInstance = this;

    // get list of user following the current user
    ajax({
      url: `${concurrentData.links.follows}?offset=${elemInstance.state.followersOffset * elemInstance.state.followersLimit}&limit=${elemInstance.state.followersLimit}`,
      success: function(data) {
        data = JSON.parse(data);
        data.follows.map(function(elem) {
          elemInstance.state.followers.push(elem);
        });
        elemInstance.setState({ "followersOffset" : offset });
      },
      error: function(err) {
        //console.log(`Status: ${err.status}`, `Message: ${err.message}`)
      }
    });
  },
  refreshStreams: function(e) {
    var elemInstance = this;

    if(e.target.attributes["data-section"].value === "following") {
      this.state.following.map(function(elem, ind) {
        ajax({
          url: `https://api.twitch.tv/kraken/streams/${elem.channel.name}`,
          success: function(dataToCheckLive) {
            dataToCheckLive = JSON.parse(dataToCheckLive)

            // sets a key value to online or offline, depending on the status of the stream
            elemInstance.state.following[ind].stream = dataToCheckLive.stream;
            // //console.log(elemInstance.state.following[ind])

            // refresh the state-dependent components
            elemInstance.setState({ "following" : elemInstance.state.following });
          },
          error: function(err) {
            //console.log(`Status: ${err.status}`, `Message: ${err.message}`)
          }
        });
      });
    }
  },
  filterList: function(e) {
    var filter = e.target.attributes["data-filter"].value;

    this.setState({ "filter" : filter });
  },
  render: function render() {
    var elemInstance = this;

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
                { "className" : `btn btn-spaced${(this.state.filter === "all") ? " btn-selected" : "" }`, "data-section" : "following", "data-filter" : "all", "onClick" : this.filterList },
                `Show All`
              ),
              React.createElement(
                "div",
                { "className" : `btn btn-spaced${(this.state.filter === "online") ? " btn-selected" : "" }`, "data-section" : "following", "data-filter" : "online", "onClick" : this.filterList },
                `Show Online`
              ),
              React.createElement(
                "div",
                { "className" : `btn btn-spaced`, "data-section" : "following", "onClick" : this.refreshStreams },
                `Refresh streams`
              )
            )
          )
        ),
        // section
        React.createElement(
          "ul",
          { "id" : "following-streams-list", "className" : `filter-${this.state.filter}` },
          this.state.following.map(function(item, ind) {
            return React.createElement(
              "li",
              { "key" : "following-stream-item" + ind, "className" : `following-stream-item col-6-5-4-3-2-1${(item.stream) ? "" : " offline" }`, "data-stream-link" : item.channel.name, "onClick" : accessView.viewStream },
              React.createElement(
                "img",
                { "src" : item.channel.logo || "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png" }
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
            { "className" : "pointer link bold inline-block", "data-section" : "following", "onClick" : elemInstance.loadFollowingChannels },
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
              { "key" : "followers-stream-item" + ind, "className" : "followers-stream-item col-6-5-4-3-2-1", "data-stream-link" : (item.user.name), "onClick" : accessView.viewStream },
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
            { "className" : "pointer link bold inline-block", "data-section" : "followers", "onClick": elemInstance.loadFollowerChannels },
            "Load more users"
          )
        )
      )
    )
  }
});

var accessView = ReactDOM.render(React.createElement(ViewParent, null), document.getElementById("main-content"));