exports = window.lynchburg;
(function ()
{
    "use strict";
    exports.Collection = exports.Component.inherit({

        // defining records here makes all subclasses share this record array.
        // records:  {},
        beforeInit:function (atts)
        {
            this.records = {};
        },

        /**
         * Add object to collection
         *
         * @param model
         */
        add:function(model)
        {
            this.records[model.id] = model;
        },

        /**
         * Remove object with supplied ID from collection
         * @param id
         */
        remove:function(id)
        {
            delete this.records[id];
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
            var record = this.records[id];
            if (!record)
            {
                throw ('Unknown record');
            }
            // Don't return duplicate, extend messes up the object
            // as it doesn't exactly duplicate the object (prototype etc is destroyed it seems)
            return record;
        },

        /**
         * Populates the collection with the supplied objects
         *
         * @param values
         */
        populate:function (values)
        {
            this.records = {};
            for (var i = 0, il = values.length; i < il; i++)
            {
                var record = this.init(values[i]);
                record.newRecord = false;
                // todo: hack?
                this.records[record.id.value] = record;
            }
        },

        /**
         * Filter collection with callback. If callback returns true, record is retunred
         *
         * @param callback
         * @return {*}
         */
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

        /**
         * Returns all records, duplicated
         *
         * @return {*}
         */
        all:          function ()
        {
            return this.dupArray(this.recordsValues());
        },

        /**
         * Returns all values
         *
         * @return {Array}
         */
        recordsValues:function ()
        {
            var result = [];
            for (var key in this.records)
            {
                result.push(this.records[key]);
            }
            return result;
        },

        /**
         * Returns a item duplication
         *
         * @param array
         * @return {*}
         */
        dupArray:function (array)
        {
            return array.map(function (item)
            {
                return item.dup();
            });
        },

        /**
         * Returns number of objects
         *
         * @return {Number}
         */
        count:   function ()
        {
            return this.recordsValues().length;
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