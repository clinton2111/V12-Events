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
