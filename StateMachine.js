lynchburg.StateMachine = function ()
{

};

lynchburg.StateMachine.fn = lynchburg.StateMachine.prototype;

$.extend(lynchburg.StateMachine.fn, lynchburg.Events);

lynchburg.StateMachine.fn.add = function (controller)
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