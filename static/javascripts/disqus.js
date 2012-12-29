define(['jquery', 'underscore'],
       function($, _) {

  function loadDisqusScript() {
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = 'http://cdata-scriptology.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] ||
      document.getElementsByTagName('body')[0]).appendChild(dsq);
  }

  return {
    unload: function() {
      if (window.DISQUS && window.DISQUS.reset) {
        window.DISQUS.reset();
      }
    },
    load: function(options) {
      options = _.defaults(options || {}, {
        dev: 0,
        fragment: 'abc-disqus-test-page'
      });

      this.unload();

      window.disqus_developer = options.dev ||
                                !!window.location.port ||
                                !window.location.host !== 'scriptolo.gy';

      window.disqus_shortname = 'cdata-scriptology';
      window.disqus_identifier = options.fragment;
      window.disqus_url = 'http://scriptolo.gy/' + options.fragment;

      loadDisqusScript();
    }
  };
});