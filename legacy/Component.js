var exports = window.lynchburg;
(function ()
{
    "use strict";
    function invokeParent()
    {
        var prevPrototype;
        return function (name)
        {
            var result,
                prototype,
                args = Array.prototype.slice.call(arguments),
                debug = false;

            if (prevPrototype)
            {
                prototype = Object.getPrototypeOf(prevPrototype);
                if (debug)
                {
                    console.log('Got previous prototype, ', prototype);
                }
            }
            else if (this.hasOwnProperty(name))
            {
                prototype = Object.getPrototypeOf(this);
                if (debug)
                {
                    console.log('Started on prototype of this, ', prototype);
                }
            }
            else
            {
                // This is also needed for prevPrototype situation, so fix it
                prototype = Object.getPrototypeOf(this);
                if (debug)
                {
                    console.log('Finding prototype to start from part 1, ', prototype);
                }
                var i = 0;
                while (prototype && !prototype.hasOwnProperty(name))
                {
                    i++;
                    prototype = Object.getPrototypeOf(prototype);
                    if (debug)
                    {
                        console.log('Finding prototype to start from part 2, ', prototype);
                    }
                }
                prototype = Object.getPrototypeOf(prototype);
                if (debug)
                {
                    console.log('Finding prototype to start from part 3, ', prototype);
                }
            }
            if (debug)
            {
                console.log('Calling', name, prototype, args.slice(1));
            }

            // Keep a reference, so we know where to start the next level if it should be called
            prevPrototype = prototype;
            result = prototype[name].apply(this, args.slice(1));
            // terminate prevPrototype, as this is in the return section - keeps the next parent-call to start from scratch
            prevPrototype = undefined;
            return result;
        }
    }

    exports.Component = {
        /**
         * Extend the actual class
         *
         * @param params
         */
        extend:function (params)
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
        include:function (params)
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
        inherit:function (includes)
        {
            var object = Object.create(this);
            object.create = function ()
            {
                var result = Object.create(object);
                result.invokeParent = invokeParent.call(result);
                if (typeof result.construct === 'function')
                {
                    result.construct.apply(result, arguments);
                }
                return result;
            };

            if (typeof includes === 'object')
            {
                object.extend(includes);
            }

            return object;
        }
    };
}());