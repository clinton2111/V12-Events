angular.module 'V12Admin.dashBoardCtrl'
.controller 'dashBoardPhotosController', ['$scope', 'dashBoardPhotosService',
  ($scope, dashBoardPhotosService)->
    $scope.$on('$viewContentLoaded', ()->
      $('.modal-trigger').leanModal();
    );
    offset = 0;
    $scope.photos = []
    $scope.picPaths =
      main_image: '../assets/photos/'
      thumbnails: '../assets/thumbnails/'

    $scope.fetchPhotos = (offset)->
      if offset is 0 then $scope.photos = []
      dashBoardPhotosService.fetchPhotos(offset)
      .then (data)->
        if data.status is 204 then Materialize.toast('No photos to load', 4000);
        else
          response = data.data

          if $scope.photos.length == 0 then $scope.photos = response.results
          else
            _.each(response.results, (index)->
              $scope.photos.push(index)
            )
      , (error)->
        Materialize.toast('Something went wrong', 4000);

    $scope.loadMore = ->
      offset = $scope.photos.length
      $scope.fetchPhotos(offset)

    $scope.openModal = (id,modalType)->
      index = _.findIndex($scope.photos, {id: id});
      if modalType is 'caption'
        caption = $scope.photos[index].caption;
        if caption is "" then caption = null
        $scope.currentPic = {
          Caption: caption
          Id: id
        }
        $ '#updateCaption'
        .openModal();


    $scope.deletePhoto = (id)->
      index = _.findIndex($scope.photos, {id: id});
      data =
        id: id
        name:$scope.photos[index].image_name
      dashBoardPhotosService.deletePhoto(data)
      .then (data)->
        response = data.data

        $scope.photos.splice(index, 1);
        Materialize.toast response.status + " - " + response.message, 4000

      , (error)->
        Materialize.toast('Something went wrong', 4000);


    $scope.uploadPhoto = (pic)->
      dashBoardPhotosService.uploadPhoto(pic)
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.photos.unshift
            id: response.id
            caption: pic.Caption
            image_name: response.imageName

          $scope.pic = angular.copy({});
          ('#photoModal').closeModal();
          Materialize.toast response.status + " - " + response.message, 4000
        else
          Materialize.toast response.status + " - " + response.message, 4000
      , (error)->
        Materialize.toast('Something went wrong', 4000);

    $scope.updateCaption = (id)->
      index = _.findIndex($scope.photos, {id: id});
      new_caption = $scope.currentPic.Caption
      data =
        caption: new_caption
        id: id
      dashBoardPhotosService.updateCaption(data)
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.photos[index].caption = new_caption
          ('#updateCaption').closeModal();
          Materialize.toast response.status + " - " + response.message, 4000
        else
          Materialize.toast response.status + " - " + response.message, 4000

      , (error)->
        Materialize.toast('Something went wrong', 4000);

    $scope.$watchCollection ['photos'], ()->
      $scope.$apply
    , false


]
