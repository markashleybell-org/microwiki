$(document).on('change', '.btn-file :file', function () {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
});

$(function () {
    if ($('#wmd-input').length) {
        var converter = new Markdown.Converter();
        //    converter.hooks.chain("preConversion", function (text) {
        //        return text.replace(/\b(a\w*)/gi, "*$1*");
        //    });
        //    converter.hooks.chain("plainLinkText", function (url) {
        //        return "This is a link to " + url.replace(/^https?:\/\//, "");
        //    });
        var help = function () { alert("Do you need help?"); };
        var editor = new Markdown.Editor(converter);
        //editor.hooks.set("insertImageDialog", function (callback) {
        //    // Open upload/browse dialog and return 
        //    // callback(null); once an image has been selected
        //    return true; // tell the editor that we'll take care of getting the image url
        //});
        editor.run();
    }

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

    $('.delete-page').on('click', function (e) {
        var result = prompt('Are you sure you want to delete this page and all of its ancestors?\n\nLike, REALLY, TOTALLY, COMPLETELY SURE?\n\nType YES into the box below and click OK to confirm.\n', 'NO');
        return (result === 'YES');
    });

    $('.delete-upload').on('click', function (e) {
        var result = prompt('Are you sure you want to delete this file?\n\nLike, REALLY, TOTALLY, COMPLETELY SURE?\n\nType YES into the box below and click OK to confirm.\n', 'NO');
        return (result === 'YES');
    });

    // This code (and corresponding CSS) stolen from:
    // http://www.abeautifulsite.net/whipping-file-inputs-into-shape-with-bootstrap-3/
    $('.btn-file :file').on('fileselect', function (event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;
        if (input.length) {
            input.val(log);
        } 
    });
});

$('body').on('load', prettyPrint());