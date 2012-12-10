var exports = window.lynchburg;
(function ()
{
    "use strict";
    var eventSplitterRegex = /^(\w+)\s*(.*)$/;

    exports.BaseController = exports.Component.inherit({
        construct:  function (params)
        {
            this.controllers = {};
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
        buildPage:          function ()
        {
            var self = this;
            this.ensurePageRendered();

            this.el = $(this.el.selector);
            this.intializeElements(true);
            this.populate();
            this.delegateEvents();

            this.el.off('pagehide').on('pagehide', function (event, data)
            {
                if (typeof self.deactivate === 'function')
                {
                    self.deactivate();
                }
            });
        },

        activate:function (pageOptions)
        {
            this.trigger('activate');
            this.buildPage();
            this.show(pageOptions);
            this.trigger('activated');
        },

        ensurePageRendered:function ()
        {
            if (this.template && $(this.el.selector).length <= 0)
            {
                this.render({});
            }
        },

        // abstract method
        show:              function (pageOptions)
        {
            console.log('BaseController::show');
        },

        // abstract method
        populate:          function ()
        {

        },

        render:function (params)
        {
            params = params || {};
            /*var placeHolderId = '__placeholder_' + this.template;
             $('body').append('<div id="' + placeHolderId + '"></div>');
             $.link[this.template]('#' + placeHolderId, params, {target:'replace'});*/
            $('body').append($.render[this.template](params, {link:false}));
        },

        renderAndLink:function (params, target)
        {
            params = params || {};

            if (target == undefined)
            {
                var placeHolderId = '__placeholder_' + this.template;
                $('body').append('<div id="' + placeHolderId + '"></div>');
                $.link[this.template]('#' + placeHolderId, params, {target:'replace'});
            }
            else
            {
                $.link[this.template](target, params);
            }
        },

        deactivate:function ()
        {
            this.trigger('deactivate');
            this.el.off('pagehide');

            this.el.unlink();
            if (this.el.length > 0)
            {
                this.el.remove();
            }
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
                    this.el.unbind(eventName, method).bind(eventName, method);
                }
                else
                {
                    this.el.undelegate(selector, eventName).delegate(selector, eventName, method);
                }
            }
        },

        proxy:                     function (func)
        {
            return $.proxy(func, this);
        },

        // TODO: Bug here
        changePage:                function (cName, pageOptions)
        {
            var controller = this.getController(cName, {});
            controller.activate(pageOptions);
        },

        // use this to register a controller. checks that views are loaded, and returns early if the controller is already loaded
        getController:          function (shortName, params)
        {
            params = params || {};
            var controllerName = this.buildControllerClassName(shortName);
            var controller = null;

            if (!this.isControllerCreated(shortName))
            {
                controller = this.registerControllerInternal(shortName, controllerName, params);
            }
            else
            {
                controller = this.controllers[shortName];
            }
            return controller;
        },

        // instantiates a controller and adds it to the internal controller map
        registerControllerInternal:function (shortName, controllerName, params)
        {
            var params = params || {},
                controller;
            if (!straks.controllers[controllerName])
            {
                throw "Controller " + controllerName + " is not defined.";
            }

            //TODO: fix namespace access for controller (straks.controllers.Home)
            controller = straks.controllers[controllerName].create(params);
            this.controllers[shortName] = controller;
            return controller;
        },

        // builds the actual class name for a controller short name
        buildControllerClassName:  function (name)
        {
            return name.charAt(0).toUpperCase() + name.slice(1);
        },

        // checks if controller is instantiated.
        isControllerCreated:       function (controllerName)
        {
            return typeof this.controllers[controllerName] === 'object';
        },

        // checks if EL in controller exists in DOM. Could also store this state in controller, but we might want to delete pages on hide to save memory.
        isViewLoadedForController: function (controllerName)
        {
            if (!straks.controllers[controllerName].hasOwnProperty('viewFile') || $(straks.controllers[controllerName]['el']).length > 0)
            {
                return true;
            }
            return false;
        }
    });
    exports.BaseController.extend(lynchburg.Events);
}());