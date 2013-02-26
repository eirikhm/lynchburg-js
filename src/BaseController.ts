class BaseController {
    private controllers:Array;
    private options:Object;
    private eventSplitterRegex:RegExp = /^(\w+)\s*(.*)$/;


    public events:Object;
    private elements:Object;
    private selectors:Object;

    private el:JQuery;

    private template:String;

    constructor(el:JQuery)
    {
        if (typeof(el) == 'string')
        {
            this.el = $(el);
        }
        else
        {
            this.el = el;
        }
        if (!this.el)
        {
            throw new Error('Root element missing');
        }
        else
        {
            console.log(this.el);
        }
        this.setupControllerData();
    }

    private setupControllerData()
    {
        for (var key in this.options)
        {
            this[key] = this.options[key];
        }

        if (this.events)
        {
            this.delegateEvents();
        }

        if (this.elements)
        {
            this.initializeElements();
        }
    }

    private delegateEvents()
    {
        for (var key in this.events)
        {
            var methodName = this.events[key],
                method = this.proxy(this[methodName]),
                match = key.match(this.eventSplitterRegex),
                eventName = match[1], selector = match[2];

            if (selector === '')
            {
                this.el.unbind(eventName, method).bind(eventName, method);
            }
            else
            {
                this.el.undelegate(selector, eventName).delegate(selector, eventName, method);
            }
        }
    }

    private initializeElements(forceRefresh?:Boolean)
    {
        forceRefresh = forceRefresh || false;
        for (var i in this.elements)
        {
            var element = this.elements[i];
            if (forceRefresh || typeof this[element] === 'undefined' || this[element].length === 0)
            {
                this[element] = this.$(this.selectors[element]);
            }
        }
    }

    public $(selector:String)
    {
        return $(selector, this.el);
    }

    private proxy(func)
    {
        return $.proxy(func, this);
    }
}