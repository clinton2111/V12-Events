angular.module 'V12Admin.dashBoardCtrl'
.controller 'dashBoardVideosController', ['$scope', 'dashBoardVideosService',
  ($scope, dashBoardVideosService)->
    $scope.$on('$viewContentLoaded', ()->
      $('.modal-trigger').leanModal();
    );
    offset = 0;
    $scope.videos = []

    $scope.fetchVideos = (offset)->
      if offset is 0 then $scope.videos = []
      dashBoardVideosService.fetchVideos(offset)
      .then (data)->
        if data.status is 204 then Materialize.toast('No videos to load', 4000);
        else
          response = data.data
          if $scope.videos.length == 0 then $scope.videos = response.results
          else
            _.each(response.results, (index)->
              $scope.videos.push(index)
            )
      , (error)->
        Materialize.toast('Something went wrong', 4000);

    $scope.loadMore = ->
      offset = $scope.videos.length
      $scope.fetchVideos(offset)


    $scope.uploadVideo = ()->
      url = $scope.video_url;
      index = url.lastIndexOf('/');
      temp = url.substring(index + 1);
      result = null;
      if(temp.lastIndexOf('?v=') > -1)
        index = temp.lastIndexOf('=')
        result = temp.substring(index + 1)
      else
        result = temp
      dashBoardVideosService.uploadVideo(result)
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.videos.unshift
            id: response.id
            video_id: result
            video_title: response.video_title
          console.log $scope.videos
          $scope.video_url = null
          Materialize.toast response.status + " - " + response.message, 4000
        else
          Materialize.toast response.status + " - " + response.message, 4000
      , (error)->
        Materialize.toast('Something went wrong', 4000);

    $scope.deleteVideo = (id)->
      index = _.findIndex($scope.videos, {id: id});
      data =
        id: id
      dashBoardVideosService.deleteVideo(data)
      .then (data)->
        response = data.data

        $scope.videos.splice(index, 1);
        Materialize.toast response.status + " - " + response.message, 4000

      , (error)->
        Materialize.toast('Something went wrong', 4000);

    $scope.$watchCollection ['videos'], ()->
      $scope.$apply
    , false
]