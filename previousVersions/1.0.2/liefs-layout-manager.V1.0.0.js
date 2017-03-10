/**
* ##### **Handler - Class Description: STATIC/INSTANCE**
* Please take note that Handler (caps) Refers to the Static Object Class Handler
* (instance of Handler) refers to an Instance of Handler Class
*
* In essence, liefs-layout-manager.Handler manages the layouts, and handles resize event correctly.
*
* Once I() is called even once, (after a small while) A master Handler Instance will
* be created. (If you didn't make one)
*
* On resizeEvent, Handler loops though all (instance of Handler)s,
* For each (instance of Handler):
* * Loops through (Handler Instance).layouts (Array<Layout>)
* ...checking (Handler Instance).layouts[index].conditionalFunction to see if
* (Handler Instance).layouts[index].container should be the one used for (Handler Instance)
* ... which means it find the layout you wanted to use for this screen resize.
* * Then it calculates the (Item Instance).size (Coord) for each visible Item,
* * Then sets all visible items to visible, and Hidden to [Hidden AND (left, top, width and height set to 1px)]
* * Then waits for next resizeEvent.
*
* I know the excitement is overwhelming you... lets read on for more details
*/
var Handler = (function () {
    /**
    * ##### **Handler  - constructor **
    * This Class:
    *```javascript
    var something = new Handler(); // do not do this! - Done by H()
    var something = H();           // Ok much better -
    // both above lines return a (instance of Handler);
    *```
    * See Handler.H()
    */
    function Handler() {
        var Arguments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            Arguments[_i] = arguments[_i];
        }
        var _this = this;
        /**
        * ##### **(instance of Handler).setArgsObj **
        * See liefs-layout-manager.lib.argsObj and
        * See liefs-layout-manager.lib.setArgsObj
        */
        this.setArgsObj = setArgsObj;
        /**
        * ##### **(instance of Handler).position **
        * This is the Coord Object for the (instance of Handler)
        */
        this.position = new Coord();
        /**
        * ##### **(instance of Handler).isActive - boolean - set true if active **
        * Ha Ha, I haven't programed this in yet - you're stuck on.
        */
        this.isActive = true;
        /**
        * ##### **(instance of Handler).selector - string **
        * This is explained in detail at (Item Instance).selector
        */
        this.selector = function () { return "#" + _this.label; };
        if (TypeOf(arguments[0]).slice(0, 5) === "array") {
            this.myArgsObj = argsObj(arguments[0]);
        }
        else
            this.myArgsObj = argsObj(arguments);
        this.label = this.setArgsObj("string", 0, "LayoutGroup ");
        if ("array_Layout" in this.myArgsObj) {
            if ("Layout" in this.myArgsObj)
                liefsError.badArgs("Layouts, OR Arrays of Layouts", "Got Both", "new Handler()");
            this.layouts = this.myArgsObj.array_Layout.shift();
            if (this.myArgsObj.array_Layout.length)
                new Handler(this.myArgsObj.array_Layout);
        }
        else if ("Layout" in this.myArgsObj)
            this.layouts = this.myArgsObj.Layout;
        else
            liefsError.badArgs("Layouts, OR Arrays of Layouts", "Got Both", "new Handler()");
        if (isUniqueSelector(this.selector()))
            this.el = document.querySelectorAll(this.selector())[0];
        Handler.handlers.push(this);
    }
    /**
    * ##### **Handler.watchForResizeEvent()  - function STATIC **
    * When called (by liefs-layout-manager - no need for you to do so....)
    * it sets `window.onresize` Event
    *
    * at this point, the only way to turn it off, that will actualy WORK, is:
    *```javascript
    * window.onresize = () => {}; // this will stop liefs-layout-manager in its tracks
    *```
    */
    Handler.watchForResizeEvent = function () {
        window.onresize = function (e) {
            window.clearTimeout(Handler.callbackThrottleId);
            Handler.callbackThrottleId = window.setTimeout(Handler.resizeEvent(e), Handler.resizeCallbackThrottle);
        };
    };
    /**
    * ##### **Handler.activate()  - function STATIC **
    * basically using ANY of liefs-layout-manager functions triggers this function
    *
    * When called (by liefs-layout-manager - no need for you to do so....)
    * Handler knows - OK you used a function of mine, so start up soon,
    * and since I know I'm starting, ignore further calls here.
    *
    */
    Handler.activate = function () {
        if (!(Handler.isActive)) {
            Handler.isActive = true;
            setTimeout(function () { if (Handler.isActive)
                Handler.startHandler(); }, Handler.delayUntilStart);
        }
    };
    /**
    * ##### **Handler.createDivList()  - function STATIC **
    * This function is called after all Defining is done.
    * it loops though all Items, Containers, and Handlers, looking for matching
    * elements, which it adds to the hide/show list
    * Internal use only - no need to ever call it
    */
    Handler.createDivList = function () {
        for (var _i = 0, _a = Object.keys(Item.items); _i < _a.length; _i++) {
            var id = _a[_i];
            if (Item.items[id][0].el)
                Handler.showObj[id] = { el: Item.items[id][0].el, show: false };
        }
        for (var _b = 0, _c = Object.keys(Container.containers); _b < _c.length; _b++) {
            var id = _c[_b];
            if (Container.containers[id].el)
                Handler.showObj[id] = { el: Container.containers[id].el, show: false };
        }
        for (var _d = 0, _e = Handler.handlers; _d < _e.length; _d++) {
            var handler = _e[_d];
            if (handler.el)
                Handler.showObj[handler.label] = { el: handler.el, show: false };
        }
    };
    /**
    * ##### **Handler.startHandler()  - function STATIC **
    * after Handler.delayUntilStart (See its description)
    * First it sees if you are lacking multiple Layouts, and a handler:
    *```javascript
    * h("SomeGroupName", "100%",
    *   I("LeftSideid", "50%"), I("LeftSideid", "50%")
    * );
    *```
    * Since there is no Layout and Handler, one will be automatic appointed using the following
    *```javascript
    * H("defaultHandler",  // this line is created behind the scenes because you left it out
    *   L("defaultLayout",  // this line is created behind the scenes because you left it out
    *     h("SomeGroupName", "100%",
    *       I("LeftSideid", "50%"), I("LeftSideid", "50%")
    *     ),
          (x, y) => { return true; }  // this line is created behind the scenes because you left it out
        ) // this line is created behind the scenes because you left it out
    * );
    *```
    * this is the start up script.  It calls:
    *```javascript
    * Handler.createDivList();
    * Handler.watchForResizeEvent();
    * Handler.resizeEvent();
    *```
    */
    Handler.startHandler = function () {
        console.log("Handler Started");
        if (!Handler.handlers.length)
            H("defaultHandler", L("defaultLayout", Container.root(), function (x, y) { return true; }));
        Handler.createDivList();
        Handler.watchForResizeEvent();
        Handler.resizeEvent();
    };
    /**
    * ##### **Handler.resizeEvent()  - function STATIC **
    * This has a slightly misleading name. It should really be called
    * "refresh" - because it does that - refreshes all output from current input
    *
    * True, this is called on an actual resize event, but it is also called
    * when you drag a dragbar, or trigger anything else that requires a
    * page refresh.
    *
    * Shoud you need to force a page refresh:
    *```javascript
    * Handler.resizeEvent();  // this will trigger a page refresh
    * // so if you make a button to change layouts, and bypass internal methods
    * // to acheive this, you will have to call this after to refresh the page.
    *```
    */
    Handler.resizeEvent = function (e) {
        if (e === void 0) { e = null; }
        Handler.Hide();
        for (var _i = 0, _a = Handler.handlers; _i < _a.length; _i++) {
            var eachHandler = _a[_i];
            eachHandler.chooseContainer();
            eachHandler.update();
        }
        for (var _b = 0, _c = Object.keys(Handler.showObj); _b < _c.length; _b++) {
            var eachKey = _c[_b];
            if (!Handler.showObj[eachKey].show) {
                directiveSetStyles(Handler.showObj[eachKey].el, {
                    visibility: "hidden", left: "1px", top: "1px", width: "1px", height: "1px"
                });
            }
            else if (Item.get(eachKey) && Item.get(eachKey).dragBar)
                Item.get(eachKey).dragBar.update();
        }
    };
    /**
    * ##### **Handler.Hide()  - function STATIC **
    * This is part of the refresh script. this small piece simple hides the elements that need to be hidden
    */
    Handler.Hide = function () { for (var _i = 0, _a = Object.keys(Handler.showObj); _i < _a.length; _i++) {
        var eachKey = _a[_i];
        Handler.showObj[eachKey].show = false;
    } };
    /**
    * ##### **(instance of Handler).update()  - function **
    * This is part of the refresh script.
    * It calles the active Contianer.update (See that)
    * and applies the results to set all element style properties to make the page render correctly.
    *
    * This is an internal function - no reason to call
    */
    Handler.prototype.update = function () {
        var coord;
        var pageItem;
        this.activeContainer.update(this.position.width, this.position.height, this.position.x, this.position.y);
        for (var _i = 0, _a = Object.keys(this.activeContainer.lastUpdate); _i < _a.length; _i++) {
            var origKey = _a[_i];
            if (origKey in Handler.showObj) {
                coord = this.activeContainer.lastUpdate[origKey];
                pageItem = Item.page(this.activeContainer.itemByLabel(origKey));
                Handler.showObj[pageItem.label].show = true;
                directiveSetStyles(pageItem.el, {
                    visibility: "visible", left: px(coord.x), top: px(coord.y), width: px(coord.width), height: px(coord.height)
                });
            }
        }
    };
    /**
    * ##### **(instance of Handler).chooseContainer()  - function **
    * This is part of the refresh script.
    * It loops through the layout options, and sets (instance of Handler).activeContainer to correct value.
    *
    * This is an internal function - no reason to call
    */
    Handler.prototype.chooseContainer = function () {
        this.position.getSource(this.el);
        for (var _i = 0, _a = this.layouts; _i < _a.length; _i++) {
            var eachLayout = _a[_i];
            if (eachLayout.conditionalFunction(this.position.width, this.position.height)) {
                if (!this.activeContainer) {
                    console.log("Starting With Container: " + eachLayout.container.label);
                }
                else if (this.activeContainer.label !== eachLayout.container.label) {
                    console.log("Switched From Container :" + this.activeContainer.label + " to " + eachLayout.container.label);
                }
                this.activeContainer = eachLayout.container;
                break;
            }
        }
        if (!this.activeContainer) {
            this.activeContainer = (this.layouts[this.layouts.length - 1]).container;
            console.log("All Layout conditionalFunctions failed! Choosing last in list: " + this.activeContainer.label);
        }
    };
    return Handler;
}());
/**
* ##### **Handler.handlers - Array<Handler> STATIC **
* internal use - this is where Handler stores it list OF (instance of Handler)
*/
Handler.handlers = [];
/**
* ##### **Handler.isActive - boolean - set true if active STATIC **
* Ha Ha, I haven't programed this in yet - you're stuck on.
*/
Handler.isActive = false;
/**
* ##### **Handler.resizeCallbackThrottle - number - Default 0 STATIC **
* This is the amount in milisecond before a resize event is triggered.
* Sometimes, the refresh of a page is expensive, and in these cases,
* Dragging a resize will NOT produce pleasant results.
* By setting `Handler.resizeCallbackThrottle = 1000;` for example,
* would allow a full second of static view - no matter how much the user is
* resize crazy - before refreshing the page to reflect new resize dimensions.
*/
Handler.resizeCallbackThrottle = 0;
/**
* ##### **Handler.delayUntilStart - number - Default 200 (miliseconds) STATIC **
* Once the page loads, there are often "expensive loads" that are required
* before the Handler should start.  For example, it is possible that your
* javascript creates elements that liefs-layout-manager should find.
*
* To avoid this "I got here first" conflict, there is a delay before
* liefs-layout-manager starts - this value - default 200 miliseconds.
*
* feel free to try 0 or something else to suit your needs. Maybe the waiting
* is completely unnecessary for you.
*/
Handler.delayUntilStart = 200;
/**
* ##### **Handler.showObj Object of Key label value {show: boolean; el: Element} STATIC **
* This is where all the elements are flagged as hidden or visible.
* Internal Use Only.
*/
Handler.showObj = {};
/**
* ##### **H() Funtion to create a new Handler Instance **
* This creates a Handler Instance.
* @param (TypeOf 'string') - when an Argument is of TypeOf 'string' it is assigned to be the label of this (instance of Handler)
* @param (TypeOf Class Layout) - when an Argument is of TypeOf Layout, it appends it to the list of layouts
* for this Handler.  There is not limit to the number of layouts supplies as arguments.
*/
function H() {
    var Arguments = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        Arguments[_i] = arguments[_i];
    }
    return new Handler(Arguments);
}
/**
* liefsError (singleton Object/Namespace) handles all detected errors in liefs-layout-manager
* Note: you do nothing with liefsError by itself: See below for supplied methods.
*/
var liefsError = {
    /**
    * ##### **liefsError.matchLength - Fuction Description:**
    * liefsError.matchLength is called when the incorrect number of arguments for a function is called
    * ##### **Example Usage:**
    *```javascript
    *> liefsError.matchLength(5, 4, "From within Whatever Class/Function with whatever arguments");
    *```
    * @param expected The expected number of arguments
    * @param received The received number of arguments
    * @param reference (Optional) Reference to the Class/Function/Id that threw this error
    */
    matchLength: function (expected, received, reference) {
        if (reference === void 0) { reference = ""; }
        var plus = "";
        if (expected < 0) {
            expected *= -1;
            plus = "or more ";
        }
        throw {
            message: "Expected " + plus + expected.toString() + " received " + received.toString() + ".",
            name: "Incorrect Number Of Arguments Error"
        };
    },
    /**
    * ##### **liefsError.typeMismatch - Fuction Description:**
    * liefsError.typeMismatch is called when the incorrect Type of arguments for a function is called
    * ##### **Example Usage:**
    *```javascript
    *liefsError.typeMismatch("only strings", "objects", "From within Whatever Class/Function with whatever arguments");
    *```
    * @param expected The expected number of arguments
    * @param received The received number of arguments
    * @param reference (Optional) Reference to the Class/Function/Id that threw this error
    */
    typeMismatch: function (expected, received, reference) {
        if (reference === void 0) { reference = ""; }
        var msg = reference + " Expected type " + expected.replace("|", " or ") + " received type " + received + ".";
        throw new TypeError(msg);
    },
    /**
    * ##### **liefsError.badArgs - Fuction Description:**
    * liefsError.badArgs (Most Common) is called when required arguments are missing, or supplied arguments make no sense.
    * ##### **Example Usage:**
    *```javascript
    *liefsError.badArgs("Array of Items", "An Item", "From within Whatever Class/Function with whatever arguments");
    *```
    *
    * @param expected The expected number of arguments
    * @param received The received number of arguments
    * @param reference (Optional) Reference to the Class/Function/Id that threw this error
    */
    badArgs: function (expected, received, reference) {
        if (reference === void 0) { reference = ""; }
        throw reference + " Expected " + expected + " received " + received + ".";
    }
};
/**
* ##### **onEvent - Fuction Description:**
* onEvent is a simple utility function to make Event Assignment more readable
* ##### **Example Usage:**
*```javascript
*onEvent(document.getElementById("something"), 'onclick', someFunction);
*```
* @param el HTLMElement that you wish to attach a Event Listener to (pointer to)
* @param eventType string of event type ie: 'click'
* @param eventFunction Function to be called when Event Occurs
*/
function onEvent(el, eventType, eventFunction) {
    if (el.addEventListener)
        el.addEventListener(eventType, eventFunction, false);
    else if (el.attachEvent)
        el.attachEvent(eventType, eventFunction);
}
/**
* ##### **nthIndes - Fuction Description:**
* nthIndex is a simple utility function to extend IndexOf to the nth instance.
* ##### **Example Usage:**
*```javascript
*> nthIndex("testertester","t",2);
*3
*```
* @param str String to be parsed
* @param pat String of pattern to look for
* @param n Number nth occurance
* @return Same as IndexOf ... the index value of the nth Occurance
*/
function nthIndex(str, pat, n) {
    var L = str.length, i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0)
            break;
    }
    return i;
}
/**
* ##### **occurances - Fuction Description:**
* occurances is a simple utility to return the number of occurances of a substring in a string.
* ##### **Example Usage:**
*```javascript
*> occurrences("testertester","t");
*4
*```
* @param thisString String to be parsed
* @param subString String of pattern to look for
* @param allowOverlapping boolean allowing overloapping (Not normally what you want)
* @return Number of Occurances of subString in thisString
*/
function occurrences(thisString, subString, allowOverlapping) {
    if (allowOverlapping === void 0) { allowOverlapping = false; }
    thisString += "";
    subString += "";
    if (subString.length <= 0)
        return (thisString.length + 1);
    var n = 0, pos = 0, step = allowOverlapping ? 1 : subString.length;
    while (true) {
        pos = thisString.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        }
        else
            break;
    }
    return n;
}
/**
* ##### **trimCompare - Fuction Description:**
* trimCompare is a simple utility used in conjunction with liefs-layout-manager.TypeOf
* This equates to if b is subset of a, then its still equal
* See liefs-layout-manager.TypeOf to understand how this function would be helpful
* ##### **Example Usage:**
*```javascript
*> trimCompare("one:two:three:four","one:two");
*true
*>  trimCompare("one:two:three:four","one:three");
*false
*```
* @param a Longer TypeOf return value
* @param b Shorted TypeOf return value
* @return True if b is a subset of a
*/
function trimCompare(a, b) {
    if (occurrences(b, ":") < occurrences(a, ":"))
        a = a.slice(0, nthIndex(a, ":", occurrences(b, ":") + 1));
    return (a === b);
}
/**
* ##### **isStart - Fuction Description:**
* isStart is a filter function that returns true if any string argument ends with "%" or "px"
* ##### **Example Usage:**
*```javascript
*> isStart("120px");isStart("100%");
*true
*true
*> isStart("IBetThisIsALabelNotAStart");
*false
*```
* @param value string to check if it is of type "start"
*/
function isStart(value) {
    return value.slice(-1) === "%" || value.slice(-2) === "px";
}
/**
* ##### **px - Fuction Description:**
* px is a "short hand" function for adding "px" to an number, and making it a string;
* see vpx for reverse
* ##### **Example Usage:**
*```javascript
*> px(100);
*'100px'
*```
* @param value number to be converted to string, then px added
*/
function px(value) { return value.toString() + "px"; }
/**
* ##### **vpx - Fuction Description:**
* vpx is a "short hand" function for converting a start value to a number
* see px for reverse
* ##### **Example Usage:**
*```javascript
*> vpx("100px");
*100
*```
* @param value number to be converted to string, then px added
*/
function vpx(value) { return parseInt(value.slice(0, -2)); }
/**
* ##### **TypeOf - Fuction Description:**
* TypeOf is an extended version of typeof. It as two purposes:
*
* First,(One Argument) It Identifies type, and returns it.  If type is Array, or Object, then it
* assumes string key, and continues to TypeOf the value of Object[key:string].
* "Classes" are return by class name.
*
* Second, (Two Arguments) It compares Typeof First Argument, to pre-resolved type string of 2nd Argument
* ##### **Example Usage:**
*```javascript
*> TypeOf("abc");                                 // OK So far just like typeof
*'string'
*> TypeOf([1, 2, 3]);                             // if object, or array -> recrusive TypeOf
*'array:number'
*> TypeOf(I("Page4","250px"));                    // I() Returns a new instance of class Item
*'Item'
*> TypeOf(Item.items);                            // Items are stored by label, then instance, then class
*'object:array:Item'
*> TypeOf(Container.containers);                  // Containers never have more than one instance.
*'object:Container'
*
*> TypeOf(Item.items, 'object:array:Item');       // note: you can match full answer OR
*true
*> TypeOf(Item.items, 'object:array');            // just a subset
*true
*```
* @param value target of TypeOf (Required) - if no match argument, returns string
* @param match - match string to compare agains result (Optional) return boolean
* @return no match - returns string - match - returns boolean
*/
function TypeOf(value, match) {
    if (match === void 0) { match = undefined; }
    var ctype = typeof value, temp;
    if (ctype === "object")
        if (Array.isArray(value))
            ctype = "array:" + TypeOf(value[0]);
        else if ((value["constructor"] && value.constructor["name"])
            && (typeof value["constructor"] === "function")
            && (["Object", "Array"].indexOf(value.constructor.name) === -1))
            ctype = value.constructor.name;
        else
            ctype = "object:" + TypeOf(value[Object.keys(value)[0]]);
    else if (ctype === "string")
        if (isStart(value))
            ctype = "start";
    if (match)
        if (match.indexOf("|") === -1)
            return trimCompare(ctype, match);
        else {
            for (var _i = 0, _a = match.split("|"); _i < _a.length; _i++) {
                var each = _a[_i];
                if (trimCompare(ctype, each))
                    return true;
            }
            return false;
        }
    return ctype;
}
/**
* ##### **setArgsObj - Fuction Description:**
* setArgsObj is used in conjunction with argsObj()

*```javascript
* function someFunction(...Arguments) {
*    label:string;
*    myArgsObj: any;                                              // setArgObj refers to "this"
*    setArgsObj: Function = setArgsObj;                           // setArgObj refers to "this"
*    this.myArgsObj = argsObj(arguments);
*    this.label = this.setArgsObj("string", 0, "someFunction");   // this.label is the 0th string in the argument list in this case "Astring"
*}
* > someFunction(1, 2, "Astring", "another string" I("Page2","200px"));
* {"number":[1, 2],
*  "string":["Astring", "another string"],
*  "Item":[{"lastDirection":true,"label":"Page2","start":"200px","current":"200px","instance":2,"el":{}}]}
*```
* @param key TypeOf in question
* @param index - Optional - if ommitted assumes Array[0]
* @param ref - Optional - Displayed as reference if error occurs
* @return The index'th value of this.myArgsObj[key]
*/
function setArgsObj(key, index, ref) {
    if (index === void 0) { index = 0; }
    if (ref === void 0) { ref = ""; }
    var target;
    if (!(this.myArgsObj))
        throw "setArgsObj Empty";
    if ((key in this.myArgsObj) && (index < this.myArgsObj[key].length)) {
        target = this.myArgsObj[key][index];
    }
    return target;
}
/**
* ##### **argsObj - Fuction Description:**
* argsObj is an extesnion of TypeOf.  Its intent is to return the Types of the arguments, as an Object.
*
* so:
* ##### **Example Usage:**
*```javascript
* function someFunction(...Arguments) {
*    console.log(argsObj(arguments));
*}
* > someFunction(1, 2, "string", "another string" I("Page2","200px"));
* {"number":[1, 2],
*  "string":["string", "another string"],
*  "Item":[{"lastDirection":true,"label":"Page2","start":"200px","current":"200px","instance":2,"el":{}}]}
*```
* @param args - Array of Arguments
* @return Object: Keys (srings) of TypeOf - Values - Arrays of Occurances
*/
function argsObj(args) {
    var retObj = {}, ctype;
    for (var i = 0; i < args.length; i++) {
        ctype = TypeOf(args[i]).replace(":", "_");
        if (!(ctype in retObj))
            retObj[ctype] = [];
        retObj[ctype].push(args[i]);
    }
    return retObj;
}
/**
* ##### **CheckArgTypes - Fuction Description:**
* CheckArgTypes is a boolean check to see if given arguments include all types
* ##### **Example Usage:**
*```javascript
* function someFunction(...Arguments) {
    CheckArgTypes(arguments, ["string", "number", "Item"], false) // Throws error if Arguments do not include a string, a numbr and an Item.
*}
*```
* @param args - Array of Arguments
* @param types - Array of types expected
* @param reference - Optional - Displayed as reference if error occurs
* @param checkLength - Optional if False, ignores extra arguments. if True, throws error
* @return True if everything matched the way it should
*/
function CheckArgTypes(args, types, reference, checkLength) {
    if (reference === void 0) { reference = ""; }
    if (checkLength === void 0) { checkLength = true; }
    reference += " typeCheck";
    if (checkLength && args.length !== types.length)
        liefsError.matchLength(types.length, args.length, reference);
    for (var i = 0; i < types.length; i++)
        if (TypeOf(args[i]) !== types[i])
            liefsError.typeMismatch(types[i], args[i], reference);
    return true;
}
/**
* ##### **el - Fuction Description:**
* el - return element by id
* ##### **Example Usage:**
*```javascript
* el("Pages").style.left;                 // looks up div id="Pages" from dom
*```
* @param id - string value if id
* @return Element matching id
*/
function el(id) {
    CheckArgTypes(arguments, ["string"], "el()");
    return document.getElementById(id);
}
/**
* ##### **isUniqueSelector - Fuction Description:**
* isUniqueSelector - is there only one element in the dom to match selection true/false
* ##### **Example Usage:**
*```javascript
* isUniqueSelector("Pages");        // if only one id="Pages" in dom, true, otherwize false.
*```
* @param selector querySelectorAll( selector ) - standard selector string
* @return true if only one match - false otherwize
*/
function isUniqueSelector(selector) {
    return ((document.querySelectorAll(selector)).length === 1);
}
/**
* ##### **directive - Fuction Description:**
* directive - searches dom for querySelectorAll( selector ),
* pulls out all element properties listed in attributesList,
* includes tagname:string  and el: HTMLElement by default.
* It returns the whole thing as an Object
* ##### **Example Usage:**
*```javascript
* >JSON.stringify(directive("#Pages",["id","style"]));
* "[{"el":{},"tagname":"DIV","id":"Pages","style":"position: fixed; visibility: hidden; left: 1px; top: 1px; width: 1px; height: 1px;"}]"
*```
* @param querrySelectorAll querySelectorAll( selector ) - standard selector string
* @param attributesList if only one match - false otherwize
*/
function directive(querrySelectorAll, attributesList) {
    CheckArgTypes(arguments, ["string", "array:string"], "directive()");
    var returnArray = [];
    var Obj;
    var NodeList = document.querySelectorAll(querrySelectorAll);
    for (var i = 0; i < NodeList.length; i++) {
        Obj = { el: NodeList[i], tagname: NodeList[i].tagName };
        for (var _i = 0, attributesList_1 = attributesList; _i < attributesList_1.length; _i++) {
            var eachAttribute = attributesList_1[_i];
            if (NodeList[i].getAttribute(eachAttribute) === undefined) {
                Obj[eachAttribute] = undefined;
                if (NodeList[i].id !== undefined)
                    for (var each in document.querySelectorAll("[" + eachAttribute + "]"))
                        if (each["id"] !== undefined)
                            if (each["id"] === NodeList[i].id)
                                Obj[eachAttribute] = true;
            }
            else
                Obj[eachAttribute] = NodeList[i].getAttribute(eachAttribute);
        }
        returnArray.push(Objectassign(Obj));
    }
    return returnArray;
}
/**
* ##### **directiveSetStyles - Fuction Description:**
* directiveSetStyles - sets the style properties for an element.
* ##### **Example Usage:**
*```javascript
* directiveSetStyles(document.getElementById("something"), {left: "100px", top: "100px", visibility: "hidden"});
*```
* @param el Element to have style properties changed.
* @param stylesObject Object containing key (property) value (to be set value)
*/
function directiveSetStyles(el, stylesObject) {
    for (var _i = 0, _a = Object.keys(stylesObject); _i < _a.length; _i++) {
        var key = _a[_i];
        el["style"][key] = stylesObject[key];
    }
}
/**
* ##### **isItIn - Fuction Description:**
* isItIn - similar to (key in Array), this works for Objects instead of arrays
* ##### **Example Usage:**
*```javascript
* > isItIn("two", {one: 1, two: 2, three: 3});
* true
*```
* @param el Element to have style properties changed.
* @param stylesObject Object containing key (property) value (to be set value)
*/
function isItIn(key, object) {
    var keys = Object.keys(object);
    if (keys.indexOf(key) === -1)
        return null;
    return object[key];
}
/**
* ##### **Objectassign - Fuction Description:**
* Objectassign - this function is redundant and will be removed in the next revision
*/
function Objectassign(obj) {
    var ro = {};
    for (var key in obj)
        ro[key] = obj[key];
    return ro;
}
/**
* ##### **myIndexOf - Fuction Description:**
* myIndexOf - similar to nthIndex, this returns string after nth occurance of string
* ##### **Example Usage:**
*```javascript
*> myIndexOf("testertester","t", 2, 0)
*"ertester"
*```
* @param sstring - String to be parsed
* @param search - String to search for in sstring
* @param occurance - starting after the nth occurace
* @param start starting at string index[start]
* @return the remainder of sstring, after search start at index start,
* after occurance number of search string found
*/
function myIndexOf(sstring, search, occurance, start) {
    if (occurance) {
        start = sstring.indexOf(search, start) + 1;
        --occurance;
        if (occurance)
            return myIndexOf(sstring.slice(start), search, occurance, start);
        else
            return sstring.slice(start);
    }
    else
        return sstring;
}
/**
* ##### **Coord - Class Description:**
* Coord is a Object Class that simply hold the dimenions of an Item/Container/Handler
* (x, y, width , height)
*
* These Objects are created by liefs-layout-manager interally. There is no reason to
* manually create a Coord Instance.1
*/
var Coord = (function () {
    function Coord(width, height, x, y) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
    /**
    * ##### **(instace of Coord).getSource - function **
    * internal use
    * Called to get the Coord of an Element BEFORE liefs-layout-manager does anything to it.
    */
    Coord.prototype.getSource = function (el, byRoot) {
        if (byRoot === void 0) { byRoot = true; }
        if (!el) {
            var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName("body")[0];
            this.width = w.innerWidth || e.clientWidth || g.clientWidth;
            this.height = w.innerHeight || e.clientHeight || g.clientHeight;
            this.x = 0;
            this.y = 0;
        }
        else {
            this.width = el.style.width;
            this.height = el.style.height;
            var x = el.offsetLeft, y = el.offsetTop;
            if (byRoot)
                for (x = 0, y = 0; el != null; x += el.offsetLeft, y += el.offsetTop, el = el.offsetParent)
                    ;
            this.x = x;
            this.y = y;
        }
    };
    return Coord;
}());
/**
* ##### **Dragbar - Class Description:**
*
* Dragbar is a Class that stores all properties relating to Dragbars.
* For each Dragbar, there is an instance of this class created under
* (instance of [Item](./_liefs_layout_manager_.item.html)).Dragbar
* It is "automatically" created - There is no need to create an instance of this ever.
*
* All visible properties of Dragbars are controlled with css .Hdragbar and .Vdragbar
*
* This class can be reached
*
* by [Items.get](_liefs_layout_manager_.item.html#get)("ItemName").Dragbar
*/
var Dragbar = (function () {
    /**
     * ##### **Dragbar.constructor()**
     *
     * internal use only - no reason to call/use
     * this class is created by Item automatically - no reason to create an instance manually.
     */
    function Dragbar(item, front, width) {
        if (front === void 0) { front = true; }
        if (width === void 0) { width = undefined; }
        var _this = this;
        /**
         * ##### **(Dragbar Instance).Selector - anonymous function:**
         *
         * internal use only - no reason to call/use - Indicates the selector uses to find the Dragbar
         * in this version it is [Item.selector](./_liefs_layout_manager_.item.html#selector)() + " > ." + ("Hdragbar" or "Vdragbar")
         *
         * This could be changed by resetting this anonymous function
         */
        this.Selector = function () { return _this.parent.selector() + " > ." + (_this.parent.lastDirection ? "H" : "V") + "dragbar"; };
        /**
         * ##### **(Dragbar Instance).size - [Coord](./_liefs_layout_manager_.coord.html)
         * Object containing dimensions needed to plot this Dragbar**
         *
         * internal use only - no reason to call/use
         */
        this.size = new Coord();
        /**
         * ##### **(Dragbar Instance).front - boolean showing if dragbar is at front of Item
         * `(Instance of Dragbar).front = true;` (true - default) or back of Item:
         * `(Instance of Dragbar).front = false;` (used when Item is "last" in Array)
         *
         * Note this parameter is set when defining and item, not here. See [Item](./_liefs_layout_manager_.item.html)
         *
         * internal use only - no reason to call/use
         */
        this.front = true;
        this.parent = item;
        this.front = front;
        if (document.querySelectorAll(this.Selector()).length)
            this.el = document.querySelectorAll(this.Selector())[0];
        else {
            this.el = document.createElement("div");
            this.el.className = Container.of(item).direction ? "Hdragbar" : "Vdragbar";
            if (this.parent.el.firstChild)
                this.parent.el.insertBefore(this.el, this.parent.el.firstChild);
            else
                this.parent.el.appendChild(this.el);
        }
        if (Dragbar.noInit) {
            onEvent(document.body, "mouseup", Dragbar.mouseUp);
            onEvent(document.body, "mousemove", Dragbar.mouseMove);
            Dragbar.noInit = false;
        }
        onEvent(this.el, "mousedown", function (e) { Dragbar.mouseDown(e, _this); });
        this.width = width || Container.of(item).margin || Container.marginDefault;
    }
    /**
     * ##### **Dragbar.mouseDown - Static Method:**
     *
     * internal use only - no reason to call/use - called when dragbar clicked
     */
    Dragbar.mouseDown = function (e, dragbar) {
        event.preventDefault();
        Dragbar.activeDragbar = dragbar;
        Dragbar.beforeCurrent = dragbar.parent.current;
        Dragbar.isDown = true;
        Dragbar.direction = Container.of(dragbar.parent).direction;
        Dragbar.dragstart = Dragbar.direction ? e.clientX : e.clientY;
    };
    /**
     * ##### **Dragbar.mouseUp - Static Method:**
     *
     * internal use only - no reason to call/use called when mouseUp
     */
    Dragbar.mouseUp = function (e) {
        Dragbar.isDown = false;
    };
    /**
     * ##### **Dragbar.mouseMove - Static Method:**
     *
     * internal use only - no reason to call/use - called when mousemove
     */
    Dragbar.mouseMove = function (e) {
        if (Dragbar.isDown) {
            event.preventDefault();
            var pItem = Dragbar.activeDragbar.parent;
            var dragDiff = (Dragbar.direction ? e.clientX : e.clientY) - Dragbar.dragstart;
            var newCurrent = vpx(Dragbar.beforeCurrent) + dragDiff;
            if (pItem.min && (newCurrent < vpx(pItem.min)))
                newCurrent = vpx(pItem.min);
            if (pItem.max && (newCurrent > vpx(pItem.max)))
                newCurrent = vpx(pItem.max);
            pItem.current = newCurrent.toString() + "px";
            Handler.resizeEvent();
        }
    };
    /**
     * ##### **(Dragbar Instance).update**
     *
     * internal use only - no reason to call/use
     * this function is called on resizeEvent to recalculate the Coord Class
     */
    Dragbar.prototype.update = function () {
        for (var _i = 0, _a = Object.keys(this.size); _i < _a.length; _i++) {
            var eachKey = _a[_i];
            this.size[eachKey] = this.parent.size[eachKey];
        }
        if (Container.of(this.parent).direction) {
            this.size.x += this.parent.size.width;
            this.size.width = this.width;
        }
        else {
            this.size.y += this.parent.size.height;
            this.size.height = this.width;
        }
        directiveSetStyles(this.el, {
            left: px(this.size.x), top: px(this.size.y), width: px(this.size.width), height: px(this.size.height)
        });
    };
    return Dragbar;
}());
/**
 * ##### **Dragbar.isDown - Static Boolean:**
 *
 * internal use only - no reason to call/use - Indicates that the mouse has been clicked on
 * a dragbar, and is waiting to come up
 */
