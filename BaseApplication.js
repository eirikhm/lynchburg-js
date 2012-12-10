var exports = window.lynchburg;
(function ()
{
    "use strict";
    exports.BaseApplication = exports.Component.inherit({
        loadTemplates:function (url, callback)
        {
            var templates = {},
                templateId = null,
                templateMarkup = null;
            $.get(url, function (data)
            {
                $(data).each(function (index, element)
                {
                    if (element.nodeName == 'SCRIPT')
                    {
                        templateId = element.id;
                        templateMarkup = $(element).html();
                        templates[templateId] = templateMarkup;
                    }
                });
                $.templates(templates); // compiles templates into jsrender.
                if (typeof callback === 'function')
                {
                    callback();
                }
            });
        }
    });
}());