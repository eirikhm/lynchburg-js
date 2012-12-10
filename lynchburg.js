window.lynchburg = {
    version:0.1,
    provide:function(namespace)
    {
        var split = namespace.split("."),
            i= 1,
            length = split.length,
            path = window[split[0]] || {};
        window[split[0]] = path;
        for(;i<length;i++)
        {
            if(typeof path[split[i]] === 'undefined')
            {
                path[split[i]] = {};
            }
            path = path[split[i]];
        }
    }
};