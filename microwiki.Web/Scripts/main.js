function ajaxPostRequest(requestUrl, postData, successCallback, errorCallback) {

    $.ajax({
        url: requestUrl,
        dataType: 'json',
        data: postData,
        type: 'post',
        success: successCallback,
        error: errorCallback
    });

}

function genericErrorCallback(request, status, error) {

    alert('Error loading page data! Error: ' + error);

}

$(function () {

    $('.edit-link').bind('click', function (event) {

        event.preventDefault();

        var url = $(this).attr('href').substring(1);

        ajaxPostRequest('/get',
                        {
                            location: url
                        },
                        function (data, status, request) {

                            var form = '<form action="/update" method="post" id="edit-form">' +
                                           '<p><input name="title" type="text" value="' + data.title + '" /></p>' +
                                           '<p><textarea name="body">' + data.body + '</textarea></p>' +
                                           '<p><input type="hidden" name="location" value="' + location + '" />' +
                                           '<input type="submit" value="Save" /></p>' +
                                       '</form>';

                            $('#content').html(form);

                        },
                        genericErrorCallback);

    });

    $('#edit-form').live('submit', function (event) {

        event.preventDefault();

        ajaxPostRequest('/update',
                        {
                            title: $('#edit-form input[name=title]').val(),
                            location: $('#edit-form input[name=location]').val(),
                            body: $('#edit-form textarea[name=body]').val()
                        },
                        function (data, status, request) {

                            $('#page-title').html(data.updatedTitle);
                            $('#content').html(data.updatedBody);

                        },
                        genericErrorCallback);

    });

    $('.add-link').bind('click', function (event) {

        event.preventDefault();

        var location = $(this).attr('href').substring(1);

        var form = '<form action="/insert" method="post" id="add-form">' +
                        '<p><input name="title" type="text" value="" /></p>' +
                        '<p>/<input name="location" type="text" value="' + location + '" /></p>' +
                        '<p><textarea name="body"></textarea></p>' +
                        '<p><input name="redirect" type="checkbox" value="1" /> </p>' +
                        '<p><input type="submit" value="Save" /></p>' +
                    '</form>';

        $('#content').html(form);

    });

    $('#add-form').live('submit', function (event) {

        // If the checkbox is checked, just post to the add action and redirect to the page afterwards
        if ($('#add-form input[name=redirect]').is(':checked'))
            return true;
        
        event.preventDefault();

        ajaxPostRequest('/insert',
                        {
                            title: $('#add-form input[name=title]').val(),
                            location: $('#add-form input[name=location]').val(),
                            body: $('#add-form textarea[name=body]').val()
                        },
                        function (data, status, request) {

                            // Update the sub-pages menu here

                        },
                        genericErrorCallback);

    });

});