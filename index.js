"use strict";

var request = require('request')

var Github

var GithubUrl = /https?:\/\/(?:www\.)?github\.com/i
  , GithubApi = "https://api.github.com"

request.defaults({
  "headers": {
    "User-Agent": 'fs.github'
  }
})

Github = function(accessToken) {
  // var accessToken = accessToken

  return {
    token: function(tok) {
      this.token = tok
      return this
    }
  , readFile: function (filename) {
      var args = Array.prototype.slice.call(arguments)
        , callback
        , req
        , opts
        , ropts
        , fileArr
        , owner, repo, path

      // /repos/:owner/:repo/contents/:path
      filename = filename.replace(GithubUrl, "")

      if (filename[0] == "/") {
        filename.substring(1)
      }

      fileArr = filename.split("/")


      path = fileArr.slice(2).join("/")
      owner = fileArr[0]
      repo = fileArr[1]

      var uri = GithubApi + "/repos/" + owner + "/" + repo + "/contents/" + path + "?access_token=" + accessToken

      if (opts && opts.branch) {
        uri += "&ref=" + opts.branch
      }

      ropts = {
        "uri": uri
      , "headers": {
          "User-Agent": 'fs.github'
        }
      }

      if (args.length === 2) {
        callback = args[1]
      }

      if (args.length === 3) {
        opts = args[1]
        callback = args[2]
      }
      req = request(ropts, function(err, resp, body) {
        // console.log(err, resp.status, resp.statusCode, body, body.content)
        var data = (new Buffer(JSON.parse(body).content, 'base64'))
        if (opts && opts.encoding.toLowerCase() === 'string') {
          data = data.toString()
        }

        if (callback) {
          callback(err, data, JSON.parse(body))
        }

      })
    }
  }
}

module.exports = Github
