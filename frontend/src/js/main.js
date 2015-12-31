/*! v12events - v1.0.0 - 2015-12-31 */(function() {
  angular.module('V12Events', ['ui.router', 'v12events.main', 'duScroll', 'angularLazyImg', 'vcRecaptcha', 'zumba.angular-waypoints']).config([
    '$stateProvider', '$urlRouterProvider', '$locationProvider', 'API', function($stateProvider, $urlRouterProvider, $locationProvider, API) {
      $locationProvider.html5Mode(true);
      $stateProvider.state('home', {
        url: '/home',
        templateUrl: API.views + 'main.html',
        controller: 'mainController'
      });
      return $urlRouterProvider.otherwise('/home');
    }
  ]).constant('API', {
    url: '../api/',
    views: '/frontend/src/views/',
    gCaptchaPublicKey: '6LdppxMTAAAAADqap2kMLOfXg2Cqk5O6MqP3qUOg'
  });

}).call(this);

(function() {
  angular.module('v12events.main', []).controller('mainController', [
    '$scope', '$q', '$window', 'mainService', 'API', 'vcRecaptchaService', function($scope, $q, $window, mainService, API, vcRecaptchaService) {
      var loadScript, q;
      q = null;
      $scope.$on('$viewContentLoaded', function() {
        $(".button-collapse").sideNav();
        $('.slider');
        $('.parallax').parallax();
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
              "featureType": "administrative",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#a7a7a7"
                }
              ]
            }, {
              "featureType": "administrative",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "visibility": "on"
                }, {
                  "color": "#737373"
                }
              ]
            }, {
              "featureType": "landscape",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "visibility": "on"
                }, {
                  "color": "#efefef"
                }
              ]
            }, {
              "featureType": "poi",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "visibility": "on"
                }, {
                  "color": "#dadada"
                }
              ]
            }, {
              "featureType": "poi",
              "elementType": "labels",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            }, {
              "featureType": "poi",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            }, {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#696969"
                }
              ]
            }, {
              "featureType": "road",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            }, {
              "featureType": "road.highway",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#5e728c"
                }
              ]
            }, {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "visibility": "on"
                }, {
                  "color": "#f0f0f0"
                }
              ]
            }, {
              "featureType": "road.arterial",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#ffffff"
                }
              ]
            }, {
              "featureType": "road.arterial",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#d6d6d6"
                }
              ]
            }, {
              "featureType": "road.local",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "visibility": "on"
                }, {
                  "color": "#ffffff"
                }, {
                  "weight": 1.8
                }
              ]
            }, {
              "featureType": "road.local",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#d7d7d7"
                }
              ]
            }, {
              "featureType": "transit",
              "elementType": "all",
              "stylers": [
                {
                  "color": "#808080"
                }, {
                  "visibility": "off"
                }
              ]
            }, {
              "featureType": "water",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#c5d8e7"
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
          infowindow.setContent('V12 Events');
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
        $scope.fetchingPhotos = true;
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
        })["finally"](function() {
          return $scope.fetchingPhotos = false;
        });
      };
      $scope.fetchVideos = function(offset) {
        if (offset === 0) {
          $scope.videos = [];
        }
        $scope.fetchingVideos = true;
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
        })["finally"](function() {
          return $scope.fetchingVideos = false;
        });
      };
      $scope.fetchTestimonials = function(offset) {
        if (offset === 0) {
          $scope.testimonials = [];
        }
        $scope.fetchingTestimonials = true;
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
        })["finally"](function() {
          return $scope.fetchingTestimonials = false;
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
      return $scope.$watchCollection(['photos', 'videos', 'testimonials', 'fetchingPhotos', 'fetchingVideos', 'fetchingTestimonials'], function() {
        return $scope.$apply;
      }, false);
    }
  ]);

}).call(this);

(function() {
  angular.module('v12events.main').factory('mainService', [
    '$http', '$q', 'API', function($http, $q, API) {
      return {
        fetchPhotos: function(offset) {
          var q;
          q = $q.defer();
          $http({
            url: API.url + 'frontendHandler.php',
            data: {
              'location': 'fetch_photos',
              'offset': offset
            },
            method: 'post',
            cache: true
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        },
        fetchVideos: function(offset) {
          var q;
          q = $q.defer();
          $http({
            url: API.url + 'frontendHandler.php',
            data: {
              'location': 'fetch_videos',
              'offset': offset
            },
            method: 'post',
            cache: true
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        },
        fetchTestimonials: function(offset) {
          var q;
          q = $q.defer();
          $http({
            url: API.url + 'frontendHandler.php',
            data: {
              'location': 'fetch_testimonials',
              'offset': offset
            },
            method: 'post',
            cache: true
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        },
        sendEmail: function(emailData) {
          var q;
          q = $q.defer();
          emailData.location = 'send_mail';
          $http({
            url: API.url + 'frontendHandler.php',
            data: emailData,
            method: 'post'
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        }
      };
    }
  ]);

}).call(this);