Dragbar.isDown = false;
/**
 * ##### **Dragbar.noInit - Static Boolean:**
 *
 * internal use only - no reason to call/use - needs "on first instance set up"
 * false to start, true after first instance of Dragbar
 */
Dragbar.noInit = true;
/**
 * ##### **Item - Class Description:**
 *
 * Item is the very complicated KEY to making liefs-layout-manager work.
 * Read 'liefs-layout-manager CONCEPT PAGE' - before reding this page.
 * An Item is (a wrapper on ) an element, OR a "group" of elements TREATED as an element.
 * It is the basic building block of this project.
 *
 * Defining an item.
 * ```javascript
 * > new Item("SomeItemName", "100px"); // DO NOT USE THIS WAY - ONLY WORKS FOR SIMPLE EXAMPLES - I() uses TypeOf identification, this does not.
 * > I("SomeItemName", "100px");        // I() uses TypeOf Argument (both functions return Class Item Object)
 * ```
 * The above line indicates the following:
 *
 * 1. The First 'string' argument that doesn't end in 'px' or '%' is (Item Instance).label, in this case, "SiomeItemName".
 * it calls Item.selector("SomeItemName") to get the "css selector string for the Item"
 * the default uses the "id" therefore, the default is:
 * ```javascript
 * Item.selector = () => { return "#" + this.label; }  // where lable in this case is "SomeItemName"
 * ```
 * (see [Item.selector](./_liefs_layout_manager_.item.html#selector))
 * so.... default is id.... which I will assume is static for the rest of this documentation.
 * and returns the document.querySelector( Item.selector("SomeItemName") );
 * ... which means there has to be EXACTLY ONE element with id="SomeItemName"
 * If it does not have exactly one match, liefs-layout-manager throws a detailed error.
 *
 * 2. The First 'string' argument that ends in 'px' or '%'
 * (refered to as TypeOf 'start' [element size pixel value] - treated as different type than TypeOf 'string' [used for label and dirction indicator])
 * is assigned to (Item Instance).start
 * '100px' indicates that this item will be 100 pixels (parent.container.direction is horizontal) ? wide : high
 * '50%' indicates that the parent.container, after subtracting all the 'px' values, will use '50%'
 * of the remaining pixels to the (parent.container.direction is horizontal) ? width : height of this element (or element group)
 * ```javascript
 * > new Item("100px", "50px", "SomeItemName"); // note: the 'order of argument is sorted by TypeOf'
 * // above arguments have TypoOf 'start' ["100px", "50px"] and TypeOf 'string' ["SomeItemName"] - understanding this will help later
 * ```
 * 3. The Second 'string' argument that ends in 'px' or '%' is assigned to (Item Instance).min
 * by this value existing, it indicates that this (possibly grouped) element starts with 'start' value, but can
 * be "stretched" smaller to this new min value - by the automatic creation of an Item.Dragbar.
 * (div element child of Item element) See liefs-layout-manager.Dragbar
 * ```javascript
 * > new Item("100px", "50px", "SomeItemName", "200px"); // note: the 'order of argument is sorted by TypeOf'
 * ```
 * 4. The Third 'string' argument that ends in 'px' or '%' is assigned to (Item Instance).max
 * this obviously assigns a maximum value to Item.start - controlled by Item.Dragbar
 *
 * 5. Items Can be "extended" in the following way:
 * 5. A) By adding and Item within an Item - WITHOUT DIRECTIONAL INDICATOR (see below) indicates
 * that any Items as arguments of an Item, are refered to as PAGES. See liefs-layout-manager.PAGES
 * (Note this is different for WITH DIRECTIONAL INDICATOR see below)
 *
 * ```javascript
 * I("FirstPage" "100%", I("SecondPage"), I("ThirdPage"));  // this defines "FirstPage" as the first of pages under group name "FirstPage"
 * ```
 * The above indicates that initially, element with id="FirstPage" will be visible and the rest hidden
 * ```javascript
 * onclick='Item.setPage("FirstPage", "ThirdPage");' // this sets page directly
 * onclick='Item.nextPage("FirstPage");'             // loop through pages, back to beginning if at end
 * onclick='Item.nextPage("FirstPage", true);'       // loop through pages, STOP at end - no more.
 * onclick='Item.backPage("FirstPage");'             // cycle reverse, to end if back first Page
 * onclick='Item.backPage("FirstPage", true);'       // cycle reverse, There is "nothing" before first page
 * ```
 *
 * 5. B)
 * An Item DIRECTIONAL INDICATOR tells liefs-layout-manager that this item is to be the parent (grouping)
 * of a container.  This means that (Item Instance).container will point to a liefs-layout-manager.Container
 * That inner container will be assigned the DIRECTIONAL INDICATOR.
 * ```javascript
 * var other = I("ChildOfSomeItemName","100%"); // this will be the only child in the parent (Item instance).container
 *
 * > I("SomeItemName", "200px", "hor", other); // putting "hor" as an argument is a horizontal DIRECTIONAL INDICATOR
 * > I("-SomeItemName", other, "200px");       // putting "-" as a pre/post fix to the label name, will have
 * > I(other, "SomeItemName-", "200px");       // it removed from label name and is a horizontal DIRECTIONAL INDICATOR
 * > h("SomeItemName-", "200px", other);       // new function name, but all four here return (new Item() Class) same horizontal DIRECTIONAL INDICATOR
 * // personally, I like h() and v() as indicators, but I made it a personal choice.
 *
 * > I(other, "SomeItemName", "200px", "ver"); // putting "ver" as an argument is a vertical DIRECTIONAL INDICATOR
 * > I("|SomeItemName", other, "200px");       // putting "|" as a pre/post fix to the label name, will have
 * > I("SomeItemName|", "200px", other);       // it removed from label name and is a vertical DIRECTIONAL INDICATOR
 * > v("SomeItemName-", other, "200px");       // new function name, but all four here return (new Item() Class) same vertical DIRECTIONAL INDICATOR
 * /// fyi h() and v() really is the same function! it just adds the "ver" way for you
 * function v(...Arguments: any[]) { Arguments.push("ver"); return I(...Arguments);}
 * ```
 * I am over-stressing the point the the argument ORDER is by TypoOf.  The means that 'start' 'min' 'max'
 * must be in the correct order, because they are the same TypeOf.
 * Similarily, Items as arguments maintains the order they are listed.
 * having Items preceed, or follow 'start' 'min' 'max' - does not matter.
 *
 * with a DIRECTIONAL INDICATOR set, all Items in arguments WILL NOT be pages, but will instead be a row/column
 * of items, defined within that container.  The sum of all "start" %'s MUST total 100%, or an error is thrown.
 * values for 'px' are basically unchecked.
 *
 * ```javascript
 * h("-MainContainer", I("left", "30%"), I("tinymid", "100px"), I("right", "70%"), 10);
 * ```
 * the above line indicates the following:
 *
 * the h() function in front of MainContainer makes this Item Instance a horizontal container (not a page set)
 * (see list if indicators above)
 *
 * if there exists a single element id="MainContainer", use its page location as root, (for witdth, height)
 * otherwize use overall page size as root (width, height)
 *
 * there are exactly 3 elements is the document (usually divs) - with id="left", "tinymid", "right" respectivly
 *
 * after the width of parent is calculated, all the 'px' values are assigned... in this case 100px
 *
 * the remaining pixels are assigned 30% of them to id="left" element, and 70% to id="right" element.
 *
 * This one line alone is a "complete startup program" for liefs-layout-manager (See Handler for more details)
 *
 * the space between the Items is set to a margin of 10 pixels.
 */
