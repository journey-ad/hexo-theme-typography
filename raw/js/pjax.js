import 'jquery-pjax';
import NProgress from 'nprogress';
import cplayer from './cplayer'

NProgress.configure({
  showSpinner: false,
  easing: 'ease-out',
  speed: 1000
});

$(document).pjax('a:not(.fancybox):not([target="_blank"])', '#stage', {
  fragment: '#stage',
  timeout: 5000,
});

$(document).on('pjax:start', function () {
  NProgress.start();
  cplayer.destroy()
});

$(document).on('pjax:end', function () {
  NProgress.done();
  require('./image-box')()
  require('./image-title')()
  require('./typography')()

  cplayer.init()
  window.originTitle = document.title;

  if (ga) {
    ga('set', 'location', window.location.href);
    ga('send', 'pageview');
  }
});
