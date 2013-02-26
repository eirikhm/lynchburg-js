(function ()
{
    function ensureHook ()
    {
        if (!this.eventHook)
        {
            this.eventHook = $({});
        }
    }

    lynchburg.Events = {
        bind:  function ()
        {
            ensureHook.call(this);
            this.eventHook.bind.apply(this.eventHook, arguments);
            return this;
        },
        unbind:function ()
        {
            ensureHook.call(this);
            this.eventHook.unbind.apply(this.eventHook, arguments);
            return this;
        },

        trigger:function ()
        {
            ensureHook.call(this);
            this.eventHook.trigger.apply(this.eventHook, arguments);
            return this;
        }
    };
}());