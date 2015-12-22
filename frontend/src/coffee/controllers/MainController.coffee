angular.module 'v12events.main', []
.controller 'mainController', ['$scope', '$q', '$window','mainService','API','vcRecaptchaService', ($scope, $q, $window,mainService,API,vcRecaptchaService)->
  q = null
  $scope.$on '$viewContentLoaded', ->
    $ ".button-collapse"
    .sideNav()
    $ '.slider'
    .slider
        full_width: true,
        height: 600,
        indicators: false
    $ '.slider_testimonial'
    .slider
        full_width: false,
        indicators: false
    $ '.materialboxed'

    .materialbox()
    q = $q.defer()
    loadScript();
    q.promise

  $scope.publicKey =API.gCaptchaPublicKey
  $scope.photos=[]
  $scope.videos=[]
  $scope.testimonials=[]
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
      styles: [
        {
          "featureType": "landscape.natural",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "visibility": "on"
            },
            {
              "color": "#e0efef"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "visibility": "on"
            },
            {
              "hue": "#1900ff"
            },
            {
              "color": "#c0e8e8"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "lightness": 100
            },
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "on"
            },
            {
              "lightness": 700
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
            {
              "color": "#7dcdcd"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#009688"
            }
          ]
        }
      ]

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
      infowindow.setContent('Framen Shipping Limited');
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

  $scope.fetchVideos = (offset)->
    if offset is 0 then $scope.videos = []
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

  $scope.fetchTestimonials = (offset)->
    if offset is 0 then $scope.testimonials = []
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

  $scope.sendEmail=->

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

  $scope.$watchCollection ['photos','videos','testimonials'], ()->
    $scope.$apply
  , false
]

