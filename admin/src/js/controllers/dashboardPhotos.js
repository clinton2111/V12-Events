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
