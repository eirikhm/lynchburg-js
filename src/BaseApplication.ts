/// <reference path="jquery.d.ts" />
class BaseApplication
{
    public loadTemplates(url : String, callback : () => any)
    {
        var templates : any = {},
            templateId : String  = '',
            templateMarkup :string = '';
        $.get(url, function (data)
        {
            $(data).each(function (index : number, element : any)
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
}