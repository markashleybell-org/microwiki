$(function () {

    $('#delete-form').bind('submit', function () {

        return confirm('Are you sure you want to permanently delete this page?');

    });

});