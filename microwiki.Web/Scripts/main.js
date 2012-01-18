$(function () {

    var converter = new Markdown.Converter();

//    converter.hooks.chain("preConversion", function (text) {
//        return text.replace(/\b(a\w*)/gi, "*$1*");
//    });

//    converter.hooks.chain("plainLinkText", function (url) {
//        return "This is a link to " + url.replace(/^https?:\/\//, "");
//    });

    var help = function () { alert("Do you need help?"); }

    var editor = new Markdown.Editor(converter);

    editor.run();

    $('#delete-form').bind('submit', function () {

        return confirm('Are you sure you want to permanently delete this page?');

    });

});