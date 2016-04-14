angular.module 'V12Admin.dashBoardCtrl'
.controller 'dashBoardSettingsController', ['$scope', 'dashBoardSettingsService', 'md5','$auth',
	($scope, dashBoardSettingsService, md5,$auth)->
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
			console.log $scope.newEmail
			data=
				key:'website_mail_destination'
				value:$scope.newEmail
			dashBoardSettingsService.addEmail data
			.then (data)->
				response = data.data
				if response.status is 'Success'
					Materialize.toast response.status + " - " + response.message, 4000
				else
					Materialize.toast response.status + " - " + response.message, 4000
			, (error)->
				Materialize.toast('Something went wrong', 4000);
]