var Item = (function () {
    /**
     * ##### **new Item() - Class constructor for Item Object :**
     *
     * There is no reason on the planet to make a `new Item()`
     * intead of:
     * ```javascript
     * var something = new Item();  // dont' do this! even the Author doesn't!
     * var something = I()          // Ah - this does things correctly
     * // both above return a new Item Object.
     * ```
     */
    function Item(label, start, min, max, container) {
        if (min === void 0) { min = undefined; }
        if (max === void 0) { max = undefined; }
        if (container === void 0) { container = undefined; }
        var _this = this;
        /**
         * ##### **(instance of Item).lastDirection - Boolean:**
         *
         * This is ignored, and will be removed
         */
        this.lastDirection = true;
        /**
         * ##### **(instance of Item).selector - Anonymous Function No Arguments :**
         *
         * liefs-layout-manager defaults to Item name = id of element.
         *
         * There is no reason to hold this to be true.  All calls to find elements from
         * the dom go through Item.selector... the default being:
         * ```javascript
         * selector = () => { return "#" + this.label; }; // so "Something" calls Document.querySelect("#" + "Something")
         * // which of course finds id - but this can be changed.
         * ```
         * Note: should you do this change, Since this method accesses "this" -> you must change in on EVERY INSTANCE
         * so something like
         * ```javascript
         * Item.prototype.selector = () => { return "[" + this.label + "]"; };
         * I("Something", "250px");  // ok now looking for <tagName id="unused" Something>
         * // note we have changed global scope of Item selector (from then on....)
         * // note in this case, 'Item' referers to the Item Static Class
         *
         * Item.prototype.selector = () => { return "[liefs=" + this.label + "]"; };
         * I("Something", "250px");  // ok now looking for <tagName id="unused" liefs="Something">
         * // note we have changed global scope of Item selector (from then on....)
         * // note in this case, 'Item' referers to the Item Static Class
         *
         * function i(item) { item.selector = () => { return "[" + this.label + "]"; }; return item; }
         * i(I("Something", "200px"));  // This should do the trick for "outliers"
         * // note we have not touched global scope of Item selector (at all..)
         * // note in this last case, 'item' referers to an instance
         *
         * Item.defineProperty(Subclass.prototype, "byClass", {
         *     get: function byClass() {
         *       this.selector = () => { return "[class=" + this.label + "]"; };
         *       return this;
         *     }
         * });
         * Item.defineProperty(Subclass.prototype, "byTagName", {
         *     get: function byTagName() {
         *       this.selector = () => { return this.label; };
         *       return this;
         *     }
         * });
         * I("Something", "200px"); // byId is default // could keep defaut
         * I("Something", "200px").byClass;            // and add all the types
         * I("Something", "200px").byTagName;          // you desire
         *
         * to implement liefs-layout-manager at all - just understand how to use selectors to find it.
         * ```
         */
        this.selector = function () { return "#" + _this.label; };
        var el;
        this.label = label;
        this.current = this.start = start;
        if (min)
            this.min = min;
        if (max)
            this.max = max;
        if (container)
            this.container = container;
        if (!(label in Item.items))
            Item.items[label] = [];
        this.instance = Item.items[label].length;
        Item.items[label].push(this);
        if (typeof Handler === "function")
            Handler.activate();
        if (this.start === "0px")
            Container.suspectedRoot = this.container;
        if (isUniqueSelector(this.selector())) {
            this.el = document.querySelectorAll(this.selector())[0];
            this.el["style"]["position"] = "fixed";
            if (min || max)
                setTimeout(function () { _this.dragBar = new Dragbar(_this); }, 0);
        }
        else if ((!this.container) && !("jasmineTests" in window))
            liefsError.badArgs("Selector Search for '" + this.label + "' to find ONE matching div", "Matched " + document.querySelectorAll(this.selector()).length.toString() + " times", "Handler Item Check");
    }
    /**
     * ##### **Item.get - Static Method:**
     *
     * It may be required for an Item to be part of two different layouts.
     *
     * If this is the case, you may choose to have the start, min, max values
     * consistent on both layout.... so pointing to the same Item.
     *
     * If you should choose different start, min, max values for the same Item
     * on a different layout, you would make a "second instance" of this Item.
     *
     * The part that can be confusing is how do you get the correct instance?
     *
     * If you have multiple instances of the same item, it might be wise to work
     * with your own varible names.
     * ```javascript
     * var SmallLayoutItem = I("PageIWantOnBothLayouts", "100px", "50px", "200px")  // this has different start, min, max than next
     * var LargeLayoutItem = I("PageIWantOnBothLayouts", "200px", "100px", "400px") // this has different start, min, max than next
     * ```
     * you can use Item.get():
     * ```javascript
     * Item.get("PageIWantOnBothLayouts")     // this defaults to the first instance created. for most cases this works great
     * Item.get("PageIWantOnBothLayouts", index)  // this requests the 'index'th inscance - but can be difficult to track.
     * @param label - string label (usually id) of the Item
     * @return (Instance Of) Item Object Class
     * ```
     */
    Item.get = function (label, instance) {
        if (instance === void 0) { instance = 0; }
        if (label in Item.items)
            return Item.items[label][instance];
        return undefined;
    };
    /**
     * ##### **Item.h - Static Method:**
     *
     * ... is really Item.I() - see Item Class explanation.
     */
    Item.h = function () {
        var Arguments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            Arguments[_i] = arguments[_i];
        }
        Arguments.push("hor");
        return I.apply(void 0, Arguments);
    };
    /**
     * ##### **Item.v - Static Method:**
     *
     * ... is really Item.I() - see Item Class explanation
     */
    Item.v = function () {
        var Arguments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            Arguments[_i] = arguments[_i];
        }
        Arguments.push("ver");
        return I.apply(void 0, Arguments);
    };
    /**
     * ##### **Item.I - Static Method:**
     *
     * see Item Class explanation
     */
    Item.I = function () {
        var Arguments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            Arguments[_i] = arguments[_i];
        }
        var newItem;
        var myArgsObj = argsObj(arguments);
        var Ilabel, Istart, Imin, Imax, Imargin;
        var Iitems, Icontainer, IisHor;
        var isItem;
        var IpageTitle;
        var dragFront = true;
        if ("array_Item" in myArgsObj) {
            if (!("Item" in myArgsObj))
                myArgsObj.Item = [];
            for (var _a = 0, _b = myArgsObj["array_Item"]; _a < _b.length; _a++) {
                var eachArray = _b[_a];
                for (var _c = 0, eachArray_1 = eachArray; _c < eachArray_1.length; _c++) {
                    var eachItem = eachArray_1[_c];
                    myArgsObj.Item.push(eachItem);
                }
            }
        }
        if ("number" in myArgsObj)
            Imargin = myArgsObj.number[0];
        if ("string" in myArgsObj) {
            for (var i = 0; i < myArgsObj.string.length; i++) {
                isItem = myArgsObj.string[i];
                if (isItem[0] === "*") {
                    myArgsObj.string[i] = isItem.slice(1);
                    dragFront = false;
                }
                if (isItem[0] === "-" || isItem[0] === "|") {
                    IisHor = (isItem[0] === "-");
                    myArgsObj.string[i] = isItem.slice(1);
                }
                if (isItem.slice(-1) === "-" || isItem.slice(-1) === "|") {
                    IisHor = (isItem.slice(-1) === "-");
                    myArgsObj.string[i] = isItem.slice(0, -1);
                }
                if (isItem.slice(0, 3) === "hor" || isItem.slice(0, 3) === "ver")
                    IisHor = (isItem.slice(0, 3) === "hor");
                else if (!(Ilabel))
                    Ilabel = myArgsObj.string[i];
                else if (!(IpageTitle))
                    IpageTitle = myArgsObj.string[i];
                if (isItem in Item.items) {
                    if (!myArgsObj["item"])
                        myArgsObj["item"] = [];
                    myArgsObj["item"].push(items[isItem]);
                }
            }
        }
        if ("start" in myArgsObj) {
            Istart = myArgsObj.start[0];
            if (myArgsObj.start.length > 1)
                Imin = myArgsObj.start[1];
            if (myArgsObj.start.length > 2)
                Imax = myArgsObj.start[2];
            if (myArgsObj.start.length > 3)
                liefsError.badArgs("Start, Min, Max", "That, and more!", "Create Instance Of Item() " + JSON.stringify(myArgsObj.start.slice(3)));
        }
        if ("Item" in myArgsObj) {
            Iitems = myArgsObj.Item;
        }
        if ("Container" in myArgsObj)
            Icontainer = myArgsObj.container[0];
        if (!Ilabel)
            Ilabel = "item" + (Object.keys(Item.items).length / 1000).toFixed(3).slice(-3);
        if (!Istart)
            Istart = "0px";
        if (Iitems && Icontainer)
            liefsError.badArgs("items, or a container.", "received both", "Create Instance Of Item() " + Ilabel);
        if (Iitems) {
            if (IisHor === undefined) {
                newItem = new Item(Ilabel, Istart, Imin, Imax);
                newItem.pages = Iitems;
                newItem.pages.unshift(newItem);
                newItem.currentPage = 0;
                return newItem;
            }
            else
                Icontainer = new Container(Ilabel, IisHor, Iitems, Imargin);
        }
        newItem = new Item(Ilabel, Istart, Imin, Imax, Icontainer);
        if (IpageTitle)
            newItem.pageTitle = IpageTitle;
        if (!dragFront)
            newItem.dragBar.front = dragFront;
        return newItem;
    };
    /**
     * ##### **Item.nextPage() - Static Method:**
     *
     * see Item Class explanation
     * @param item_ - ((instance of) Item Class) OR (string id name of - choosing first instance)- Root of Pages
     * @param stop - if true, endless loop of pages, if false, stops after first iteration.
     */
    Item.nextPage = function (item_, stop) {
        if (stop === void 0) { stop = false; }
        var item = Item.parseItem(item_);
        if (item.currentPage + 1 < item.pages.length)
            Item.setPage(item, item.currentPage + 1);
        else if (!stop)
            Item.setPage(item, 0);
    };
    /**
     * ##### **Item.backPage() - Static Method:**
     *
     * see Item Class explanation
     * @param item_ - ((instance of) Item Class) OR (string id name of - choosing first instance)- Root of Pages
     * @param stop - if true, endless loop of pages, if false, stops after first iteration.
     */
    Item.backPage = function (item_, stop) {
        if (stop === void 0) { stop = false; }
        var item = Item.parseItem(item_);
        if (item.currentPage > 0)
            Item.setPage(item, item.currentPage - 1);
        else if (!stop)
            Item.setPage(item, item.pages.length - 1);
    };
    /**
     * ##### **Item.setPage() - Static Method:**
     *
     *  see Item Class explanation
     * @param item_ - ((instance of) Item Class) OR (string id name of - choosing first instance)- Root of Pages
     * @param value - string id name of Child Page of above item_
     */
    Item.setPage = function (item_, value) {
        Item.parseValue(value, Item.parseItem(item_));
        Handler.resizeEvent();
    };
    /**
     * ##### **Item.setPageparseValue() - Static Method:**
     *
     * internal use only
     * is a sub-function of Item.setPage()
     */
    Item.parseValue = function (value_, item) {
        var foundPage = false;
        if (TypeOf(value_, "string")) {
            for (var i = 0; i < item.pages.length; i++)
                if (item.pages[i].label === value_) {
                    item.currentPage = i;
                    foundPage = true;
                    break;
                }
            if (!foundPage)
                liefsError.badArgs("page id not found", value_, "Item setPage");
        }
        else {
            if (item.pages.length - 1 < value_)
                liefsError.badArgs("Max Pages for " + item.label + " is " + item.pages.length, value_.toString(), "Item setPage");
            item.currentPage = value_;
        }
    };
    /**
     * ##### **Item.parseItem() - Static Method:**
     *
     * @param item_ - ((instance of) Item Class) OR (string id name of - choosing first instance)- Root of Pages
     * @return (intance of) Item Class
     */
    Item.parseItem = function (item_) {
        var item;
        if (TypeOf(item_, "string")) {
            if (!isItIn(item_, Item.items))
                liefsError.badArgs("Item Name Not Identified", item_, "Item - setPage()");
            item = Item.items[item_][0];
        }
        else
            item = item_;
        if (!item.pages)
            liefsError.badArgs("Item " + item.label + " to be defined with pages", "it wasn't", "Item - setPage()");
        return item;
    };
    /**
     * ##### **Item.page() - Static Method:**
     *
     * @param item - ((instance of) Item Class)
     * @return (intance of) Item Class - If this item is not root of pages, returns arugment item, otherwize returns current page Item.
     */
    Item.page = function (item) { return (item.pages) ? item.pages[item.currentPage] : item; };
    return Item;
}());
Item.debug = true;
/**
 * ##### **Item.items - Object of string keys, and Array<Item> values:**
 *
 * This is where all the items are 'stored'
 * note: it is an object (key-id) (value list of Items) NOT (value Item)
 * ```javascript
 * Item.items["SomeItemName"][0]; // points to the first "SomeItemName" Item Created
 * ```
 * probably better to use Item.get()
 */
