angular.module 'v12events.main', []
.controller 'mainController', ['$scope', '$q', '$window', 'mainService', 'API', 'vcRecaptchaService',
  ($scope, $q, $window, mainService, API, vcRecaptchaService)->
    q = null
    $scope.$on '$viewContentLoaded', ->
      $ ".button-collapse"
      .sideNav()
      $ '.slider'


      $('.parallax').parallax();
      q = $q.defer()
      loadScript();
      q.promise

    $scope.publicKey = API.gCaptchaPublicKey
    $scope.photos = []
    $scope.videos = []
    $scope.testimonials = []
    $scope.picPaths =
      main_image: '../assets/photos/'
      thumbnails: '../assets/thumbnails/'
    $window.initMap = ->
      center = new google.maps.LatLng(15.3912425, 73.8330925)
      mapOptions =
        zoom: 16
        scrollwheel: false
        draggable: false
        center: center
        mapTypeId: google.maps.MapTypeId.ROADMAP
        styles: [{"featureType": "administrative", "elementType": "geometry", "stylers": [{"color": "#a7a7a7"}]}, {
          "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{"visibility": "on"},
            {"color": "#737373"}]
        }, {
          "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{"visibility": "on"},
            {"color": "#efefef"}]
        }, {
          "featureType": "poi", "elementType": "geometry.fill", "stylers": [{"visibility": "on"}, {"color": "#dadada"}]
        }, {"featureType": "poi", "elementType": "labels", "stylers": [{"visibility": "off"}]},
          {"featureType": "poi", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]},
          {"featureType": "road", "elementType": "labels.text.fill", "stylers": [{"color": "#696969"}]},
          {"featureType": "road", "elementType": "labels.icon", "stylers": [{"visibility": "off"}]},
          {"featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{"color": "#5e728c"}]}, {
            "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{"visibility": "on"},
              {"color": "#f0f0f0"}]
          }, {"featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{"color": "#ffffff"}]},
          {"featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{"color": "#d6d6d6"}]}, {
            "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{"visibility": "on"},
              {"color": "#ffffff"}, {"weight": 1.8}]
          }, {"featureType": "road.local", "elementType": "geometry.stroke", "stylers": [{"color": "#d7d7d7"}]},
          {"featureType": "transit", "elementType": "all", "stylers": [{"color": "#808080"}, {"visibility": "off"}]},
          {"featureType": "water", "elementType": "geometry.fill", "stylers": [{"color": "#c5d8e7"}]}]

      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      infowindow = new google.maps.InfoWindow();


      img =
        url: '/assets/pointer.svg'
        origin: new google.maps.Point(0, 0)

      marker = new google.maps.Marker
        map: $scope.map,
        position: center,
        icon: img

      google.maps.event.addListener marker, 'mouseover', ()->
        infowindow.setContent('V12 Events');
        infowindow.open($scope.map, this);
        marker.setMap($scope.map)


      google.maps.event.addListener marker, 'mouseout', ()->
      infowindow.close()
      q.resolve


    loadScript = ->
      script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap';
      document.body.appendChild(script);

    $scope.fetchPhotos = (offset)->
      if offset is 0 then $scope.photos = []
      $scope.fetchingPhotos = true
      mainService.fetchPhotos(offset)
      .then (data)->
        if data.status is 204 then Materialize.toast('No photos to load', 4000);
        else
          response = data.data

          if $scope.photos.length == 0 then $scope.photos = response.results
          else
            _.each(response.results, (index)->
              $scope.photos.push(index)
            )
      , (error)->
        Materialize.toast('Something went wrong', 4000);
      .finally ()->
        $scope.fetchingPhotos = false


    $scope.fetchVideos = (offset)->
      if offset is 0 then $scope.videos = []
      $scope.fetchingVideos = true
      mainService.fetchVideos(offset)
      .then (data)->
        if data.status is 204 then Materialize.toast('No videos to load', 4000);
        else
          response = data.data
          if $scope.videos.length == 0 then $scope.videos = response.results
          else
            _.each(response.results, (index)->
              $scope.videos.push(index)
            )
      , (error)->
        Materialize.toast('Something went wrong', 4000);
      .finally ()->
        $scope.fetchingVideos = false

    $scope.fetchTestimonials = (offset)->
      if offset is 0 then $scope.testimonials = []
      $scope.fetchingTestimonials = true
      mainService.fetchTestimonials(offset)
      .then (data)->
        if data.status is 204 then Materialize.toast('No testimonials to load', 4000);
        else
          response = data.data
          if $scope.testimonials.length == 0 then $scope.testimonials = response.results
          else
            _.each(response.results, (index)->
              $scope.testimonials.push(index)
            )
      , (error)->
        Materialize.toast('Something went wrong', 4000);
      .finally ()->
        $scope.fetchingTestimonials = false

    $scope.sendEmail = ->
      if vcRecaptchaService.getResponse() is ""
        Materialize.toast('Please resolve the captcha', 4000);
        return false
      else $scope.email.g_recaptcha_response = vcRecaptchaService.getResponse()
      console.log $scope.email
      mainService.sendEmail($scope.email)
      .then (data)->
        response = data.data;
        if response.status is 'Success' then Materialize.toast(response.status + ' - ' + response.message, 4000)
        else
          Materialize.toast(response.status + ' - ' + response.message, 4000)
      , (error)->
        Materialize.toast('Opps something went wrong.', 4000)

    $scope.$watchCollection ['photos', 'videos', 'testimonials', 'fetchingPhotos', 'fetchingVideos',
                             'fetchingTestimonials'], ()->
      $scope.$apply
    , false
]

