(function ()
{
    function sprintf(string, args)
    {
        for(var i in args)
        {
            string = string.replace(i, args[i]);
        }
        return string;
    }

    lynchburg.t = function (message, replaces)
    {
        var message = sprintf(message, replaces);
        debug(message);
        return message;
    }
}());
