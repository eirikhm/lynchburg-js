if (typeof Object.create !== 'function')
{
    Object.create = function (o)
    {
        function F()
        {
        }

        F.prototype = o;
        return new F();
    };
}
if (typeof Object.getPrototypeOf !== "function")
{
    if (typeof "t".__proto__ === "object")
    {
        Object.getPrototypeOf = function (object)
        {
            return object.__proto__;
        };
    }
    else
    {
        Object.getPrototypeOf = function (object)
        {
            return object.constructor.prototype;
        };
    }
}
Math.guid = function ()
{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
        function (c)
        {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
};
var assert = function (value, msg)
{
    if (!value)
    {
        throw(msg || (value + ' does not equal true'));
    }
};

var assertEqual = function (val1, val2, msg)
{
    if (val1 !== val2)
    {
        throw(msg || (val1 + ' does not equal ' + val2));
    }
};

var debug = function ()
{
    if(window.console)
    {
        console.log(arguments);
    }
};
(function ($)
{
    $.fn.serializeJSON = function ()
    {
        var json = {};
        jQuery.map($(this).serializeArray(), function (n, i)
        {
            json[n['name']] = n['value'];
        });
        return json;
    };
})(jQuery);