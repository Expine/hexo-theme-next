'use strict';

const { format } = require('util');

function pagination(base, posts, options) {
  if (typeof base !== 'string') throw new TypeError('base must be a string!');
  if (!posts) throw new TypeError('posts is required!');

  if (base && !base.endsWith('/')) base += '/';

  const { format: _format, layout, data, perPage, includeTag, excludeTag } = Object.assign({
    format: 'page/%d/',
    layout: ['archive', 'index'],
    data: {},
    perPage: 10,
    includeTag: null,
    excludeTag: null
  }, options);

  const usePosts = Object.create(posts);
  usePosts.data = usePosts.data.sort((a, b) => a.date.isBefore(b.date) ? 1 : a.date.isAfter(b.date) ? -1 : 0 )
  if (includeTag !== null) {
    usePosts.data = usePosts.data.filter(a => a.tags.data.some(tag => tag.name == includeTag));
    usePosts.length = usePosts.data.length;
  }
  if (excludeTag !== null) {
    usePosts.data = usePosts.data.filter(a => !a.tags.data.some(tag => tag.name == excludeTag));
    usePosts.length = usePosts.data.length;
  }
  const length = usePosts.data.length;

  const total = perPage ? Math.ceil(length / perPage) : 1;
  const result = [];
  const urlCache = new Map();

  function formatURL(i) {
    if (urlCache.has(i)) return urlCache.get(i);

    const url = i > 1 ? base + format(_format, i) : base;
    urlCache.set(i, url);

    return url;
  }

  function makeData(i) {
    const data = {
      base,
      total,
      current: i,
      current_url: formatURL(i),
      posts: perPage ? usePosts.slice(perPage * (i - 1), perPage * i) : usePosts,
      prev: 0,
      prev_link: '',
      next: 0,
      next_link: ''
    };

    if (i > 1) {
      data.prev = i - 1;
      data.prev_link = formatURL(data.prev);
    }

    if (i < total) {
      data.next = i + 1;
      data.next_link = formatURL(data.next);
    }

    return data;
  }

  if (perPage) {
    for (let i = 1; i <= total; i++) {
      result.push({
        path: formatURL(i),
        layout,
        data: Object.assign(makeData(i), data)
      });
    }
  } else {
    result.push({
      path: base,
      layout,
      data: Object.assign(makeData(1), data)
    });
  }

  return result;
}

module.exports = pagination;