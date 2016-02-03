angular.module 'v12events.main'
.directive('testimonialsDisplay',['API',(API)->
    return{
        restrict:'A'
        scope:
            testimonials:'='
        replace: false
        templateUrl:API.views+'templates/testimonialDisplay.tpl.html'
        link:(scope,element,attrs)->
            watcher = scope.$watch 'testimonials', ()->
                if (_.isUndefined(scope.testimonials) || _.isEmpty(scope.testimonials) ) then return

                watcher()
                console.log scope.testimonials
                $('.client-button').click ()->
                    $this = $(this)
                    position = $this.parent().children().index($this);

                    $('.client-unit').removeClass('active-client').eq(position).addClass('active-client ');
                    $('.client-button').removeClass('active-client').eq(position).addClass('active-client');

                $('.client-control-next, .client-control-prev').click ->
                    $this = $(this)
                    curActiveClient = $('.clients-belt').find('.active-client')
                    position = $('.clients-belt').children().index(curActiveClient)
                    clientNum = $('.client-unit').length

                    if($this.hasClass('client-control-next'))
                        if(position < (clientNum-1))
                            $('.active-client').removeClass('active-client').next().addClass('active-client');
                        else
                            $('.client-unit').removeClass('active-client').first().addClass('active-client');

                            $('.client-button').removeClass('active-client').first().addClass('active-client');

                    else
                        if(position is 0)
                          $('.client-unit').removeClass('active-client').last().addClass('active-client');

                          $('.client-button').removeClass('active-client').last().addClass('active-client');
                         else
                          $('.active-client').removeClass('active-client').prev().addClass('active-client');


    }
])