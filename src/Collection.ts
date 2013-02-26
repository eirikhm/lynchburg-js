class Collection {
    private records = [];

    public construct(models:Model[])
    {
        if (typeof models === 'object')
        {
            this.populate(models);
        }
    }

    /**
     * Add object to collection
     *
     * @param model
     */
    public add(model:any)
    {
        this.records.push(model);
    }

    /**
     * Remove object with supplied ID from collection
     * @param id
     */
    public remove(id:number)
    {

        var i = 0,
            length = this.records.length;
        for (; i < length; i++)
        {
            if (this.records[i].id == id)
            {
                this.records.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    public update(model:any)
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
    }

    /**
     * @todo do we need remove and destroy?
     * @param id
     */
    public destroy(id:number)
    {
        this.find(id).destroy();
    }

    /**
     * Find object with supplied id
     *
     * @param id
     * @return {*}
     */
    public find(id:number)
    {
        var record,
            i = 0;
        for (; i < this.records.length; i++)
        {
            record = this.records[i];
            if (record.id == id)
            {
                return record;
            }
        }
        throw ('Unknown model-id ' + id);
    }

    /**
     * Populates the collection with the supplied objects
     *
     * @param models
     */
    public populate(models:any)
    {
        this.records = [];
        for (var i = 0, il = models.length; i < il; i++)
        {
            this.add(models[i]);
        }
    }

    /**
     * Filter collection with callback. If callback returns true, record is returned
     *
     * @todo: Correct hinting
     * @param callback
     * @return {*}
     */
    public select(callback:any)
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
    }

    /**
     * Returns all records, duplicated
     *
     * @return {*}
     */
    public all()
    {
        return this.records;
    }

    /**
     * Returns a boolean wether or not the collection is empty
     */
    public isEmpty()
    {
        return this.records.length === 0;
    }

    /**
     * Returns number of objects
     *
     * @return {Number}
     */
    public count()
    {
        return this.records.length;
    }

    /**
     * Saves a localStorage copy
     *
     * @todo rename to cache?
     * @param name
     */
    public saveLocal(name:string)
    {
        var result = [];
        for (var i in this.records)
        {
            result.push(this.records[i].getAttributes());
        }
        localStorage[name] = JSON.stringify(result);
    }

    /**
     * Loads from localStorage
     *
     * @todo rename to cache?
     * @param name
     */
    public loadLocal(name:string)
    {
        if (localStorage[name])
        {
            var result = JSON.parse(localStorage[name]);
            this.populate(result);
        }
    }
}