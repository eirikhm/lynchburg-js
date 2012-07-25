lynchburg.Events = {
    bind:function ()
    {
        if (!this.eventHook)
        {
            this.eventHook = $({});
        }
        this.eventHook.bind.apply(this.eventHook, arguments);
    },

    trigger:function ()
    {
        if (!this.eventHook)
        {
            this.eventHook = $({});
        }
        this.eventHook.trigger.apply(this.eventHook, arguments);
    }
};