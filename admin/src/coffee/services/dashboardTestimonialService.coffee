angular.module 'V12Admin.dashBoardCtrl'
.factory 'dashBoardTestimonialService', ['$http', '$q', 'API', ($http, $q, API)->
  return(

    fetchTestimonials: (offset)->
      q = $q.defer();
      $http
        url: API.url + 'testimonialHandler.php'
        data:
          'location': 'fetch_testimonials'
          'offset': offset
        method: 'post'
        cache: true
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

    uploadTestimonial: (data)->
      data.location = 'insert_testimonial'
      q = $q.defer();
      $http
        url: API.url + 'testimonialHandler.php'
        data: data
        method: 'POST'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

    updateTestimonial: (data)->
      data.location = 'update_testimonial'

      q = $q.defer();
      $http
        url: API.url + 'testimonialHandler.php'
        data: data
        method: 'post'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

    deleteTestimonial: (id)->
      data =
        location: 'delete_testimonial'
        id: id
      q = $q.defer();
      $http
        url: API.url + 'testimonialHandler.php'
        data: data
        method: 'post'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

    updateShowOnSite: (data)->
      data.location = 'update_show_on_site'
      q = $q.defer();
      $http
        url: API.url + 'testimonialHandler.php'
        data: data
        method: 'post'
      .then (data)->
        q.resolve data
      , (error)->
        q.reject(error)
      q.promise

  )
]