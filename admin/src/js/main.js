/*! v12events - v1.0.0 - 2015-12-21 */(function() {
  angular.module('V12Admin', ['ui.router', 'V12Admin.authentication', 'angular-md5', 'satellizer', 'ngStorage', 'V12Admin.dashBoardCtrl', 'ngFileUpload', 'angularLazyImg']).config([
    '$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', '$authProvider', 'API', function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $authProvider, API) {
      $stateProvider.state('auth', {
        url: '/auth/:type/:email/:value',
        templateUrl: API.views + 'auth.html',
        controller: 'authController'
      }).state('dashboard', {
        url: '/dashboard',
        abstract: true,
        templateUrl: API.views + 'dashboard.html',
        controller: 'dashBoardController',
        data: {
          requiresLogin: true
        }
      }).state('dashboard.home', {
        url: '',
        templateUrl: API.views + 'dashboardHome.html',
        data: {
          requiresLogin: true
        }
      }).state('dashboard.photos', {
        url: '/photos',
        templateUrl: API.views + 'dashboardPhotos.html',
        controller: 'dashBoardPhotosController',
        data: {
          requiresLogin: true
        }
      }).state('dashboard.testimonials', {
        url: '/testimonials',
        templateUrl: API.views + 'dashboardTestimonials.html',
        controller: 'dashBoardTestimonialsController',
        data: {
          requiresLogin: true
        }
      }).state('dashboard.videos', {
        url: '/videos',
        templateUrl: API.views + 'dashboardVideos.html',
        controller: 'dashBoardVideosController',
        data: {
          requiresLogin: true
        }
      });
      $urlRouterProvider.otherwise('/auth');
      $urlRouterProvider.when('dashboard', 'dashboard.home');
      $urlRouterProvider.otherwise('/auth/login//');
      $authProvider.loginUrl = API.url + 'auth.php';
      return $authProvider.tokenPrefix = 'v12events';
    }
  ]).constant('API', {
    url: '../api/',
    views: '/admin/src/views/'
  }).run([
    '$rootScope', '$state', '$http', 'API', '$q', '$auth', '$localStorage', function($rootScope, $state, $http, API, $q, $auth, $localStorage) {
      return $rootScope.$on('$stateChangeStart', function(e, to) {
        var lastUpdate, refreshToken, refreshTokenFlag;
        refreshToken = function() {
          var q;
          q = $q.defer();
          $http.post(API.url + 'refreshToken.php', null).then(function(data) {
            return q.resolve(data.data);
          }, function(error) {
            console.log('Error');
            return q.reject(data);
          });
          return q.promise;
        };
        if (to.data && to.data.requiresLogin) {
          if ($auth.isAuthenticated() === false) {
            e.preventDefault();
            return $state.go('auth', {
              type: 'login',
              email: null,
              value: null
            });
          } else {
            lastUpdate = null;
            if (_.isUndefined($localStorage.resetDate) === true) {
              lastUpdate = moment('21-11-1992', 'DD-MM-YYYY');
            } else {
              lastUpdate = moment($localStorage.resetDate, 'DD-MM-YYYY');
            }
            refreshTokenFlag = moment().isSame(moment(lastUpdate), 'day');
            if (!refreshTokenFlag) {
              return refreshToken().then(function(data) {
                var tokenData;
                tokenData = data;
                if (!(_.isNull(tokenData.token) && _.isUndefined(tokenData.token))) {
                  $auth.setToken(tokenData.token);
                  return $localStorage.resetDate = moment().format('DD-MM-YYYY');
                } else {
                  e.preventDefault();
                  return $state.go('auth', {
                    type: 'login',
                    email: null,
                    value: null
                  });
                }
              }, function(error) {
                return e.preventDefault();
              });
            }
          }
        }
      });
    }
  ]);

}).call(this);

