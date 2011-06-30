$(function () {

    $('.edit-link').bind('click', function (event) {

        event.preventDefault();

        var location = $(this).attr('href').substring(1);

        $.ajax({
            url: '/get',
            dataType: 'json',
            data: {
                url: location
            },
            type: 'post',
            success: function (data, status, request) {

                var form = '<form action="/update" method="post" id="edit-form">' +
                               '<p><textarea name="body">' + data.body + '</textarea></p>' +
                               '<p><input type="hidden" name="url" value="' + location + '" />' + 
                               '<input type="submit" value="Save" /></p>' +
                           '</form>';

                $('#content').html(form);

            },
            error: function (request, status, error) {

                alert('Error loading page data!');

            }
        });

    });

    $('#edit-form').live('submit', function (event) {

        event.preventDefault();

        $.ajax({
            url: '/update',
            dataType: 'json',
            data: {
                url: $('#edit-form textarea[name=url]').val(),
                body: $('#edit-form textarea[name=body]').val()
            },
            type: 'post',
            success: function (data, status, request) {

                $('#content').html(data.update);

            },
            error: function (request, status, error) {

                alert('Error loading page data!');

            }
        });

    });

});