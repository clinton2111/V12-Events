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
