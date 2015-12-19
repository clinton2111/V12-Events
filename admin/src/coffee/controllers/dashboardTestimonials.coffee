angular.module 'V12Admin.dashBoardCtrl'
.controller 'dashBoardTestimonialsController', ['$scope', 'dashBoardTestimonialService',
  ($scope, dashBoardTestimonialService)->
    $scope.$on('$viewContentLoaded', ()->
    );
    $scope.testimonials = [];
    offset = 0

    $scope.openModal = (id, modalType)->
      if _.isNull(id) and modalType is 'new_testimonial'
        $scope.modalType = 'new_testimonial'
      else
        index = _.findIndex($scope.testimonials, {id: id});
        $scope.tempData = $scope.testimonials[index]
        $scope.modalType = 'update_testimonial'
      $ '#testimonialModal'
      .openModal();

    $scope.fetchTestimonials = (offset)->
      if offset is 0 then $scope.testimonials = []
      dashBoardTestimonialService.fetchTestimonials(offset)
      .then (data)->
        if data.status is 204 then Materialize.toast('No testimonials to load', 4000);
        else
          response = data.data
          $scope.testimonials = response.results
      , (error)->
        Materialize.toast('Something went wrong', 4000);

    $scope.updateTestimonial = ->
      index = _.findIndex($scope.testimonials, {id: $scope.tempData.id});
      console.log $scope.tempData
      dashBoardTestimonialService.updateTestimonial($scope.tempData)
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.testimonials[index] =
            testimonial: $scope.tempData.testimonial
            testifier_name: $scope.tempData.testifier_name
            testifier_designation: $scope.tempData.testifier_designation
            testifier_company_name: $scope.tempData.testifier_company_name
          $scope.tempData = {}
          Materialize.toast response.status + " - " + response.message, 4000
        else
          Materialize.toast response.status + " - " + response.message, 4000
      , (error)->
        Materialize.toast('Something went wrong', 4000);

    $scope.loadMore = ->
      offset = $scope.testimonials.length
      $scope.fetchTestimonials(offset)

    $scope.uploadTestimonial = ()->
      new_testimonial_data = $scope.new_testimonial
      if _.isUndefined(new_testimonial_data.show_on_site) then new_testimonial_data.show_on_site = false

      dashBoardTestimonialService.uploadTestimonial(new_testimonial_data)
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.testimonials.unshift
            id: response.id
            testimonial: new_testimonial_data.testimonial
            testifier_name: new_testimonial_data.testifier_name
            testifier_designation: new_testimonial_data.testifier_designation
            testifier_company_name: new_testimonial_data.testifier_company_name
            show_on_site: new_testimonial_data.show_on_site

          $scope.new_testimonial = angular.copy({});
          Materialize.toast response.status + " - " + response.message, 4000
        else
          Materialize.toast response.status + " - " + response.message, 4000
      , (error)->
        Materialize.toast('Something went wrong', 4000);

]