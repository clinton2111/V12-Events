(function() {
  angular.module('V12Admin.dashBoardCtrl').controller('dashBoardTestimonialsController', [
    '$scope', 'dashBoardTestimonialService', function($scope, dashBoardTestimonialService) {
      var offset;
      $scope.$on('$viewContentLoaded', function() {});
      $scope.testimonials = [];
      offset = 0;
      $scope.openModal = function(id, modalType) {
        var index, temp;
        if (_.isNull(id) && modalType === 'new_testimonial') {
          return $('#new_testimonial_modal').openModal();
        } else {
          index = _.findIndex($scope.testimonials, {
            id: id
          });
          temp = $scope.testimonials[index];
          $scope.tempData = {
            id: temp.id,
            testimonial: temp.testimonial,
            testifier_name: temp.testifier_name,
            testifier_designation: temp.testifier_designation,
            testifier_company_name: temp.testifier_company_name
          };
          return $('#update_testimonial_modal').openModal();
        }
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
            if ($scope.testimonials.length === 0) {
              return $scope.testimonials = response.results;
            } else {
              return _.each(response.results, function(index) {
                return $scope.testimonials.push(index);
              });
            }
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.updateTestimonial = function(id) {
        var index;
        index = _.findIndex($scope.testimonials, {
          id: id
        });
        return dashBoardTestimonialService.updateTestimonial($scope.tempData).then(function(data) {
          var response, show_on_site;
          response = data.data;
          if (response.status === 'Success') {
            show_on_site = $scope.testimonials[index].show_on_site;
            $scope.testimonials[index].testimonial = $scope.tempData.testimonial;
            $scope.testimonials[index].testifier_name = $scope.tempData.testifier_name;
            $scope.testimonials[index].testifier_designation = $scope.tempData.testifier_designation;
            $scope.testimonials[index].testifier_company_name = $scope.tempData.testifier_company_name;
            $scope.testimonials[index].show_on_site = show_on_site;
            $scope.tempData = {};
            Materialize.toast(response.status + " - " + response.message, 4000);
            return $('#update_testimonial_modal').closeModal();
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
      $scope.uploadTestimonial = function() {
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
            $('#new_testimonial_modal').closeModal();
            return Materialize.toast(response.status + " - " + response.message, 4000);
          } else {
            return Materialize.toast(response.status + " - " + response.message, 4000);
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.checkChecked = function(id) {
        var index, temp;
        index = _.findIndex($scope.testimonials, {
          id: id
        });
        temp = $scope.testimonials[index].show_on_site;
        if (temp === 1) {
          return 'checked';
        } else {
          return false;
        }
      };
      $scope.updateSoS = function(id) {
        var index, newSos, temp;
        index = _.findIndex($scope.testimonials, {
          id: id
        });
        temp = $scope.testimonials[index].show_on_site;
        if (temp === 1) {
          newSos = 0;
        } else {
          newSos = 1;
        }
        return dashBoardTestimonialService.updateShowOnSite({
          id: id,
          show_on_site: newSos
        }).then(function(data) {
          var response;
          response = data.data;
          if (response.status === 'Success') {
            return $scope.testimonials[index].show_on_site = newSos;
          } else {
            return console.log(response.status + " - " + response.message);
          }
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      $scope.deleteTestimonial = function(id) {
        var index;
        index = _.findIndex($scope.testimonials, {
          id: id
        });
        return dashBoardTestimonialService.deleteTestimonial(id).then(function(data) {
          var response;
          response = data.data;
          $scope.testimonials.splice(index, 1);
          return Materialize.toast(response.status + " - " + response.message, 4000);
        }, function(error) {
          return Materialize.toast('Something went wrong', 4000);
        });
      };
      return $scope.$watchCollection(['testimonials'], function() {
        return $scope.$apply;
      }, false);
    }
  ]);

}).call(this);
