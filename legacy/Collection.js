exports = window.lynchburg;
(function ()
{
    /**
     * Returns a item duplication
     *
     * @param array
     * @return {*}
     */
    function dupArray(array)
    {
        return array.map(function (model)
        {
            return model.duplicate();
        });
    }

    "use strict";
    exports.Collection = exports.Component.inherit({

        // defining records here makes all subclasses share this record array.
        // records:  {},
        construct:function (models)
        {
            this.records = [];
            if (typeof models === 'object')
            {
                this.populate(models);
            }
        },

        /**
         * Add object to collection
         *
         * @param model
         */
        add:function (model)
        {
            this.records.push(model);
        },

        /**
         * Remove object with supplied ID from collection
         * @param id
         */
        remove:function (id)
        {
            id = parseInt(id, 10);
            var i = 0,
                length = this.records.length;
            for (; i < length; i++)
            {
                if (this.records[i].id === id)
                {
                    this.records.splice(i,1);
                    return true;
                }
            }
            return false;
        },
        update:function (model)
        {
            var record,
                i = 0;
            for (; i < this.records.length; i++)
            {
                record = this.records[i];
                if (record.id === model.id)
                {
                    this.records[i] = model;
                    return;
                }
            }
            throw ('Cannot update unknown model ' + model.id);
        },

        /**
         * @todo do we need remove and destroy?
         * @param id
         */
        destroy:function (id)
        {
            this.find(id).destroy();
        },

        /**
         * Find object with supplied id
         *
         * @param id
         * @return {*}
         */
        find:function (id)
        {
            id = parseInt(id, 10);
            var record,
                i = 0;
            for (; i < this.records.length; i++)
            {
                record = this.records[i];
                if (record.id === id)
                {
                    return record;
                }
            }
            throw ('Unknown model-id ' + id);
        },

        /**
         * Populates the collection with the supplied objects
         *
         * @param models
         */
        populate:function (models)
        {
            this.records = [];
            for (var i = 0, il = models.length; i < il; i++)
            {
                this.add(models[i]);
            }
        },

        /**
         * Filter collection with callback. If callback returns true, record is returned
         *
         * @param callback
         * @return {*}
         */
        select:function (callback)
        {
            var result = [],
                i = 0,
                length = this.records.length;

            for (; i < length; i++)
            {
                if (callback(this.records[i]))
                {
                    result.push(this.records[i]);
                }
            }
            return result;
        },

        /**
         * Returns all records, duplicated
         *
         * @return {*}
         */
        all:function ()
        {
            return this.records;
        },

        /**
         * Returns a boolean wether or not the collection is empty
         */
        isEmpty:function ()
        {
            return this.records.length === 0;
        },

        /**
         * Returns number of objects
         *
         * @return {Number}
         */
        count:function ()
        {
            return this.records.length;
        },

        /**
         * @todo why is this called created? is that our CTOR?
         */
        created:function ()
        {
            this.records = {};
            this.attributes = {};
            this.rules = [];
            this.errors = [];
        },

        /**
         * Saves a localStorage copy
         *
         * @todo rename to cache?
         * @param name
         */
        saveLocal:function (name)
        {
            var result = [];
            for (var i in this.records)
            {
                result.push(this.records[i].attributes());
            }
            localStorage[name] = JSON.stringify(result);
        },

        /**
         * Loads from localStorage
         *
         * @todo rename to cache?
         * @param name
         */
        loadLocal:function (name)
        {
            if (localStorage[name])
            {
                var result = JSON.parse(localStorage[name]);
                this.populate(result);
            }
        }
    });

}());
