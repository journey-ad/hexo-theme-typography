/*ImageTitle*/
let imageTitle = ()=>{
(function () {
  function addTitle(img) {
      var text = (img.title || img.alt || img.src.split("/").pop()) + '|' + img.naturalWidth + 'x' + img.naturalHeight;
      var span = document.createElement('span');
      span.classList.add('image-title');
      span.innerText = text;
      img.parentNode.insertBefore(span, img.nextSibling);
  }
  document.querySelectorAll('p img').forEach(function (img, i) {
      if ((img.complete && img.naturalHeight) || img.height) {
          addTitle(img);
      } else {
          img.onload = addTitle(img);
      }
  });
})();

}

imageTitle()

module.exports = imageTitle