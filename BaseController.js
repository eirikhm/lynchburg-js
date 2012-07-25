var exports = window.lynchburg;
(function ()
{
    "use strict";
    var eventSplitterRegex = /^(\w+)\s*(.*)$/;

    exports.BaseController = exports.Component.inherit({
        controllers:{},
        construct:  function (params)
        {
            //console.trace();
            this.setupControllerData(params);
        },

        setupControllerData:function (options)
        {
            this.options = options || {};

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
                this.intializeElements();
            }
        },

        init:function ()
        {
            var self = this;
            this.invokeParent('init', arguments);

            /**
             * TODO: This should definately not be a part of the Lynchburg core classes. We should subclass BaseController
             * and let this logic live in that.
             *
             */

            //            this.el.live('pagebeforeshow', function (event, data)
            //            {
            //                console.log('Got pageshow event', data);
            //                if (typeof self.activate === 'function')
            //                {
            //                    console.log(self.el, ' is being shown, calling activate');
            //                    self.activate();
            //                }
            //            });
            this.el.live('pagehide', function (event, data)
            {
                console.log('Got pagehide event', data);
                if (typeof self.deactivate === 'function')
                {
                    self.deactivate();
                }
            });
            this.el.live('pagecreate', function (event, data)
            {
                console.log('Got pagecreate event', data);
                if (typeof self.activate === 'function')
                {
                    self.activate();
                }
            });
        },

        activate:  function ()
        {
            //console.log('BaseController::activate');
        },

        deactivate:function ()
        {
            //console.log('BaseController::deactivate');
        },

        $:function (selector)
        {
            return $(selector, this.el);
        },

        intializeElements:function (forceRefresh)
        {
            forceRefresh = forceRefresh || false;
            for (var i in this.elements)
            {
                var element = this.elements[i];
                if (forceRefresh || typeof this[element] === 'undefined' || this[element].length === 0)
                {
                    this[element] = this.$(this.selectors[element]);
                }
            }
        },

        delegateEvents:function ()
        {
            for (var key in this.events)
            {
                var methodName = this.events[key],
                    method = this.proxy(this[methodName]),

                    match = key.match(eventSplitterRegex),
                    eventName = match[1], selector = match[2];

                if
                    (selector === '')
                {
                    this.el.bind(eventName, method);
                }
                else
                {
                    this.el.delegate(selector, eventName, method);
                }
            }
        },

        proxy:function (func)
        {
            return $.proxy(func, this);
        },

        registerController:function (name, params)
        {
            var self = this,
                params = params || {},
                controllerName = name.charAt(0).toUpperCase() + name.slice(1) + 'Controller',
                controller;
            if (window[controllerName])
            {
                controller = window[controllerName].create(params);
                this.controllers[name] = controller;
            }
            return controller;
        }
    });
    exports.BaseController.extend(lynchburg.Events);
}());