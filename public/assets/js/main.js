function get(method, params, success, failure) {
  $.ajax({
    url: method,
    type: 'GET',
    data: params,
    headers: {ajax:true},
    async: true,
    cache: false,
    statusCode: {
      401: function() {
        window.location = '/login';
      }
    },
    success: function (data, textStatus, xhr) {
      success(data);
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error(errorThrown);
      failure(errorThrown);
    }
  });
}

function post(method, params, success, failure) {
  // Workaround for table selections
  if (typeof checkedRows !== 'undefined' && params.constructor === Array) {
    console.log('Will append to params: ', checkedRows);
    params.push({'name':'checkedRows', 'value':JSON.stringify(checkedRows)});
  }
  // Send data
  $.ajax({
    url: method,
    type: 'POST',
    data: params,
    headers: {ajax:true},
    async: false,
    cache: false,
    statusCode: {
      401: function() {
        window.location = '/login';
      }
    },
    success: function (data, textStatus, xhr) {
      success(data);
    },
    error: function (xhr, textStatus, errorThrown) {
       console.log(textStatus);
       console.log(errorThrown);
       failure(errorThrown);
     }
  });
}

function postForm(formId, apiMethod, callback) {
  if (typeof formId !== 'undefined' && typeof apiMethod !== 'undefined') {
    var form = $(formId);
    var params = form.serializeArray();
    post(apiMethod,  params,
    function(data) {
      if (typeof callback !== 'undefined') {
        if (typeof callback === 'function') {
          callback(data);
        } else if (typeof callback === 'string') {
          window.location.assign(callback);
        }
      }
    },
    function(error) {
      console.log(error);
    });
  } else {
    console.error('Form/Method undefined.');
  }
}
