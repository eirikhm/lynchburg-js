/// <reference path="jquery.d.ts" />

class Validator {
    private emailRegex:any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    public static validate(model:Model, attribute:string, rules:any[])
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
            if (this.hasOwnProperty(validator))
            {
                result = this[validator](attribute, value, params);
            }
            else if (model.hasOwnProperty(validator))
            {
                result = model[validator](attribute, value, params);
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

    public static required(attribute:string, value:any, params:any)
    {
        if (typeof value === 'boolean' && value === false || value === 0)
        {
            return true;
        }
        if (value)
        {
            return true;
        }

        return lynchburg.t("{attribute} is a required field", {'{attribute}': attribute});
    }

    public static  boolean(attribute:string, value:any, params:any)
    {
        if (typeof value === 'boolean')
        {
            return true;
        }
        return lynchburg.t("{attribute} must be a boolean value", {'{attribute}': attribute});
    }

    public static email(attribute:string, value:any, params:any)
    {
        if (emailRegex.test(value))
        {
            return true;
        }
        return lynchburg.t("{attribute} is not a valid email address", {'{attribute}': attribute});
    }

    public static numerical(attribute:string, value:any, params:any)
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
            message = lynchburg.t("{attribute} is must be between {min} and {max}", {'{attribute}': attribute, '{min}': params['min'], '{max}': params['max']});
            return intValue >= params['min'] && intValue <= params['max'] ? true : message;
        }
        else if (params['min'])
        {
            message = lynchburg.t("{attribute} is must be equal or greater than {min}", {'{attribute}': attribute, '{min}': params['min']});
            return intValue >= params['min'] ? true : message;
        }
        else if (params['max'])
        {
            message = lynchburg.t("{attribute} is must be equal or less than {max}", {'{attribute}': attribute, '{max}': params['max']});
            return intValue <= params['max'] ? true : message;
        }
        return true;
    }

    public static length(attribute:string, value:any, params:any)
    {
        // todo
        return true;
    }
}
