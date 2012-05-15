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

/**
 * @todo param timestamp is now a datetime string. is this what we want?
 * @param timestamp
 * @return {*}
 */
var fuzzyTime = function (timestamp)
{
    var now, received, timediff, hours, minutes, timestring, days, dateArray;

    dateArray = timestamp.split(/[\- :]/);
    now = new Date();
    received = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5]);
    timediff = now.getTime() - received.getTime();
    days = Math.floor(timediff / 86400000);
    hours = Math.floor(timediff / 3600000);
    minutes = Math.floor(timediff / 60000);

    if (hours <= 2 && hours > 0)
    {
        if (hours === 2)
        {
            timestring = t(' ca ') + hours + t(' timer siden');
        }
        else
        {
            timestring = t(' ca ') + hours + t(' time siden');
        }
    }
    else if (hours < 1 && minutes < 60)
    {
        if (minutes > 1)
        {
            timestring = minutes + t(' minutter siden');
        }
        else if (minutes > 0)
        {
            timestring = minutes + t(' minutt siden');
        }
        else
        {
            timestring = t(' Akkurat nå');
        }
    }
    else if (hours >= 24)
    {
        if (days === 1)
        {
            timestring = t(' ca ') + days + t(' dag siden');
        } else if (days === 2)
        {
            timestring = t(' ca ') + days + t(' dager siden');
        }
    }

    return timestring;
};

var debug = function ()
{
    if (window.console)
    {
        console.log(arguments);
    }
};