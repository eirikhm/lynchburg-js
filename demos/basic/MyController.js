var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var MyController = (function (_super) {
    __extends(MyController, _super);
    function MyController(el) {
        this.events = {
            'click button': 'clickButton'
        };
        this.elements = [
            'myButton'
        ];
        this.selectors = {
            'myButton': 'button'
        };
        _super.prototype.constructor.call(this, el);
    }
    MyController.prototype.clickButton = function (e) {
        this.$(this.selectors.myButton).text('Altered text');
        var self = this;
        setTimeout(function () {
            self.myButton.text('123');
        }, 500);
    };
    return MyController;
})(BaseController);
//@ sourceMappingURL=MyController.js.map
