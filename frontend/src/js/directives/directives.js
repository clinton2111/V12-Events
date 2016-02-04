(function() {
  angular.module('v12events.main').directive('testimonialsDisplay', [
    'API', function(API) {
      return {
        restrict: 'A',
        scope: {
          testimonials: '='
        },
        replace: false,
        templateUrl: API.views + 'templates/testimonialDisplay.tpl.html',
        link: function(scope, element, attrs) {
          var watcher;
          return watcher = scope.$watch('testimonials', function() {
            if (_.isUndefined(scope.testimonials) || _.isEmpty(scope.testimonials)) {
              return;
            }
            watcher();
            $('.client-button').click(function() {
              var $this, position;
              $this = $(this);
              position = $this.parent().children().index($this);
              $('.client-unit').removeClass('active-client').eq(position).addClass('active-client ');
              return $('.client-button').removeClass('active-client').eq(position).addClass('active-client');
            });
            return $('.client-control-next, .client-control-prev').click(function() {
              var $this, clientNum, curActiveClient, position;
              $this = $(this);
              curActiveClient = $('.clients-belt').find('.active-client');
              position = $('.clients-belt').children().index(curActiveClient);
              clientNum = $('.client-unit').length;
              if ($this.hasClass('client-control-next')) {
                if (position < (clientNum - 1)) {
                  return $('.active-client').removeClass('active-client').next().addClass('active-client');
                } else {
                  $('.client-unit').removeClass('active-client').first().addClass('active-client');
                  return $('.client-button').removeClass('active-client').first().addClass('active-client');
                }
              } else {
                if (position === 0) {
                  $('.client-unit').removeClass('active-client').last().addClass('active-client');
                  return $('.client-button').removeClass('active-client').last().addClass('active-client');
                } else {
                  return $('.active-client').removeClass('active-client').prev().addClass('active-client');
                }
              }
            });
          });
        }
      };
    }
  ]);

}).call(this);
