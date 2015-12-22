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
