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
        //    alert("Please click okay to start scanning your brain...");
        //    setTimeout(function () {
        //        var prompt = "We have detected that you like cats. Do you want to insert an image of a cat?";
        //        if (confirm(prompt))
        //            callback("http://icanhascheezburger.files.wordpress.com/2007/06/schrodingers-lolcat1.jpg")
        //        else
        //            callback(null);
        //    }, 2000);
        //    return true; // tell the editor that we'll take care of getting the image url
        //});
        editor.run();
    }
});

$('body').on('load', prettyPrint());