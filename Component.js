var exports = window.lynchburg;
(function ()
{
    "use strict";
    var parentCallCount = 0;
    exports.Component = {
        prototype: {},

        beforeInit:function ()
        {
            //console.log('Component::beforeInit', arguments);
        },

        created:   function ()
        {
            //console.log('Component::created', arguments);
        },

        construct: function ()
        {
            //console.log('Component::construct', arguments);
        },

        init:function ()
        {
            //console.log('Component::init', arguments);
        },

        invokeParent:function (funcName)
        {
            var result,
                self = this,
                target = this.parent,
                args = Array.prototype.slice.call(arguments);

            if (typeof target === 'undefined')
            {
                return undefined;
            }

            //            if (!this.hasOwnProperty(funcName))
            //            {
            //                // Localize the current function since it's not on the caller
            //                console.log('Not own property');
            //                while (!target.hasOwnProperty(funcName) && target.hasOwnProperty('parent'))
            //                {
            //                    target = target.parent;
            //                    console.log('Retrying property check with ', target);
            //                }
            //                target = target.parent;
            //            }

            for (var i = 0; i < parentCallCount; i++)
            {
                target = target.parent;
                if (typeof target === 'undefined')
                {
                    return undefined;
                }
            }
            if (typeof target === 'undefined')
            {
                return undefined;
            }
            parentCallCount++;
            result = target[funcName].apply(self, args.slice(1));
            parentCallCount--;
            return result;
        },

        /**
         * Extend the actual class
         *
         * @param params
         */
        extend:      function (params)
        {
            var extended = params.extended;
            jQuery.extend(this, params);
            if (typeof extended === 'function')
            {
                extended(this);
            }
        },

        /**
         * Extend instance
         *
         * @param params
         */
        include:     function (params)
        {
            var included = params.included;
            jQuery.extend(this.prototype, params);
            if (typeof included === 'function')
            {
                included(this);
            }
        },

        /**
         * Return new object inherited from Component
         *
         * @param includes
         * @return {*}
         */
        inherit:     function (includes)
        {
            //console.log('Component::inherit');
            var object = Object.create(this);

            object.create = function (params)
            {
                var result = Object.create(object),
                    params = params || {};
                result.beforeInit(params);
                result.construct(params);
                result.init();
                if (result.created === 'function')
                {
                    result.created();
                }
                return result;
            };

            object.prototype = object.fn = Object.create(this.prototype);
            object.parent = this;

            if (includes)
            {
                object.extend(includes);
            }

            if (typeof object.inherited === 'function')
            {
                object.inherited(this);
            }

            return object;
        }
    };
}());