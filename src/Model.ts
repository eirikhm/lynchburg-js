/// <reference path="jquery.d.ts" />

class Model {
    private definitions = {};
    private attributes = {};
    private relations = {};
    private newRecord = true;
    private errors = {};
    private id = null;

    public construct(attributes:any)
    {
        if (typeof attributes === 'object')
        {
            this.id = attributes.id, 10;
            this.newRecord = false;
            this.attributes = attributes;
            this.populateRelations(attributes);
        }
    }

    public static saveLocal(name:string)
    {
        var result = [];
        for (var i in this.records)
        {
            result.push(this.records[i].attributes());
        }
        localStorage[name] = JSON.stringify(result);
    }

    public static loadLocal(name:string)
    {
        if (localStorage[name])
        {
            var result = JSON.parse(localStorage[name]);
            this.populate(result);
        }
    }

    public static createRemote(attributes:any[], callback:any)
    {
    }

    public static updateRemote(id:number, attributes:any[], callback)
    {
    }

    public static loadRemote(id:number, callback:any)
    {
    }

    public static deleteRemote(id:number, callback:any)
    {
    }

    public populateRelations(attributes:any)
    {

    }

    public validate(attributes:string[])
    {
        var errors = {},
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
    }

    public attribute(name:string, value?:any)
    {
        if (typeof this.attributes[name] === 'undefined')
        {
            return undefined;
        }
        return this.attributes[name](value);
    }

    public setAttribute(name:string, value:string)
    {
        this.attribute(name, value);
    }

    public getAttribute(name:string)
    {
        return this.attribute(name);
    }

    public getUpdatedAttributes()
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
    }

    public getAttributes(attributes?:string[])
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
        result['id'] = this.id;
        return result;
    }

    public setAttributes(attributes:string[])
    {
        for (var attribute in attributes)
        {
            this.setAttribute(attribute, attributes[attribute]);
        }
        return this;
    }

    public duplicate()
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

        // How do we solve this?
        return new (attributes);
    }

    public toJSON()
    {
        return (this.getAttributes());
    }

    public save(callback:any, attributes:string[])
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
    }

    /**
     * @param callback
     * @param attributes
     * @return {*}
     */
    public update(callback:any, attributes:string[])
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
    }

    public refresh(callback:any)
    {
        return this.loadRemote(this.attribute('id'), callback);
    }

    public destroy(callback:any)
    {
        this.deleteRemote(this.attribute('id'), callback);
    }

    private hasChanged(attribute:any)
    {
        if (typeof this.attributes[attribute] === 'undefined')
        {
            for (var i in this.attributes)
            {
                if (this.attributes[i].hasChanged)
                {
                    return true;
                }
            }
            return false;
        }
        else
        {
            return this.attributes[attribute].hasChanged;
        }
    }
}
