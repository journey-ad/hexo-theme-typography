let cplayer = {
  init: function () {
    const elements = document.querySelector('.cplayer-template')
    if (!elements) return false
    const cplayerId = elements.id
    const ids = JSON.parse(elements.dataset.ids)
    const autoplay = JSON.parse(elements.dataset.autoplay)
    const playlist = JSON.parse(unescape(elements.dataset.playlist))

    let getLyric = id => {
      return new Promise((resolve, reject) => {
        fetch("https://api.imjad.cn/cloudmusic/?type=lyric&id=" + id).then(res => {
          return res.json()
        }).then(data => {
          // console.log(data)
          if (!data.lrc) {
            data = Object.assign(data, {
              lrc: { lyric: '[00:00.00]找不到歌词的说…(⊙﹏⊙)[99:00.00]' },
              tlyric: { lyric: '[00:00.00]翻译不存在的说…╮(╯▽╰)╭[99:00.00]' }
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

    function loadcplayer(cplayer) {
      if(!cplayer) return
      if (typeof window.cplayerList === 'undefined') window.cplayerList = {};
      if (typeof window.cplayerList[cplayerId] !== 'undefined') return;
      if (!cplayer.prototype.add163) cplayer.prototype.add163 = async function add163(id) {
        if (!id) throw new Error("Unable Property.");
        let lyric = await getLyric(id);
        // console.log(lyric)

        return fetch("https://api.imjad.cn/cloudmusic/?type=detail&id=" + id).then(function (res) { return res.json() }).then(function (data) {
          let obj = {
            name: data.songs[0].name,
            artist: data.songs[0].ar.map(function (ar) { return ar.name }).join(','),
            poster: data.songs[0].al.picUrl,
            lyric: lyric.lyric,
            sublyric: lyric.tlyric,
            src: 'https://api.imjad.cn/cloudmusic/?type=song&raw=true&id=' + id
          }
          this.add(obj);
          return obj;
        }.bind(this))
      }

      window.cplayerList[cplayerId] = new cplayer({
        element: document.getElementById(cplayerId),
        playlist: playlist,
        generateBeforeElement: false,
        deleteElementAfterGenerate: false,
        autoplay: autoplay,
        zoomOutKana: true
      });

      ids.forEach(cid => {
        window.cplayerList[cplayerId].add163(cid)
      })

      let player = window.cplayerList[cplayerId]
      player.to(1)
      player.remove(player.playlist[0])
    }

    if (typeof window.cplayer === 'undefined' && !document.getElementById("cplayer-script")) {
      var js = document.createElement("script");
      js.src = 'https://cdn.jsdelivr.net/gh/MoePlayer/cPlayer/dist/cplayer.js';
      js.id = "cplayer-script";
      js.addEventListener("load", loadcplayer);
      document.body.appendChild(js);
    } else {
      loadcplayer(window.cplayer);
    }
  },
  destroy: function () {
    for (let cplayer in window.cplayerList) {
      window.cplayerList[cplayer].pause()
      let el = document.querySelector(`#${cplayer}`)
      el.remove()
    }
    window.cplayerList = {}
  }
}

export default cplayer