(function() {
  angular.module('V12Admin.dashBoardCtrl').factory('dashBoardPhotosService', [
    '$http', '$q', 'API', 'Upload', function($http, $q, API, Upload) {
      return {
        uploadPhoto: function(picData) {
          var q;
          q = $q.defer();
          Upload.upload({
            url: API.url + 'photoHandler.php',
            data: {
              caption: picData.Caption,
              location: 'photos_insert'
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
        }
      };
    }
  ]);

}).call(this);
