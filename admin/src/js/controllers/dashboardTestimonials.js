(function() {
  angular.module('V12Admin.dashBoardCtrl').controller('dashBoardTestimonialsController', [
    '$scope', 'dashBoardTestimonialService', function($scope, dashBoardTestimonialService) {
      var offset;
      $scope.$on('$viewContentLoaded', function() {});
      $scope.testimonials = [];
      offset = 0;
      $scope.openModal = function(id, modalType) {
        var index;
        if (_.isNull(id) && modalType === 'new_testimonial') {
          $scope.modalType = 'new_testimonial';
        } else {
          index = _.findIndex($scope.testimonials, {
            id: id
          });
          $scope.tempData = $scope.testimonials[index];
          $scope.modalType = 'update_testimonial';
        }
        return $('#testimonialModal').openModal();
      };
      $scope.fetchTestimonials = function(offset) {
        if (offset === 0) {
          $scope.testimonials = [];
        }
        return dashBoardTestimonialService.fetchTestimonials(offset).then(function(data) {
          var response;
          if (data.status === 204) {
            return Materialize.toast('No testimonials to load', 4000);
          } else {
            response = data.data;
            return $scope.testimonials = response.results;
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.updateTestimonial = function() {
        var index;
        index = _.findIndex($scope.testimonials, {
          id: $scope.tempData.id
        });
        console.log($scope.tempData);
        return dashBoardTestimonialService.updateTestimonial($scope.tempData).then(function(data) {
          var response;
          response = data.data;
          if (response.status === 'Success') {
            $scope.testimonials[index] = {
              testimonial: $scope.tempData.testimonial,
              testifier_name: $scope.tempData.testifier_name,
              testifier_designation: $scope.tempData.testifier_designation,
              testifier_company_name: $scope.tempData.testifier_company_name
            };
            $scope.tempData = {};
            return Materialize.toast(response.status + " - " + response.message, 4000);
          } else {
            return Materialize.toast(response.status + " - " + response.message, 4000);
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.loadMore = function() {
        offset = $scope.testimonials.length;
        return $scope.fetchTestimonials(offset);
      };
      return $scope.uploadTestimonial = function() {
        var new_testimonial_data;
        new_testimonial_data = $scope.new_testimonial;
        if (_.isUndefined(new_testimonial_data.show_on_site)) {
          new_testimonial_data.show_on_site = false;
        }
        return dashBoardTestimonialService.uploadTestimonial(new_testimonial_data).then(function(data) {
          var response;
          response = data.data;
          if (response.status === 'Success') {
            $scope.testimonials.unshift({
              id: response.id,
              testimonial: new_testimonial_data.testimonial,
              testifier_name: new_testimonial_data.testifier_name,
              testifier_designation: new_testimonial_data.testifier_designation,
              testifier_company_name: new_testimonial_data.testifier_company_name,
              show_on_site: new_testimonial_data.show_on_site
            });
            $scope.new_testimonial = angular.copy({});
            return Materialize.toast(response.status + " - " + response.message, 4000);
          } else {
            return Materialize.toast(response.status + " - " + response.message, 4000);
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
    }
  ]);

}).call(this);
