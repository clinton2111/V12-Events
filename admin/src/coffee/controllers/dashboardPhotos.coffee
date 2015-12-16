angular.module 'V12Admin.dashBoardCtrl'
.controller 'dashBoardPhotosController', ['$scope', 'dashBoardPhotosService', ($scope, dashBoardPhotosService)->
  $scope.$on('$viewContentLoaded', ()->
    $('.modal-trigger').leanModal();
  );

  $scope.uploadPhoto = (pic)->
    dashBoardPhotosService.uploadPhoto(pic)
    .then (data)->
      response = data.data
      if response.status is 'Success'
#        $scope.photos.unshift({
#          id: response.id
#          caption: pic.Caption
#          photo_image: response.imageName
#        })
        $scope.pic = {};
        Materialize.toast response.status + " - " + response.message, 4000
      else
        Materialize.toast response.status + " - " + response.message, 4000
    , (error)->
      Materialize.toast('Something went wrong', 4000);

]