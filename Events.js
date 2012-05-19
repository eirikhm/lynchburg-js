lynchburg.Events = {
    bind:function ()
    {
        if (!this.o)
        {
            this.o = $({});
        }
        this.o.bind.apply(this.o, arguments);
    },

    trigger:function ()
    {
        if (!this.o)
        {
            this.o = $({});
        }
        this.o.trigger.apply(this.o, arguments);
    }
};