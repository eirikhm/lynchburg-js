/// <reference path='MyController.ts' />
class MyApplication extends BaseApplication {
    constructor()
    {
        var controller = new MyController('#container');
    }
}