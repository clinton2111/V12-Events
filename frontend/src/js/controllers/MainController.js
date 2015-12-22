(function() {
  angular.module('v12events.main', []).controller('mainController', [
    '$scope', '$q', '$window', 'mainService', 'API', 'vcRecaptchaService', function($scope, $q, $window, mainService, API, vcRecaptchaService) {
      var loadScript, q;
      q = null;
      $scope.$on('$viewContentLoaded', function() {
        $(".button-collapse").sideNav();
        $('.slider').slider({
          full_width: true,
          height: 600,
          indicators: false
        });
        $('.slider_testimonial').slider({
          full_width: false,
          indicators: false
        });
        $('.materialboxed').materialbox();
        q = $q.defer();
        loadScript();
        return q.promise;
      });
      $scope.publicKey = API.gCaptchaPublicKey;
      $scope.photos = [];
      $scope.videos = [];
      $scope.testimonials = [];
      $scope.picPaths = {
        main_image: '../assets/photos/',
        thumbnails: '../assets/thumbnails/'
      };
      $window.initMap = function() {
        var center, img, infowindow, mapOptions, marker;
        center = new google.maps.LatLng(15.3912425, 73.8330925);
        mapOptions = {
          zoom: 16,
          scrollwheel: false,
          draggable: false,
          center: center,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              "featureType": "landscape.natural",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "visibility": "on"
                }, {
                  "color": "#e0efef"
                }
              ]
            }, {
              "featureType": "poi",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "visibility": "on"
                }, {
                  "hue": "#1900ff"
                }, {
                  "color": "#c0e8e8"
                }
              ]
            }, {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "lightness": 100
                }, {
                  "visibility": "simplified"
                }
              ]
            }, {
              "featureType": "road",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            }, {
              "featureType": "transit.line",
              "elementType": "geometry",
              "stylers": [
                {
                  "visibility": "on"
                }, {
                  "lightness": 700
                }
              ]
            }, {
              "featureType": "water",
              "elementType": "all",
              "stylers": [
                {
                  "color": "#7dcdcd"
                }
              ]
            }, {
              "featureType": "water",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#009688"
                }
              ]
            }
          ]
        };
        $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        infowindow = new google.maps.InfoWindow();
        img = {
          url: '/assets/pointer.svg',
          origin: new google.maps.Point(0, 0)
        };
        marker = new google.maps.Marker({
          map: $scope.map,
          position: center,
          icon: img
        });
        google.maps.event.addListener(marker, 'mouseover', function() {
          infowindow.setContent('Framen Shipping Limited');
          infowindow.open($scope.map, this);
          return marker.setMap($scope.map);
        });
        google.maps.event.addListener(marker, 'mouseout', function() {});
        infowindow.close();
        return q.resolve;
      };
      loadScript = function() {
        var script;
        script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?callback=initMap';
        return document.body.appendChild(script);
      };
      $scope.fetchPhotos = function(offset) {
        if (offset === 0) {
          $scope.photos = [];
        }
        return mainService.fetchPhotos(offset).then(function(data) {
          var response;
          if (data.status === 204) {
            return Materialize.toast('No photos to load', 4000);
          } else {
            response = data.data;
            if ($scope.photos.length === 0) {
              return $scope.photos = response.results;
            } else {
              return _.each(response.results, function(index) {
                return $scope.photos.push(index);
              });
            }
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.fetchVideos = function(offset) {
        if (offset === 0) {
          $scope.videos = [];
        }
        return mainService.fetchVideos(offset).then(function(data) {
          var response;
          if (data.status === 204) {
            return Materialize.toast('No videos to load', 4000);
          } else {
            response = data.data;
            if ($scope.videos.length === 0) {
              return $scope.videos = response.results;
            } else {
              return _.each(response.results, function(index) {
                return $scope.videos.push(index);
              });
            }
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.fetchTestimonials = function(offset) {
        if (offset === 0) {
          $scope.testimonials = [];
        }
        return mainService.fetchTestimonials(offset).then(function(data) {
          var response;
          if (data.status === 204) {
            return Materialize.toast('No testimonials to load', 4000);
          } else {
            response = data.data;
            if ($scope.testimonials.length === 0) {
              return $scope.testimonials = response.results;
            } else {
              return _.each(response.results, function(index) {
                return $scope.testimonials.push(index);
              });
            }
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.sendEmail = function() {
        if (vcRecaptchaService.getResponse() === "") {
          Materialize.toast('Please resolve the captcha', 4000);
          return false;
        } else {
          $scope.email.g_recaptcha_response = vcRecaptchaService.getResponse();
        }
        console.log($scope.email);
        return mainService.sendEmail($scope.email).then(function(data) {
          var response;
          response = data.data;
          if (response.status === 'Success') {
            return Materialize.toast(response.status + ' - ' + response.message, 4000);
          } else {
            return Materialize.toast(response.status + ' - ' + response.message, 4000);
          }
        }, function(error) {
          return Materialize.toast('Opps something went wrong.', 4000);
        });
      };
      return $scope.$watchCollection(['photos', 'videos', 'testimonials'], function() {
        return $scope.$apply;
      }, false);
    }
  ]);

}).call(this);
