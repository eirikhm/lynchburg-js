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
        return sprintf(message, replaces);
    }
}());
