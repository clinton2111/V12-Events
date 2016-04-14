angular.module 'V12Admin.dashBoardCtrl'
.controller 'dashBoardSettingsController', ['$scope', 'dashBoardSettingsService', 'md5','$auth',
	($scope, dashBoardSettingsService, md5,$auth)->

		$scope.emails  = null;
		$scope.updatePassword = ()->
			if $scope.password.new != $scope.password.confirm then Materialize.toast('New password and confirmation password do not match',
				4000)
			else
				payload = $auth.getPayload()
				data =
					currentPassword: md5.createHash($scope.password.current || '')
					newPassword: md5.createHash($scope.password.new || '')
					id:payload.id
				dashBoardSettingsService.updatePassword(data)
				.then (data)->
					response = data.data
					if response.status is 'Success'
						Materialize.toast response.status + " - " + response.message, 4000
					else
						Materialize.toast response.status + " - " + response.message, 4000
				, (error)->
					Materialize.toast('Something went wrong', 4000);


		$scope.addEmail = ->
			data=
				key:'website_mail_destination'
				value:$scope.newEmail
			dashBoardSettingsService.addEmail data
			.then (data)->
				response = data.data
				if response.status is 'Success'
					if _.isNull($scope.emails)
						$scope.emails = 
							id:response.id
							key:'website_mail_destination'
							value:$scope.newEmail
					else
						$scope.emails.push
							id:response.id
							key:'website_mail_destination'
							value:$scope.newEmail
					Materialize.toast response.status + " - " + response.message, 4000
				else
					Materialize.toast response.status + " - " + response.message, 4000
			, (error)->
				Materialize.toast('Something went wrong', 4000);

		$scope.fetchEmail = ->
			dashBoardSettingsService.fetchEmail()
			.then (data)->
				response = data.data
				if response.status is 'Success'
					$scope.emails = response.results
					Materialize.toast response.status + " - " + response.message, 4000
				else
					Materialize.toast response.status + " - " + response.message, 4000
			, (error)->
				Materialize.toast('Something went wrong', 4000);

		$scope.deleteEmail=(id)->
			index = _.findIndex($scope.emails, {id: id});
			dashBoardSettingsService.deleteEmail(id)
			.then (data)->
				response = data.data
				if response.status is 'Success'
					$scope.emails.splice(index, 1);
					Materialize.toast response.status + " - " + response.message, 4000
				else
					Materialize.toast response.status + " - " + response.message, 4000
			, (error)->
				Materialize.toast('Something went wrong', 4000);



]

