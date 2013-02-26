/// <reference path='../../src/BaseController.ts' />
class MyController extends BaseController {
    constructor(el:JQuery)
    {
        this.events = {
            'click button': 'clickButton'
        };
        this.elements = [
            'myButton'
        ];
        this.selectors = {
            'myButton': 'button'
        };
        super.constructor(el);
    }

    public clickButton(e:MouseEvent)
    {
        this.$(this.selectors.myButton).text('Altered text');

        var self = this;
        setTimeout(function ()
        {
            self.myButton.text('123');
        }, 500);
    }
}