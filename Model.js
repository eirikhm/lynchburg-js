exports = window.lynchburg;
(function ()
{
    "use strict";
    exports.Model = exports.Component.inherit({
        beforeInit:function (atts)
        {
            // These end up in prototype if not instantied during creation
            // which means they share state between instances after next inheritance
            this.newRecord = true;
            this.attributes = {};
            this.errors = {};
            if (atts)
            {
                this.id = atts.id;
                this.load(atts);
            }
        },

        validate:function (attributes)
        {
            var errors = {},
                Validator = lynchburg.Validator,
                attributes = attributes || Object.keys(this.attributes);

            for (var i = 0, l = attributes.length; i < l; i++)
            {
                var attribute = attributes[i],
                    validators = this.rules[attribute] && this.rules[attribute]['validators']||null,
                    error;

                if (typeof validators !== 'object')
                {
                    continue;
                }
                error = Validator.validate(this, attribute, validators);
                if (error.length > 0)
                {
                    errors[attribute] = error;
                }
            }
            this.errors = errors;
            return Object.keys(errors).length == 0;
        },

        load:         function (attributes)
        {
            this.newRecord = false;
            for (var name in attributes)
            {
                this.setAttribute(name, attributes[name]);
            }
        },
        attribute:    function (name, value)
        {
            var attribute = this.attributes[name];
            if (!attribute)
            {
                throw Error('No such attribute ' + name);
            }
            if (typeof value === 'undefined')
            {
                return attribute;
            }
            attribute = value;
            this.attributes[name] = attribute;
        },
        setAttribute: function (name, value)
        {
            var attribute = this.attributes[name] || {};
            attribute = value;
            this.attributes[name] = attribute;
        },
        getAttribute: function (name)
        {
            var attribute = this.attributes[name] || {};
            return attribute;
        },
        getAttributes:function (attributes)
        {
            return this.attributes;
            // add support for getting only sent in attributes
            var result = {};

            for (var attr in this.attributes)
            {
                //var attr = this.parent.attributes[i];
                result[attr] = this[attr];
            }

            result.id = this.id;
            return result;
        },
        setAttributes:function (attributes)
        {
            for(var attribute in attributes)
            {
                this.setAttribute(attribute, attributes[attribute]);
            }
        },

        trigger:function (channel)
        {
            this.parent.trigger(channel, this);
        },

        //        destroy:function ()
        //        {
        //            this.trigger("beforeDestroy");
        //            delete this.parent.records[this.id];
        //            this.trigger("afterDestroy");
        //            this.trigger("destroy");
        //        },

        dup:function ()
        {
            return jQuery.extend(true, {}, this);
        },

        //        addToCollection:function ()
        //        {
        //            // fix diff
        //            this.trigger("beforeSave");
        //            this.newRecord ? this.create() : this.update();
        //            this.trigger("afterSave");
        //            this.trigger("save");
        //
        //            this.trigger("beforeUpdate");
        //            this.parent.records[this.id] = this.dup();
        //            this.trigger("afterUpdate");
        //            this.trigger("update");
        //
        //            this.trigger("beforeCreate", this);
        //            this.newRecord = false;
        //            this.parent.records[this.id] = this.dup();
        //            this.trigger("afterCreate", this);
        //            this.trigger("create", this);
        //        },

        properties:function ()
        {
            var result = [];
            for (var attr in this.parent.attributes)
            {
                //var attr = this.parent.attributes[i];
                result.push(attr);
            }
            result.push('id');
            return result;
        },

        toJSON:function ()
        {
            return (this.attributes);
        },

        save:   function (callback, attributes)
        {
            return this.parent.createRemote(this.getAttributes(attributes), callback);
        },
        update: function (callback, attributes)
        {
            return this.parent.updateRemote(this.getAttribute('id'), this.getAttributes(attributes), callback);
        },
        refresh:function (callback)
        {
            return this.parent.loadRemote(this.getAttribute('id'), callback);
        },
        delete: function (callback)
        {
            this.parent.deleteRemote(this.getAttribute('id'), callback);
        }
    });

    lynchburg.Model.extend({
        created:function ()
        {
            this.records = {};
            this.attributes = {};
            this.rules = [];
            this.errors = [];
        },

        saveLocal:function (name)
        {
            var result = [];
            for (var i in this.records)
            {
                result.push(this.records[i].attributes());
            }
            localStorage[name] = JSON.stringify(result);
        },

        loadLocal:   function (name)
        {
            if (localStorage[name])
            {
                var result = JSON.parse(localStorage[name]);
                this.populate(result);
            }
        },
        createRemote:function (attributes, callback)
        {
        },
        updateRemote:function (id, attributes, callback)
        {
        },
        loadRemote:  function (id, callback)
        {
        },
        deleteRemote:function (id, callback)
        {
        }
    });

    lynchburg.Model.extend(lynchburg.Events);
}());