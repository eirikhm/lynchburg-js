var exports = window.lynchburg;
(function ()
{
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var validators = {
        required:function (attribute, value, params)
        {
            if (value)
            {
                return true;
            }
            return lynchburg.t("{attribute} is a required field",{'{attribute}':attribute});
        },
        boolean: function (attribute, value, params)
        {
            if (typeof value === 'boolean')
            {
                return true;
            }
            return lynchburg.t("{attribute} must be a boolean value",{'{attribute}':attribute});
        },
        email:   function (attribute,value, params)
        {
            if (emailRegex.test(value))
            {
                return true;
            }
            return lynchburg.t("{attribute} is not a valid email address",{'{attribute}':attribute});
        },
        numerical:  function (attribute, value, params)
        {
            var intValue = parseInt(value),
                message;

            /*
            // This breaks on save item for some reason..
            if (intValue + "" !== value)
            {
                return lynchburg.t("{attribute} must be numeric",{'{attribute}':attribute});
            }
            */
            if (params['min'] && params['max'])
            {
                message = lynchburg.t("{attribute} is must be between {min} and {max}",{'{attribute}':attribute, '{min}':params['min'], '{max}':params['max']});
                return intValue >= params['min'] && intValue <= params['max'] ? true : message;
            }
            else if (params['min'])
            {
                message = lynchburg.t("{attribute} is must be equal or greater than {min}",{'{attribute}':attribute, '{min}':params['min']});
                return intValue >= params['min'] ? true : message;
            }
            else if (params['max'])
            {
                message = lynchburg.t("{attribute} is must be equal or less than {max}",{'{attribute}':attribute, '{max}':params['max']});
                return intValue <= params['max'] ? true : message;
            }
            return true;
        },
        length:function(attribute, value, params)
        {
            // todo
            return true;
        }
    };

    var that = {
        validators:validators,
        validate:  function (model, attribute, rules)
        {
            var value = model.getAttribute(attribute),
                result,
                errors = [];

            for (var validator in rules)
            {
                var params = rules[validator];
                if (typeof params !== 'object')
                {
                    params = {};
                }
                if (validators.hasOwnProperty(validator))
                {
                    result = validators[validator](attribute,value, params);
                }
                else if (model.parent.hasOwnProperty(validator))
                {
                    result = model.parent[validator](attribute,value, params);
                }
                else
                {
                    throw new Error('Unknown validator ' + validator);
                }

                if (result !== true)
                {
                    errors.push(result);
                }
            }
            return errors;
        }
    };
    exports.Validator = that
}());