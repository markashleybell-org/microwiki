$('#document-move-modal').on('click', 'a.document', function (e) {
    e.preventDefault();
    var link = $(this);
    $.ajax({
        url: '/wiki/move',
        data: { id: link.data('moveid'), parentID: link.data('documentid') },
        dataType: 'json',
        type: 'POST',
        success: function (data, status, request) {
            window.location.href = data.location;
        },
        error: function (request, status, error) {
        }
    });
});