Item.items = {};
/**
 * ### Please Start [here](https://liefs.github.io/classes/_liefs_layout_manager_.item.html)
 *
 * then read on after you have read above - or it wont make any sense.
 *
 * ##### ** var I = Item.I:**
 * See [liefs-layout-manager.Item.I()](https://liefs.github.io/classes/_liefs_layout_manager_.item.html)
 */
var I = Item.I;
/**
 * ##### ** var v = Item.I:**
 *
 * See [liefs-layout-manager.Item.I() ](https://liefs.github.io/classes/_liefs_layout_manager_.item.html)
 */
var v = Item.v;
/**
 * ##### ** var h = Item.I:**
 *
 * See [liefs-layout-manager.Item.I() ](https://liefs.github.io/classes/_liefs_layout_manager_.item.html)
 */
var h = Item.h;
/**
 * ##### ** var h = Item.I:**
 *
 * See [liefs-layout-manager.Item.items ](https://liefs.github.io/classes/_liefs_layout_manager_.item.html#items)
 */
var items = Item.items;
/**
* ##### **Container - Class Description:**
*
* a (instance of Container) is simply a column OR (Never And) a row of Items.
*
* A Container is an essential part of how liefs-layout-manager works.  That being said,
* it is mostly invisible - which can be confusing.
*```javascript
* var l=I("LeftSide","200px"); // This defines an (instance of Item) - No Containers
*```
* The above only defines a Item.
*```javascript
* var B=h("Both", I("LeftSide","200px"), I("RightSide","100%")); // This line creates 3 Items, and 1 Container.
*```
* The above does the following:
* * Defines (instace of Item) "LeftSide"
* * Defines (instace of Item) "RightSide"
* * Defines (instace of Container) "Both" - with array of [LeftSide, RightSide] - horizontal direction indicator
* * Defines (instance of Item) "Both" - with (instance of Item).container = (the above line)
*
* Understanding the above, there is no need to access the Container Directly.
* with the intension of making liefs-layout-manager easier to use, you ALWAYS refer to the Item.
* ...so even when we want data from a Container, we use the Item, and liefs-layout-manager finds the
* matching container in the background.
*
* It is helpful, if not key, Understanding this.
*/
var Container = (function () {
    /**
    * ##### **Container constructor **
    * This is done "automatically" by liefs-layout-manager using Item.I()
    * Do not call/use this - interlal use only
    */
    function Container(label, trueIsHor, items, margin) {
        if (margin === void 0) { margin = Container.marginDefault; }
        var _this = this;
        /**
        * ##### **(instance of Container).items Array<Item> **
        * this is the Array<Items> that make up a row/column container
        * internal use only.  Can be accesses with:
        */
        this.items = [];
        /**
        * ##### **(instance of Container).selector **
        * Identical to (see) Item.selector
        */
        this.selector = function () { return "#" + _this.label; };
        console.log("Defined Container" + label);
        this.label = label;
        this.direction = trueIsHor;
        this.items = items;
        this.margin = margin;
        Container.containers[label] = Container.lastDefined = this;
        this.itemsCheck();
        if (isUniqueSelector(this.selector()))
            this.el = document.querySelectorAll(this.selector())[0];
    }
    /**
    * ##### **Container.of() - function: Static**
    * @param item (instance of Item) - Child Item Looking for parent
    *```javascript
    * (instance of Item).container;       // this returns the container child of the (instance of Item)
    * // ... so returns CHILD Of ITEM (Container)
    * Container.of( (instance of Item) );
    * // The above line returns the container that contains this exact (insance of Item)
    * // as one of its children
    * // ... so returns PARENT Of ITEM (Container)
    *```
    * @return (instance of Container)
    */
    Container.of = function (item) {
        for (var _i = 0, _a = Object.keys(Container.containers); _i < _a.length; _i++) {
            var eachKey = _a[_i];
            if (Container.containers[eachKey].items.indexOf(item) > -1)
                return Container.containers[eachKey];
        }
        console.log("Container of Error: Containers");
        console.log(Container.containers);
        console.log(item);
        return undefined;
    };
    /**
    * ##### **Container.get() - function: Static**
    * @param label - label of (instance of Item)
    *```javascript
    * Container.get("SomeItemLabel");  // returns (instance of Container)
    *```
    * @return (instance of Container)
    */
    Container.get = function (label) {
        if (label in Container.containers)
            return Container.containers[label];
        return undefined;
    };
    /**
    * ##### **Container.push() - function: Static**
    * @param container - (instance of Container)
    * @return (instance of Container)
    * No reason to use this - internal use -
    * ...as the Containers are defines, push them on to the "Array<defined>"
    * `Container.containers`
    */
    Container.push = function (container) {
        Container.containers[container.label] = container;
        return container;
    };
    /**
    * ##### **Container.fixed() - function: Static**
    * @param container - (instance of Container)
    * @param width - number - new width used in calculations
    * @param height - number - new height used in calculations
    * @return number - sum of fixed pixels
    *
    * The 'Magic' that calculates all the Coord Classes is here in Contianer Class.
    * This is step 1 of 3
    * this step adds all the 'px' values in the row/column of the container, and returns them.
    * They will be subtracted from available pixels for %
    *
    * This is an internal function - no need to call/use
    */
    Container.fixed = function (container, width, height) {
        var NOTDEFINED = -999;
        var fixed = 0;
        var newSize = NOTDEFINED;
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var eachItem = _a[_i];
            if (!(eachItem.size))
                eachItem.size = new Coord;
            if (eachItem.current.slice(-2) === "px")
                newSize = parseInt(eachItem.current.slice(0, -2));
            if (newSize !== NOTDEFINED) {
                fixed = fixed + newSize;
                eachItem.size.width = (container.direction) ? newSize : width - container.margin * 2;
                eachItem.size.height = (container.direction) ? height - container.margin * 2 : newSize;
                newSize = NOTDEFINED;
            }
        }
        return fixed;
    };
    /**
    * ##### **Container.percent() - function: Static**
    * @param container - (instance of Container)
    * @param width - number - new width used in calculations
    * @param height - number - new height used in calculations
    * @param fixed - number - fixed value calculated in Contaner.fixed()
    *
    * The 'Magic' that calculates all the Coord Classes is here in Contianer Class.
    * This is step 2 of 3
    * this step divides the remaining pixels (after minusing all the constant px values)
    * and splits them according to the % values defined in each (instance of Item) in the (Container.items Array)
    *
    * This is an internal function - no need to call/use
    */
    Container.percent = function (container, width, height, fixed) {
        var max = (container.direction) ? width : height;
        var pixelsLeftForPercent = (max - fixed - container.margin * (container.items.length + 1));
        var newPercent;
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var eachItem = _a[_i];
            eachItem.lastDirection = container.direction;
            if ((typeof eachItem.current === "string") && eachItem.current.slice(-1) === "%") {
                newPercent = parseInt(eachItem.current.slice(0, -1));
                eachItem.size.width = (container.direction) ? parseInt((pixelsLeftForPercent * (newPercent / 100)).toFixed(0))
                    : width - container.margin * 2;
                eachItem.size.height = (container.direction) ? height - container.margin * 2
                    : parseInt((pixelsLeftForPercent * (newPercent / 100)).toFixed(0));
            }
        }
    };
    /**
    * ##### **Container.fill() - function: Static**
    * @param container - (instance of Container)
    * @param xOffset - number - Offset of container, relative to parents
    * @param yOffset - number - Offset of container, relative to parents
    *
    * The 'Magic' that calculates all the Coord Classes is here in Contianer Class.
    * This is step 3 of 3
    * this applys the results of Container.fixed, and Container.percent
    * and fills the Item.size (Coord Object) with the results calculated
    *
    * This is an internal function - no need to call/use
    */
    Container.fill = function (container, xOffset, yOffset) {
        if (xOffset === void 0) { xOffset = 0; }
        if (yOffset === void 0) { yOffset = 0; }
        var margin = container.margin;
        var sum = margin;
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var eachItem = _a[_i];
            if (container.direction) {
                eachItem.size.x = xOffset + sum;
                sum = sum + eachItem.size.width + margin;
                eachItem.size.y = yOffset + margin;
            }
            else {
                eachItem.size.x = xOffset + margin;
                eachItem.size.y = yOffset + sum;
                sum = sum + eachItem.size.height + margin;
            }
        }
    };
    /**
    * ##### **Container.updateRecursive() - function: Static**
    * This is an internal function - no need to call/use
    *
    */
    Container.updateRecursive = function (width, height, container, xOffset, yOffset, includeParents) {
        if (xOffset === void 0) { xOffset = 0; }
        if (yOffset === void 0) { yOffset = 0; }
        if (includeParents === void 0) { includeParents = false; }
        var returnObject = {};
        Container.percent(container, width, height, Container.fixed(container, width, height));
        Container.fill(container, xOffset, yOffset);
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var thisItem = _a[_i];
            var width_1 = thisItem.size.width + container.margin * 2;
            var height_1 = thisItem.size.height + container.margin * 2;
            var x = thisItem.size.x - container.margin;
            var y = thisItem.size.y - container.margin;
            if ("container" in thisItem && (thisItem["container"])) {
                if (includeParents)
                    returnObject[thisItem.label] = thisItem.size;
                var temp = Container.updateRecursive(width_1, height_1, thisItem.container, x, y);
                for (var attrname in temp)
                    returnObject[attrname] = temp[attrname];
            }
            returnObject[thisItem.label] = thisItem.size;
        }
        return returnObject;
    };
    /**
    * ##### **Container.root (instance of Container) Class STATIC **
    * Seeing the whole function is the best explanation:
    *```javascript
    * static root() { return (Container.suspectedRoot) ? Container.suspectedRoot : Container.lastDefined;}
    *```
    */
    Container.root = function () {
        return (Container.suspectedRoot)
            ? Container.suspectedRoot : Container.lastDefined;
    };
    /**
    * ##### **(instance of Container).itemsCheck() function **
    * When a Container is defined, this function checks to see that the % values total 100 percent
    */
    Container.prototype.itemsCheck = function () {
        var totalPercent = 0;
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var eachItem = _a[_i];
            if (eachItem.start.slice(-1) === "%")
                totalPercent += parseInt(eachItem.start.slice(0, -1));
        }
        if (totalPercent !== 100)
            liefsError.badArgs(this.label + " to total 100%", " a total of " + totalPercent.toString() + "%", "Container.itemsCheck()");
    };
    /**
    * ##### **(instance of Container).update() function **
    * This function calles a recursive update of container - items.
    * it is called by resizeEvent.
    *
    * If you would like to "test" your layout - you can pop some co-ordinates here to check
    *```javascript
    * Container.get("SomeGroupName").update(1920, 1080); // this returns an object of co-ordinates call this to test layout
    *```
    */
    Container.prototype.update = function (width, height, xOffset, yOffset, includeParents) {
        if (xOffset === void 0) { xOffset = 0; }
        if (yOffset === void 0) { yOffset = 0; }
        if (includeParents === void 0) { includeParents = false; }
        this.lastUpdate = Container.updateRecursive(width, height, this, xOffset, yOffset, includeParents);
    };
    /**
    * ##### **(instance of Container).itemByLabel() function **
    * debating if this function has merit - on the axe list.
    * just use Item.get("SomeLabel");
    */
    Container.prototype.itemByLabel = function (label) {
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.label === label)
                return item;
            else if (item.container && item.container.itemByLabel(label))
                return item.container.itemByLabel(label);
        }
        return undefined;
    };
    return Container;
}());
/**
* ##### **Container.debug STATIC **
* This has not been implemented yet
*/
Container.debug = true;
/**
* ##### **Container.containers Object of key label value Container STATIC **
* This is where the complete list of Containers is stored.
* Internal use - although I CAN think of reasons to access
*/
Container.containers = {};
/**
* ##### **Container.marginDefault number STATIC **
* All Items are separated by (instance of Container).margin pixels.
* If margin Value is not indicated at time of creation, this default is assumed.
*```javascript
* Container.marginDefault = 10; // This changed the margin Default to 10 pixels
*```
*/
Container.marginDefault = 4;
/**
* ##### **Layout - Class Description:**
* Layout is a Class that stores all properties relating to A Layouts.
*
* A Layout simply a Container (Class), and a conditionalFunction.
*
* A Handler is a list of Layouts.  On Resize Event, The Handler
* traverses the list of layouts.  When it finds a conditionalFunction to be true,
* it sets that Handler (Often the whole screen) to the Container of that Layout.
*
* This class can be reached (not at all easiliy.... why would you?)
* by Handler.handlers[index usually 0].layouts[index usually 0]
*/
var Layout = (function () {
    /**
    * ##### **(Layout Instance).constructor()**
    *
    * @param Arguments expects:
    *
    * label (string) (Optional)
    *
    * Container (Class Container) Object (required)
    *
    * Anonymous Function two arguments Handler (screen) Width, and Height
    *
    * these arguments can be supplied in any order. (Sorted by TypeOf)
    */
    function Layout() {
        var Arguments = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            Arguments[_i] = arguments[_i];
        }
        /**
        * ##### **(Layout Instance).isActive - Boolean:**
        * Will be removed in later revisions.
        */
        this.isActive = true;
        /**
        * ##### **(Layout Instance)setArgsObj - Function Reference:**
        * Points to liefs-layout-manager.lib.setArgsObj which uses "this"
        */
        this.setArgsObj = setArgsObj;
        if (TypeOf(arguments[0]).slice(0, 5) === "array") {
            this.myArgsObj = argsObj(arguments[0]);
        }
        else
            this.myArgsObj = argsObj(arguments);
        this.label = this.setArgsObj("string", 0, "layout ");
        this.conditionalFunction = this.setArgsObj("function", 0, "layout ");
        this.container = this.setArgsObj("Container", 0, "layout ");
        if ("Item" in this.myArgsObj) {
            this.container = (this.myArgsObj.Item[0]).container;
            if (!this.container)
                throw liefsError.badArgs("Container or Item-Parent of Container", "Item - not the Parent of a Container", "New Layout" + ((this.label) ? " '" + this.label + "'" : ""));
        }
        if (!(this.container && this.conditionalFunction)) {
            liefsError.badArgs("At Least One Function and One Item/Container", JSON.stringify(Object.keys(this.myArgsObj)), "Create Instance Of Layout()");
        }
    }
    return Layout;
}());
/**
* ##### ** L - Fuction Description:**
*```javascript
* L()           // is identical to:
* new Layout()
*```
*/
function L() {
    var Arguments = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        Arguments[_i] = arguments[_i];
    }
    return new Layout(Arguments);
}
