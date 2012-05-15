var exports = this;

(function ($)
{
    var mod = {};

    mod.create = function (includes)
    {

        var result = function ()
        {
            this.beforeInit.apply(this, arguments);
            this.initializer.apply(this, arguments);
            this.init.apply(this, arguments);
        };

        result.fn = result.prototype;

        result.fn.init = function ()
        {
        };

        result.proxy = function (func)
        {
            return $.proxy(func, this);
        };

        result.fn.proxy = result.proxy;

        result.include = function (ob)
        {
            $.extend(this.fn, ob);
        };

        result.extend = function (ob)
        {
            $.extend(this, ob);
        };

        result.include({
            initializer:function (options)
            {
                this.options = options;

                for (var key in this.options)
                {
                    this[key] = this.options[key];
                }

                if (this.events)
                {
                    this.delegateEvents();
                }

                if (this.elements)
                {
                    this.refreshElements();
                }
            },
            beforeInit: function ()
            {

            },
            activate:   function ()
            {

            },
            deactivate: function ()
            {

            },
            $:          function (selector)
            {
                return $(selector, this.el);
            },

            refreshElements:function ()
            {
                for (var i in this.elements)
                {
                    var element = this.elements[i];
                    this[element] = this.$(this.selectors[element]);
                }
            },

            eventSplitter:/^(\w+)\s*(.*)$/,

            delegateEvents:function ()
            {
                for (var key in this.events)
                {

                    var methodName = this.events[key];
                    var method = this.proxy(this[methodName]);

                    var match = key.match(this.eventSplitter);
                    var eventName = match[1], selector = match[2];

                    if (selector === '')
                    {
                        this.el.bind(eventName, method);
                    }
                    else
                    {
                        this.el.delegate(selector, eventName, method);
                    }
                }
            }
        });

        if (includes)
        {
            result.include(includes);
        }
        return result;
    };

    exports.Controller = mod;
})(jQuery);