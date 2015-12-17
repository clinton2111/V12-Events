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
