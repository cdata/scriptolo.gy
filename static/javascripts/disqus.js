define(['jquery', 'underscore'],
       function($, _) {

  function loadDisqusScript() {
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//cdata-scriptology.disqus.com/embed.js?https';
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
        dev: window.SCRIPTOLOGY_DEV_MODE,
        offline: window.SCRIPTOLOGY_OFFLINE_MODE,
        fragment: 'abc-disqus-test-page'
      });

      this.unload();

      window.disqus_developer = options.dev ||
                                !!window.location.port ||
                                window.location.host !== 'scriptolo.gy';

      window.disqus_shortname = 'cdata-scriptology';
      window.disqus_identifier = options.fragment;
      window.disqus_url = 'https://scriptolo.gy/' + options.fragment;

      if (!options.offline) {
        loadDisqusScript();
      }
    }
  };
});
