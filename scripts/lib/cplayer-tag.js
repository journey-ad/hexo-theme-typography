const utils = require('utility');
const cson = require('cson');
const scriptID = 'cplayer-script';
const yaml = require('js-yaml');
require('isomorphic-fetch');

module.exports = function (args, contents) {

  let autoplay = false;

  let targetID = 'cplayer-' + utils.randomString(8, '1234567890');

  let parser = 'yaml'

  args.forEach((arg) => {
    switch (arg.trim()) {
      case "autoplay":
        autoplay = true;
        break;
      case "yaml":
        parser = 'yaml';
        break;
      case "cson":
        parser = 'cson';
        break;
      case "json":
        parser = 'json';
        break;
      default:
        break;
    }
  })

  function parse(content, parser) {
    switch (parser) {
      case 'json':
        return JSON.parse(content);
      case 'cson':
        return cson.parse(content);
      case 'yaml':
        return yaml.load(content)
    }
  }

  let playlist = parse(contents, parser);

  let resPlaylist = [{ name: 'loading...', artist: 'loading...' }];
  let add163 = [];

  playlist = playlist.forEach(function (v) {
    switch (typeof v) {
      case 'number':
        add163.push(v);
        break;
      default:
        resPlaylist.push(v);
        break;
    }
  });

  return `
    <div class="cplayer-template"
      id=${JSON.stringify(targetID)}
      data-id=${JSON.stringify(targetID)}
      data-playlist=${escape(JSON.stringify(resPlaylist))}
      data-ids=${JSON.stringify(add163)}
      data-autoplay="${autoplay}"
      style="position: relative"
    ></div>
    <script>
      (function(){

        let getLyric = id => {
          return new Promise((resolve, reject) => {
            fetch("https://api.imjad.cn/cloudmusic/?type=lyric&id=" + id).then(res => {
              return res.json()
            }).then(data => {
              // console.log(data)
              if(!data.lrc){
                data = Object.assign(data, {
                  lrc: {lyric: '[00:00.00]找不到歌词的说…(⊙﹏⊙)[99:00.00]'},
                  tlyric: {lyric: '[00:00.00]翻译不存在的说…╮(╯▽╰)╭[99:00.00]'}
                })
              }
              let obj = {
                lyric: data.lrc.lyric,
                tlyric: data.tlyric.lyric
              }
              resolve(obj);
            })
          })
        }

        function loadcplayer() {
          if (typeof window.cplayerList === 'undefined') window.cplayerList = {};
          if (typeof window.cplayerList[${JSON.stringify(targetID)}] !== 'undefined') return;
          if (!cplayer.prototype.add163) cplayer.prototype.add163 = async function add163(id) {
            if (!id) throw new Error("Unable Property.");
            let lyric = await getLyric(id);
            // console.log(lyric)

            return fetch("https://api.imjad.cn/cloudmusic/?type=detail&id=" + id).then(function(res){return res.json()}).then(function(data){
              let obj = {
                name: data.songs[0].name,
                artist: data.songs[0].ar.map(function(ar){ return ar.name }).join(','),
                poster: data.songs[0].al.picUrl,
                lyric: lyric.lyric,
                sublyric: lyric.tlyric,
                src: 'https://api.imjad.cn/cloudmusic/?type=song&raw=true&id=' + id
              }
              this.add(obj);
              return obj;
            }.bind(this))
          }

          window.cplayerList[${JSON.stringify(targetID)}] = new cplayer({
            element: document.getElementById(${JSON.stringify(targetID)}),
            playlist: ${JSON.stringify(resPlaylist)},
            generateBeforeElement: false,
            deleteElementAfterGenerate: false,
            autoplay: ${JSON.stringify(autoplay)},
            zoomOutKana: true,
            style: \`c-player {
                      font-size: 16px !important;
                      position: relative;
                      left: 50%;
                      transform: translateX(-50%);
                      width: auto;
                      max-width: 550px;
                      margin: 30px auto;
                    }
                    c-player .cp-controls{
                      user-select: none;
                    }
                    c-player .cp-lyric{
                      width: 100%;
                      margin: 0.41667em 0;
                    }
                    c-player .cp-play-button .cp-play-icon.cp-play-icon-paused {
                      margin-left: 0.8em;
                    }
                    @media (max-width: 768px) {
                      c-player{
                        font-size: 12px !important;
                        left: auto;
                        transform: none;
                        width: 100%;
                        margin: 10px auto;
                      }
                      c-player .cp-mainbody{
                        min-height: 5.16667em;
                      }
                      c-player .cp-poster{
                        width: 5.16667em;
                        height: 5.16667em;
                      }
                      c-player .cp-center-container{
                        height: 5.16667em;
                      }
                      c-player .cp-play-button, c-player .cp-volume-button, c-player .cp-prev-button, c-player .cp-list-button, c-player .cp-mode-button, c-player .cp-next-button{
                        width: 1.54167em;
                        height: 1.54167em;
                      }
                      c-player .cp-icon, c-player .cp-prev-icon, c-player .cp-next-icon, c-player .cp-volume-icon, c-player .cp-random-icon, c-player .cp-single-icon, c-player .cp-loop-icon, c-player .cp-list-icon{
                        height: 1.54167em;
                        width: 1.54167em;
                      }
                      c-player .cp-play-button{
                        height: 2.8em;
                        width: 2.8em;
                      }
                      c-player .cp-play-button .cp-play-icon{
                        margin: 0.8em;
                      }
                      c-player .cp-play-button .cp-play-icon.cp-play-icon-paused {
                        margin: 0.7875em;
                        margin-left: 1em;
                      }
                      c-player .cp-volume-icon {
                        width: 1.76667em;
                      }
                      c-player .cp-list-button {
                        width: 1.54167em;
                        height: 1.54167em;
                      }
                      c-player .cp-mode-button {
                        width: 1.54167em;
                        height: 1.54167em;
                      }
                    }
                    \`
          });

          ${
    add163.map((a) => {
      return `window.cplayerList[${JSON.stringify(targetID)}].add163(${JSON.stringify(a)})`
    }) || ''
    }

          let player = window.cplayerList[${JSON.stringify(targetID)}]
          player.to(1)
          player.remove(player.playlist[0])
        }
        
        if (typeof window.cplayer === 'undefined' && !document.getElementById(${JSON.stringify(scriptID)})) {
          var js = document.createElement("script");
          js.src = 'https://cdn.jsdelivr.net/gh/MoePlayer/cPlayer/dist/cplayer.js';
          js.id = ${JSON.stringify(scriptID)};
          js.addEventListener("load", loadcplayer);
          document.body.appendChild(js);
        } else {
          window.addEventListener("load", loadcplayer);
        }
      })()
    </script>`;
}