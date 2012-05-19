var exports = window.lynchburg;
(function ()
{
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
            return params['message'] || "må være en boolean verdi"
        },
        email:   function (attribute,value, params)
        {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(value))
            {
                return true;
            }
            return params['message'] || "er ikke en gyldig epost-adresse";
        },
        number:  function (attribute, value, params)
        {
            var intValue = parseInt(value),
                message;

            if (intValue + "" !== value)
            {
                return "må være en numerisk verdi";
            }
            if (params['min'] && params['max'])
            {
                message = "må være mellom " + params['min'] + ' og ' + params['max'];
                return intValue >= params['min'] && intValue <= params['max'] ? true : message;
            }
            else if (params['min'])
            {
                message = 'må være større eller lik ' + params['min'];
                return intValue >= params['min'] ? true : message;
            }
            else if (params['max'])
            {
                message = 'må være mindre eller lik ' + params['max'];
                return intValue <= params['max'] ? true : message;
            }
            return true;
        }
    };

    var that = {
        validators:validators,
        validate:  function (model, attribute, rules)
        {
            var value = model[attribute],
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
                debug("Validating ", attribute, value, validator);

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