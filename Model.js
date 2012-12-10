exports = window.lynchburg;
(function ()
{
    "use strict";

    function load(privateAttributes, data)
    {
        var type,
            value;
        for (var attribute in data)
        {
            if (typeof privateAttributes[attribute] === 'undefined')
            {
                continue;
            }
            type = this.definitions[attribute] ? this.definitions[attribute]['type'] : 'string';
            value = data[attribute];
            if (type === 'integer')
            {
                value = parseInt(value, 10);
            }
            privateAttributes[attribute]['value'] = value;
        }
    }

    function attributeGetterSetter(type, attribute, name)
    {
        // Integer getter setter
        if (type === 'integer')
        {
            return function (val)
            {
                if (typeof val === 'undefined')
                {
                    return attribute['value'];
                }
                if (typeof val === 'boolean')
                {
                    attribute['value'] = +val;
                }
                else
                {
                    attribute['value'] = parseInt(val, 10);
                }
                attribute['hasChanged'] = true;
            }
        }
        // String getter setter
        else
        {
            return function (val)
            {
                if (typeof val === 'undefined')
                {
                    return attribute['value'];
                }
                attribute['value'] = val;
                attribute['hasChanged'] = true;
            }
        }
    }

    function createAttributes()
    {
        var attributes = {},
            attribute,
            type,
            defaultValue,
            attrDef;

        for (attribute in this.definitions)
        {
            type = this.definitions[attribute]['type'];
            defaultValue = this.definitions[attribute]['defaultValue'];
            attrDef = {
                value:     defaultValue,
                hasChanged:false
            };
            attributes[attribute] = attrDef;
            this.attributes[attribute] = attributeGetterSetter.call(this, type, attrDef, attribute);
        }

        this.hasChanged = function (attribute)
        {
            if (typeof attributes[attribute] === 'undefined')
            {
                for (var i in attributes)
                {
                    if (attributes[i].hasChanged)
                    {
                        return true;
                    }
                }
                return false;
            }
            else
            {
                return attributes[attribute].hasChanged;
            }
        };
        return attributes;
    }

    exports.Model = exports.Component.inherit({
        construct:function (attributes)
        {
            this.attributes = {};
            this.relations = {};
            this.newRecord = true;
            this.errors = {};
            this.id = null;

            var privateAttributes = createAttributes.call(this);
            if (typeof attributes === 'object')
            {
                this.id = parseInt(attributes.id, 10);
                this.newRecord = false;
                load.call(this, privateAttributes, attributes);
                if (typeof this.populateRelations === 'function')
                {
                    this.populateRelations(attributes);
                }
            }
        },

        validate:function (attributes)
        {
            var errors = {},
                Validator = lynchburg.Validator,
                attributes = attributes || Object.keys(this.definitions);

            for (var i = 0, l = attributes.length; i < l; i++)
            {
                var attribute = attributes[i],
                    validators = this.definitions[attribute] && this.definitions[attribute]['validators'] || null,
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

        attribute:function (name, value)
        {
            if (typeof this.attributes[name] === 'undefined')
            {
                return undefined;
            }
            return this.attributes[name](value);
        },

        setAttribute:function (name, value)
        {
            this.attribute(name, value);
        },

        getAttribute:function (name)
        {
            return this.attribute(name);
        },

        getUpdatedAttributes:function ()
        {
            var attribute,
                updatedAttributes = {};
            for (attribute in this.definitions)
            {
                if (this.hasChanged(attribute))
                {
                    updatedAttributes[attribute] = this.attribute(attribute);
                }
            }

            return updatedAttributes;
        },

        getAttributes:function (attributes)
        {
            attributes = attributes || Object.keys(this.definitions);
            var result = {};
            for (var attr in this.definitions)
            {
                if ($.inArray(attr, attributes) === -1)
                {
                    continue;
                }
                result[attr] = this.attributes[attr]();
            }
            result.id = this.id;
            return result;
        },

        setAttributes:function (attributes)
        {
            for (var attribute in attributes)
            {
                this.setAttribute(attribute, attributes[attribute]);
            }
            return this;
        },

        duplicate:function ()
        {
            var addRelation = function (name, attributes, collection)
            {
                var data = collection.all(),
                    relations = [],
                    relation,
                    i,
                    j,
                    object,
                    objectRelations;
                for (i in data)
                {
                    object = data[i];
                    relation = object.getAttributes();
                    for (j in object.relations)
                    {
                        objectRelations = object.relations[j];
                        if (typeof objectRelations.all === 'function')
                        {
                            addRelation(j, relation, objectRelations);
                        }
                        else
                        {
                            relation[j] = objectRelations.getAttributes();
                        }
                    }
                    relations.push(relation);
                }
                attributes[name] = relations;
            };
            var attributes = this.getAttributes();
            for (var index in this.relations)
            {
                if (typeof this.relations[index].all === 'function')
                {
                    addRelation(index, attributes, this.relations[index]);
                }
                else
                {
                    attributes[index] = this.relations[index].getAttributes();
                }

            }
            return this.create(attributes);
        },

        toJSON:function ()
        {
            return (this.getAttributes());
        },

        save:    function (callback, attributes)
        {
            var data;
            if ($.isArray(attributes))
            {
                data = this.getAttributes(attributes);
            }
            else
            {
                data = this.getUpdatedAttributes();
            }
            return this.createRemote(data, callback);
        },
        /**
         * @param callback
         * @param attributes
         * @return {*}
         */
        update:  function (callback, attributes)
        {
            var data;
            if ($.isArray(attributes))
            {
                data = this.getAttributes(attributes);
            }
            else
            {
                data = this.getUpdatedAttributes();
            }
            // TODO: add model.GetId() which returns this, so we can override that if needed to return different keyID
            data['id'] = this.attributes.id();
            return this.updateRemote(this.attribute('id'), data, callback);
        },
        refresh: function (callback)
        {
            return this.loadRemote(this.attribute('id'), callback);
        },
        'delete':function (callback)
        {
            this.deleteRemote(this.attribute('id'), callback);
        }
    });

    lynchburg.Model.extend({
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
