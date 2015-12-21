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
