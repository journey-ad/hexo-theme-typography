/*给p标签中的「猫与向日葵」字样加上标记*/
(function () {
  $('p:contains("猫与向日葵")').each(function () {
      $(this).replaceWith('<p>' + $(this).html().replace(/猫与向日葵/g, '<span class="cat-and-sunflower">猫与向日葵</span>') + '</p>');
  });
})();
