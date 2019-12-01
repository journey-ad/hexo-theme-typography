import 'jquery-pjax';
import NProgress from 'nprogress';

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
});

$(document).on('pjax:end', function () {
  NProgress.done();
  require('./image-box')()
  require('./image-title')()
  require('./typography')()
  window.originTitle = document.title;

  if (ga) {
    ga('set', 'location', window.location.href);
    ga('send', 'pageview');
  }
});