(function() {
  angular.module('V12Admin.authentication', []).controller('authController', [
    '$scope', '$stateParams', 'md5', 'authFactory', '$auth', '$state', '$localStorage', function($scope, $stateParams, md5, authFactory, $auth, $state, $localStorage) {
      if ($stateParams.type === 'recovery' && !_.isUndefined($stateParams.value) && !_.isUndefined($stateParams.email)) {
        $scope.recovery_screen = true;
        $scope.header = 'Reset Password';
      } else {
        $scope.recovery_screen = false;
        $scope.header = 'Login';
      }
      $scope.forgotPassword = false;
      $scope.viewPass = false;
      $scope.passType = 'password';
      $scope.passIcon = 'mdi-action-visibility-off';
      $scope.toggleShowPassword = function() {
        if ($scope.viewPass === false) {
          $scope.viewPass = true;
          $scope.passType = 'text';
          return $scope.passIcon = 'mdi-action-visibility';
        } else {
          $scope.viewPass = false;
          $scope.passType = 'password';
          return $scope.passIcon = 'mdi-action-visibility-off';
        }
      };
      $scope.login = function(user) {
        var data;
        data = {
          email: user.email,
          password: md5.createHash(user.password || ''),
          type: 'login'
        };
        return $auth.login(data, [
          {
            skipAuthorization: true
          }
        ]).then(function(data) {
          var userData;
          userData = data.data;
          $localStorage.resetDate = moment().format('DD-MM-YYYY');
          Materialize.toast(userData.message, '4000');
          return $state.go('dashboard.home');
        }, function(error) {
          return Materialize.toast(error.data.message, '4000');
        });
      };
      $scope.recoverPassword = function(recovery) {
        return authFactory.recoverPassword(recovery).then(function(data) {
          var response;
          response = data.data;
          return Materialize.toast(response.message, 4000);
        }, function(error) {
          return Materialize.toast(error.data.message, 4000);
        });
      };
      $scope.toggleForgotPass = function() {
        if ($scope.forgotPassword === false) {
          $scope.forgotPassword = true;
          return $scope.header = 'Recover Password';
        } else {
          $scope.forgotPassword = false;
          return $scope.header = 'Login';
        }
      };
      return $scope.updatePassword = function(new_pass) {
        var data;
        if (new_pass.password === new_pass.cpassword) {
          data = {
            password: md5.createHash(new_pass.password || ''),
            email: $stateParams.email,
            value: $stateParams.value
          };
          return authFactory.updatePassword(data).then(function(data) {
            var response;
            response = data.data;
            Materialize.toast(response.status + ' - ' + response.message, 4000);
            return $state.go('auth', {
              type: 'login',
              email: null,
              value: null
            });
          }, function(error) {
            return Materialize.toast('Opps something went wrong', 4000);
          });
        } else {
          return Materialize.toast('Passwords do not match', 4000);
        }
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('V12Admin.dashBoardCtrl', []).controller('dashBoardController', [
    '$scope', '$state', '$auth', '$localStorage', function($scope, $state, $auth, $localStorage) {
      var payload;
      $scope.$on('$viewContentLoaded', function() {
        return $(".button-collapse").sideNav({
          menuWidth: 300,
          closeOnClick: true
        });
      });
      payload = $auth.getPayload();
      $scope.username = payload.name;
      return $scope.logout = function() {
        $auth.logout();
        delete $localStorage.resetDate;
        $state.go('auth', {
          type: 'login',
          email: null,
          value: null
        });
        return Materialize.toast('You have been logged out', 4000);
      };
    }
  ]);

}).call(this);

(function() {
  angular.module('V12Admin.dashBoardCtrl').controller('dashBoardPhotosController', [
    '$scope', 'dashBoardPhotosService', function($scope, dashBoardPhotosService) {
      var offset;
      $scope.$on('$viewContentLoaded', function() {
        return $('.modal-trigger').leanModal();
      });
      offset = 0;
      $scope.photos = [];
      $scope.picPaths = {
        main_image: '../assets/photos/',
        thumbnails: '../assets/thumbnails/'
      };
      $scope.fetchPhotos = function(offset) {
        if (offset === 0) {
          $scope.photos = [];
        }
        return dashBoardPhotosService.fetchPhotos(offset).then(function(data) {
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
      $scope.loadMore = function() {
        offset = $scope.photos.length;
        return $scope.fetchPhotos(offset);
      };
      $scope.openModal = function(id, modalType) {
        var caption, index;
        index = _.findIndex($scope.photos, {
          id: id
        });
        if (modalType === 'caption') {
          caption = $scope.photos[index].caption;
          if (caption === "") {
            caption = null;
          }
          $scope.currentPic = {
            Caption: caption,
            Id: id
          };
          return $('#updateCaption').openModal();
        }
      };
      $scope.deletePhoto = function(id) {
        var data, index;
        index = _.findIndex($scope.photos, {
          id: id
        });
        data = {
          id: id,
          name: $scope.photos[index].image_name
        };
        return dashBoardPhotosService.deletePhoto(data).then(function(data) {
          var response;
          response = data.data;
          $scope.photos.splice(index, 1);
          return Materialize.toast(response.status + " - " + response.message, 4000);
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.uploadPhoto = function(pic) {
        return dashBoardPhotosService.uploadPhoto(pic).then(function(data) {
          var response;
          response = data.data;
          if (response.status === 'Success') {
            $scope.photos.unshift({
              id: response.id,
              caption: pic.Caption,
              image_name: response.imageName
            });
            $scope.pic = angular.copy({});
            return Materialize.toast(response.status + " - " + response.message, 4000);
          } else {
            return Materialize.toast(response.status + " - " + response.message, 4000);
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.updateCaption = function(id) {
        var data, index, new_caption;
        index = _.findIndex($scope.photos, {
          id: id
        });
        new_caption = $scope.currentPic.Caption;
        data = {
          caption: new_caption,
          id: id
        };
        return dashBoardPhotosService.updateCaption(data).then(function(data) {
          var response;
          response = data.data;
          if (response.status === 'Success') {
            $scope.photos[index].caption = new_caption;
            return Materialize.toast(response.status + " - " + response.message, 4000);
          } else {
            return Materialize.toast(response.status + " - " + response.message, 4000);
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      return $scope.$watchCollection(['photos'], function() {
        return $scope.$apply;
      }, false);
    }
  ]);

}).call(this);

(function() {
  angular.module('V12Admin.dashBoardCtrl').controller('dashBoardTestimonialsController', [
    '$scope', 'dashBoardTestimonialService', function($scope, dashBoardTestimonialService) {
      var offset;
      $scope.$on('$viewContentLoaded', function() {});
      $scope.testimonials = [];
      offset = 0;
      $scope.openModal = function(id, modalType) {
        var index;
        if (_.isNull(id) && modalType === 'new_testimonial') {
          $scope.modalType = 'new_testimonial';
        } else {
          index = _.findIndex($scope.testimonials, {
            id: id
          });
          $scope.tempData = $scope.testimonials[index];
          $scope.modalType = 'update_testimonial';
        }
        return $('#testimonialModal').openModal();
      };
      $scope.fetchTestimonials = function(offset) {
        if (offset === 0) {
          $scope.testimonials = [];
        }
        return dashBoardTestimonialService.fetchTestimonials(offset).then(function(data) {
          var response;
          if (data.status === 204) {
            return Materialize.toast('No testimonials to load', 4000);
          } else {
            response = data.data;
            if ($scope.testimonials.length === 0) {
              $scope.testimonials = response.results;
            } else {

            }
            return _.each(response.results, function(index) {
              return $scope.testimonials.push(index);
            });
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.updateTestimonial = function() {
        var index;
        index = _.findIndex($scope.testimonials, {
          id: $scope.tempData.id
        });
        return dashBoardTestimonialService.updateTestimonial($scope.tempData).then(function(data) {
          var response, show_on_site;
          response = data.data;
          if (response.status === 'Success') {
            show_on_site = $scope.testimonials[index].show_on_site;
            $scope.testimonials[index].testimonial = $scope.tempData.testimonial;
            $scope.testimonials[index].testifier_name = $scope.tempData.testifier_name;
            $scope.testimonials[index].testifier_designation = $scope.tempData.testifier_designation;
            $scope.testimonials[index].testifier_company_name = $scope.tempData.testifier_company_name;
            $scope.testimonials[index].show_on_site = show_on_site;
            console.log($scope.testimonials);
            $scope.tempData = {};
            return Materialize.toast(response.status + " - " + response.message, 4000);
          } else {
            return Materialize.toast(response.status + " - " + response.message, 4000);
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.loadMore = function() {
        offset = $scope.testimonials.length;
        return $scope.fetchTestimonials(offset);
      };
      $scope.uploadTestimonial = function() {
        var new_testimonial_data;
        new_testimonial_data = $scope.new_testimonial;
        if (_.isUndefined(new_testimonial_data.show_on_site)) {
          new_testimonial_data.show_on_site = false;
        }
        return dashBoardTestimonialService.uploadTestimonial(new_testimonial_data).then(function(data) {
          var response;
          response = data.data;
          if (response.status === 'Success') {
            $scope.testimonials.unshift({
              id: response.id,
              testimonial: new_testimonial_data.testimonial,
              testifier_name: new_testimonial_data.testifier_name,
              testifier_designation: new_testimonial_data.testifier_designation,
              testifier_company_name: new_testimonial_data.testifier_company_name,
              show_on_site: new_testimonial_data.show_on_site
            });
            $scope.new_testimonial = angular.copy({});
            return Materialize.toast(response.status + " - " + response.message, 4000);
          } else {
            return Materialize.toast(response.status + " - " + response.message, 4000);
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.checkChecked = function(id) {
        var index, temp;
        index = _.findIndex($scope.testimonials, {
          id: id
        });
        temp = $scope.testimonials[index].show_on_site;
        if (temp === 1) {
          return 'checked';
        } else {
          return false;
        }
      };
      $scope.updateSoS = function(id) {
        var index, newSos, temp;
        index = _.findIndex($scope.testimonials, {
          id: id
        });
        temp = $scope.testimonials[index].show_on_site;
        if (temp === 1) {
          newSos = 0;
        } else {
          newSos = 1;
        }
        console.log('Old SoS =' + temp + " new SoS =" + newSos + " " + id);
        return dashBoardTestimonialService.updateShowOnSite({
          id: id,
          show_on_site: newSos
        }).then(function(data) {
          var response;
          response = data.data;
          if (response.status === 'Success') {
            return $scope.testimonials[index].show_on_site = newSos;
          } else {
            return console.log(response.status + " - " + response.message);
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.deleteTestimonial = function(id) {
        var index;
        index = _.findIndex($scope.testimonials, {
          id: id
        });
        return dashBoardTestimonialService.deleteTestimonial(id).then(function(data) {
          var response;
          response = data.data;
          $scope.testimonials.splice(index, 1);
          return Materialize.toast(response.status + " - " + response.message, 4000);
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      return $scope.$watchCollection(['testimonials'], function() {
        return $scope.$apply;
      }, false);
    }
  ]);

}).call(this);

(function() {
  angular.module('V12Admin.dashBoardCtrl').controller('dashBoardVideosController', [
    '$scope', 'dashBoardVideosService', function($scope, dashBoardVideosService) {
      var offset;
      $scope.$on('$viewContentLoaded', function() {
        return $('.modal-trigger').leanModal();
      });
      offset = 0;
      $scope.videos = [];
      $scope.fetchVideos = function(offset) {
        if (offset === 0) {
          $scope.videos = [];
        }
        return dashBoardVideosService.fetchVideos(offset).then(function(data) {
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
      $scope.loadMore = function() {
        offset = $scope.videos.length;
        return $scope.fetchVideos(offset);
      };
      $scope.uploadVideo = function() {
        var index, result, temp, url;
        url = $scope.video_url;
        index = url.lastIndexOf('/');
        temp = url.substring(index + 1);
        result = null;
        if (temp.lastIndexOf('?v=') > -1) {
          index = temp.lastIndexOf('=');
          result = temp.substring(index + 1);
        } else {
          result = temp;
        }
        return dashBoardVideosService.uploadVideo(result).then(function(data) {
          var response;
          response = data.data;
          if (response.status === 'Success') {
            $scope.videos.unshift({
              id: response.id,
              video_id: result,
              video_title: response.video_title
            });
            console.log($scope.videos);
            $scope.video_url = null;
            return Materialize.toast(response.status + " - " + response.message, 4000);
          } else {
            return Materialize.toast(response.status + " - " + response.message, 4000);
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.deleteVideo = function(id) {
        var data, index;
        index = _.findIndex($scope.videos, {
          id: id
        });
        data = {
          id: id
        };
        return dashBoardVideosService.deleteVideo(data).then(function(data) {
          var response;
          response = data.data;
          $scope.videos.splice(index, 1);
          return Materialize.toast(response.status + " - " + response.message, 4000);
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      return $scope.$watchCollection(['videos'], function() {
        return $scope.$apply;
      }, false);
    }
  ]);

}).call(this);

(function() {
  angular.module('V12Admin.authentication').factory('authFactory', [
    '$http', '$q', 'API', function($http, $q, API) {
      return {
        recoverPassword: function(emailData) {
          var q;
          emailData.type = 'recoverPassword';
          q = $q.defer();
          $http({
            url: API.url + 'auth.php',
            method: 'POST',
            data: emailData,
            skipAuthorization: true
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        },
        updatePassword: function(passwordData) {
          var q;
          passwordData.type = 'updatePassword';
          q = $q.defer();
          $http({
            url: API.url + 'auth.php',
            method: 'POST',
            data: passwordData,
            skipAuthorization: true
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

(function() {
  angular.module('V12Admin.dashBoardCtrl').factory('dashBoardPhotosService', [
    '$http', '$q', 'API', 'Upload', function($http, $q, API, Upload) {
      return {
        fetchPhotos: function(offset) {
          var q;
          q = $q.defer();
          $http({
            url: API.url + 'photoHandler.php',
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
        uploadPhoto: function(picData) {
          var q;
          q = $q.defer();
          Upload.upload({
            url: API.url + 'photoHandler.php',
            data: {
              caption: picData.Caption,
              location: 'insert_photos'
            },
            method: 'POST',
            headers: {
              'Content-Type': picData.File.type
            },
            file: picData.File
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        },
        updateCaption: function(data) {
          var q;
          data.location = 'update_caption';
          q = $q.defer();
          $http({
            url: API.url + 'photoHandler.php',
            data: data,
            method: 'post'
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        },
        deletePhoto: function(data) {
          var q;
          data.location = 'delete_photo';
          q = $q.defer();
          $http({
            url: API.url + 'photoHandler.php',
            data: data,
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

(function() {
  angular.module('V12Admin.dashBoardCtrl').factory('dashBoardTestimonialService', [
    '$http', '$q', 'API', function($http, $q, API) {
      return {
        fetchTestimonials: function(offset) {
          var q;
          q = $q.defer();
          $http({
            url: API.url + 'testimonialHandler.php',
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
        uploadTestimonial: function(data) {
          var q;
          data.location = 'insert_testimonial';
          q = $q.defer();
          $http({
            url: API.url + 'testimonialHandler.php',
            data: data,
            method: 'POST'
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        },
        updateTestimonial: function(data) {
          var q;
          data.location = 'update_testimonial';
          q = $q.defer();
          $http({
            url: API.url + 'testimonialHandler.php',
            data: data,
            method: 'post'
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        },
        deleteTestimonial: function(id) {
          var data, q;
          data = {
            location: 'delete_testimonial',
            id: id
          };
          q = $q.defer();
          $http({
            url: API.url + 'testimonialHandler.php',
            data: data,
            method: 'post'
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        },
        updateShowOnSite: function(data) {
          var q;
          data.location = 'update_show_on_site';
          q = $q.defer();
          $http({
            url: API.url + 'testimonialHandler.php',
            data: data,
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

(function() {
  angular.module('V12Admin.dashBoardCtrl').factory('dashBoardVideosService', [
    '$http', '$q', 'API', function($http, $q, API) {
      return {
        fetchVideos: function(offset) {
          var q;
          q = $q.defer();
          $http({
            url: API.url + 'videoHandler.php',
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
        uploadVideo: function(video_id) {
          var q;
          q = $q.defer();
          $http({
            url: API.url + 'videoHandler.php',
            data: {
              video_id: video_id,
              location: 'insert_video'
            },
            method: 'POST'
          }).then(function(data) {
            return q.resolve(data);
          }, function(error) {
            return q.reject(error);
          });
          return q.promise;
        },
        deleteVideo: function(data) {
          var q;
          data.location = 'delete_video';
          q = $q.defer();
          $http({
            url: API.url + 'videoHandler.php',
            data: data,
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
