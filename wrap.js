(function() {

    const namespace = require('./package.json')['open-chat-framework']['namespace'];
    window.OpenChatFramework.plugin[namespace] = require('./plugin.js');

})();