/* global hexo */

'use strict';

hexo.extend.filter.register('before_generate', () => {
  // Merge config
  require('./lib/config')(hexo);
  // Set vendors
  require('./lib/vendors')(hexo);
  // Add filter type `theme_inject`
  require('./lib/injects')(hexo);
  // Highlight
  require('./lib/highlight')(hexo);
}, 0);

hexo.on('ready', () => {
  const { version } = require('../../package.json');
  hexo.log.info(`==================================
  ███╗   ██╗███████╗██╗  ██╗████████╗
  ████╗  ██║██╔════╝╚██╗██╔╝╚══██╔══╝
  ██╔██╗ ██║█████╗   ╚███╔╝    ██║
  ██║╚██╗██║██╔══╝   ██╔██╗    ██║
  ██║ ╚████║███████╗██╔╝ ██╗   ██║
  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝   ╚═╝
========================================
NexT version ${version}
Documentation: https://theme-next.js.org
========================================`);
});

// ページを作る
var pagination = require('./lib/pagination');
hexo.extend.generator.register('home', function(locals){
  // hexo-pagination makes an index.html for the /archives route
  return pagination('home', locals.posts, {
    perPage: 10,
    layout: ['index'],
    excludeTag: 'Diary'
  });
});
hexo.extend.generator.register('diary', function(locals){
  // hexo-pagination makes an index.html for the /archives route
  return pagination('diary', locals.posts, {
    perPage: 10,
    layout: ['diary', 'archive', 'index'],
    includeTag: 'Diary'
  });
});