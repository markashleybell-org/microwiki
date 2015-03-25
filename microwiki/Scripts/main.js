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
        var result = prompt('Are you sure you want to delete this page?\n\nLike, REALLY, TOTALLY, COMPLETELY SURE?\n\nType YES into the box below and click OK to confirm.\n', 'NO');
        return (result === 'YES');
    });

    $('.delete-upload').on('click', function (e) {
        var result = prompt('Are you sure you want to delete this file?\n\nLike, REALLY, TOTALLY, COMPLETELY SURE?\n\nType YES into the box below and click OK to confirm.\n', 'NO');
        return (result === 'YES');
    });
});

$('body').on('load', prettyPrint());