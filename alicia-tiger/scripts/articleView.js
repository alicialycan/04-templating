'use strict';

let articleView = {};

// TODONE: Where possible, refactor methods into arrow functions, including the document.ready() method at the bottom.

// COMMENTED: How do arrow functions affect the context of "this"? How did you determine if a function could be refactored?
//The arrow function won't know what you're referring to in the loop as it will continually pass the context down and there's no context to be passed down. It doesn't have a context, it can only take the context of it's parent. We determine if a function can be refactored by whether it has an immediate this, if not, we can use an arrow function because it has a global scope.

let filterTypesObj = [{
  type: 'author',
  name: 'Authors'
},
{
  type: 'category',
  name: 'Categories'}
];

let filterType = [];

function Filter (rawDataObject) {
  for (let key in rawDataObject) {
    this[key] = rawDataObject[key];
  }
}

Filter.prototype.toHtml = function() {
  let filterTemplate = $('#filters-template').html();
  let filterRender = Handlebars.compile(filterTemplate);
  return filterRender(this);
};

filterTypesObj.forEach(filterObj => {
  filterType.push(new Filter(filterObj));
});

filterType.forEach(Filter => {
  $('#filters').append(Filter.toHtml());
});

articleView.populateFilters = () => {
  $('article').each(function() { //getting all article arguments and looping
    if (!$(this).hasClass('template')) { //if article instance has class template if it doesn't then do this. (referring to contextual this inside method so can't change to arrow function)
      let val = $(this).find('address a').text();
      let optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#author-filter option[value="${val}"]`).length === 0) {
        $('#author-filter').append(optionTag);
      }

      val = $(this).attr('data-category');
      optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = () => {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = () => {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = () => {
  $('.main-nav').on('click', '.tab', function() {
    $('.tab-content').hide();
    $(`#${$(this).data('content')}`).fadeIn();
  });

  $('.main-nav .tab:first').click();
};

articleView.setTeasers = () => {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    if ($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

$(() => {
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
});