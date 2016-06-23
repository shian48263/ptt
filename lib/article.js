'use strict';

const BASE_URL = require('./config').BASE_URL;
let Promise = require('bluebird');
let debug = require('debug')('ptt:article');
let cheerio = require('cheerio');
let request = require('./config').request;
const AUTHOR_SELECTOR = '#main-content > div:nth-child(1) > span.article-meta-value';
const TITLE_SELECTOR = '#main-content > div:nth-child(3) > span.article-meta-value';
const BOARDNAME_SELECTOR = '#main-content > div.article-metaline-right > span.article-meta-value';
const DATETIME_SELECTOR = '#main-content > div:nth-child(4) > span.article-meta-value';

function getArticleFromHtml(html) {
  let $ = cheerio.load(html);
  let article = {
    content: '',
    date: Date.parse($(DATETIME_SELECTOR).text()),
    author: $(AUTHOR_SELECTOR).text(),
    boardName: $(BOARDNAME_SELECTOR).text(),
    title: $(TITLE_SELECTOR).text(),
    images: [],
    links: [],
    f2f6: []
  };

  $('div.article-metaline').remove();
  $('div.article-metaline-right').remove();
  article.content = $('#main-content').text();

  $('img').each((i, element) => {
    article.images.push($(element).attr('src'));
  });

  $('a').each((i, element) => {
    article.links.push($(element).attr('href'));
  });

  $('span.f2, span.f6').each((i, element) => {
    article.f2f6.push($(element).text());
  });

  return Promise.resolve(article);
}

function getArticleFromLink(link) {
  return request.get(link)
    .then(html => getArticleFromHtml(html));
}

module.exports = {
  getArticleFromLink,
  getArticleFromHtml,
};
