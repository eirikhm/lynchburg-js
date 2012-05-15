var StateMachine = function ()
{

};

StateMachine.fn = StateMachine.prototype;

$.extend(StateMachine.fn, Events);

StateMachine.fn.add = function (controller)
{
    this.bind('change', function (e, current)
    {
        if (controller == current)
        {
            controller.activate();
        }
        else
        {
            controller.deactivate();
        }
    });

    controller.active = $.proxy(function ()
    {
        this.trigger('change', controller);
    }, this);
};