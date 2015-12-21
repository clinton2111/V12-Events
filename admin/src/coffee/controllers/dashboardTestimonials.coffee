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
#          $scope.testimonials = response.results
          if $scope.testimonials.length is 0 then $scope.testimonials = response.results
          else
            _.each(response.results, (index)->
              $scope.testimonials.push(index)
            )
      , (error)->
        Materialize.toast('Something went wrong', 4000);

    $scope.updateTestimonial = ->
      index = _.findIndex($scope.testimonials, {id: $scope.tempData.id});
      dashBoardTestimonialService.updateTestimonial($scope.tempData)
      .then (data)->
        response = data.data
        if response.status is 'Success'
          show_on_site = $scope.testimonials[index].show_on_site

          $scope.testimonials[index].testimonial = $scope.tempData.testimonial
          $scope.testimonials[index].testifier_name = $scope.tempData.testifier_name
          $scope.testimonials[index].testifier_designation = $scope.tempData.testifier_designation
          $scope.testimonials[index].testifier_company_name = $scope.tempData.testifier_company_name
          $scope.testimonials[index].show_on_site = show_on_site
          console.log $scope.testimonials
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

    $scope.checkChecked = (id)->
      index = _.findIndex($scope.testimonials, {id: id});
      temp = $scope.testimonials[index].show_on_site
      if temp is 1
        'checked'
      else
        false

    $scope.updateSoS = (id)->
      index = _.findIndex($scope.testimonials, {id: id});
      temp = $scope.testimonials[index].show_on_site
      if temp is 1 then newSos = 0 else newSos = 1


      console.log 'Old SoS =' + temp + " new SoS =" + newSos + " " + id

      dashBoardTestimonialService.updateShowOnSite({id: id, show_on_site: newSos})
      .then (data)->
        response = data.data
        if response.status is 'Success'
          $scope.testimonials[index].show_on_site = newSos
        else
          console.log response.status + " - " + response.message
      , (error)->
        Materialize.toast('Something went wrong', 4000);

    $scope.deleteTestimonial = (id)->
      index = _.findIndex($scope.testimonials, {id: id});


      dashBoardTestimonialService.deleteTestimonial(id)
      .then (data)->
        response = data.data

        $scope.testimonials.splice(index, 1);
        Materialize.toast response.status + " - " + response.message, 4000

      , (error)->
        Materialize.toast('Something went wrong', 4000);

    $scope.$watchCollection ['testimonials'], ()->
      $scope.$apply
    , false


]
