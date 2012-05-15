var Model = {
    inherited:function ()
    {
    },

    created:function ()
    {
    },

    prototype:{
        init:function ()
        {
        }
    },

           /**
            * Return new object inherited from Model
            * @return {*}
            */
           create:function ()
           {
               var object = Object.create(this);
               object.parent = this;
               object.prototype = object.fn = Object.create(this.prototype);

               object.created();
               this.inherited(object);
               return object;
           },

         /**
          * Returns new Model
          * @return {*}
          */
         init:function ()
         {
             var instance = Object.create(this.prototype);
             instance.parent = this;
             instance.init.apply(instance, arguments);
             return instance;
         },

           /**
            * Extend the actual class
            * @param o
            */
           extend:function (o)
           {
               var extended = o.extended;
               jQuery.extend(this, o);
               if (extended)
               {
                   extended(this);
               }
           },

            /**
             * Extend instance
             * @param o
             */
            include:function (o)
            {
                var included = o.included;
                jQuery.extend(this.prototype, o);
                if (included)
                {
                    included(this);
                }
            },

    find:function (id)
    {
        var record = this.records[id];
        if (!record)
        {
            throw ('Unknown record');
        }
        return record.dup();
    },

    populate:function (values)
    {
        this.records = {};
        for (var i = 0, il = values.length; i < il; i++)
        {
            var record = this.init(values[i]);
            record.newRecord = false;
            this.records[record.id] = record;
        }
    },

    select:function (callback)
    {
        var result = [];

        for (var key in this.records)
        {
            if (callback(this.records[key]))
            {
                result.push(this.records[key]);
            }
        }

        return this.dupArray(result);
    },

    destroy:function (id)
    {
        this.find(id).destroy();
    },

    all:          function ()
    {
        return this.dupArray(this.recordsValues());
    },
    recordsValues:function ()
    {
        var result = [];
        for (var key in this.records)
        {
            result.push(this.records[key]);
        }
        return result;
    },

    dupArray:function (array)
    {
        return array.map(function (item)
        {
            return item.dup();
        });
    },
    count:   function ()
    {
        return this.recordsValues().length;
    }

};
Model.records = {};

Model.include({
    newRecord:true,

    init:function (atts)
    {

        if (atts)
        {
            this.load(atts);
        }
    },

    validate:function ()
    {
    },

    load:function (attributes)
    {
        for (var name in attributes)
        {
            this[name] = attributes[name];
        }
    },

    create:function ()
    {
        this.trigger("beforeCreate");
        this.newRecord = false;
        this.parent.records[this.id] = this.dup();
        this.trigger("afterCreate");
        this.trigger("create");
    },

    updateAttribute: function (name, value)
    {
        this[name] = value;
        return this.save();
    },
    updateAttributes:function (attributes)
    {
        this.load(attributes);
        return this.save();
    },

    trigger:function (channel)
    {
        this.parent.trigger(channel, this);
    },

    update:function ()
    {
        this.trigger("beforeUpdate");
        this.parent.records[this.id] = this.dup();
        this.trigger("afterUpdate");
        this.trigger("update");
    },

    destroy:function ()
    {
        this.trigger("beforeDestroy");
        delete this.parent.records[this.id];
        this.trigger("afterDestroy");
        this.trigger("destroy");
    },

    dup: function ()
    {
        return jQuery.extend(true, {}, this);
    },
    save:function ()
    {
        this.trigger("beforeSave");
        this.newRecord ? this.create() : this.update();
        this.trigger("afterSave");
        this.trigger("save");
    },

    attributes:  function ()
    {
        var result = {};
        for (var i in this.parent.attributes)
        {
            var attr = this.parent.attributes[i];
            result[attr] = this[attr];
        }
        result.id = this.id;
        return result;
    },
    toJSON:      function ()
    {
        return (this.attributes);
    },
    createRemote:function (url, callback)
    {
        $.post(url, this.attributes(), callback);
    },

    updateRemote:function (url, callback)
    {
        $.ajax({
            url:    url,
            data:   this.attributes(),
            success:callback,
            type:   'POST'
        });
    }
});

Model.extend({
    created:  function ()
    {
        this.records = {};
        this.attributes = {};
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
    loadLocal:function (name)
    {
        if (localStorage[name])
        {
            var result = JSON.parse(localStorage[name]);
            this.populate(result);
        }
    }
});

Model.extend(Events);