/**/function isIn(obj, key) {
    return (key in obj);
}
function isDefined(thing) {
    return !(thing === undefined);
}
function asString(it) {
    if (it['italics'] !== undefined)
        return it;
    return undefined;
}
function asNumber(it) {
    if (it['toFixed'] !== undefined)
        return it;
    return undefined;
}
function asArray(it) {
    if (it.concat !== undefined)
        return it;
    return undefined;
}
function isItem(it) {
    return isDefined(it) && isIn(it, 'label') && isIn(it, 'start') && isIn(it, 'size');
}
function isPosition(it) {
    return isIn(it, 'x') && isIn(it, 'y') && isIn(it, 'width') && isIn(it, 'height');
}
function isContainer(it) {
    return isIn(it, 'label') && isIn(it, 'direction') && isIn(it, 'items') && isIn(it, 'margin');
}
function checkItem(item) {
}
function checkContainer(container) {
}
function newItem(label, start, is_a_container) {
    if (is_a_container === void 0) { is_a_container = null; }
    var realstart;
    if (asString(start))
        realstart = start;
    else
        realstart = start.toString() + "px";
    var new_item = { label: label, start: realstart, size: _newCoordinates() };
    if (eh)
        checkItem(new_item);
    items[label] = new_item;
    if (is_a_container)
        items[label]['is_a_container'] = is_a_container;
    if (eh)
        checkItem(items[label]);
    return items[label];
}
function newContainer(label, true_is_hor, items, margin) {
    if (margin === void 0) { margin = marginDefault; }
    var new_container = {
        label: label,
        direction: true_is_hor,
        items: items,
        margin: margin
    };
    if (eh)
        checkContainer(new_container);
    containers[label] = new_container;
    return containers[label];
}
function update(width, height, container, x_offset, y_offset, include_parents) {
    if (x_offset === void 0) { x_offset = 0; }
    if (y_offset === void 0) { y_offset = 0; }
    if (include_parents === void 0) { include_parents = false; }
    return _Private._updateRecursive(width, height, container, x_offset, y_offset, include_parents);
}
var containers = {};
var items = {};
var eh = false; // errorHandling
var marginDefault = 0;
var magrinLast = 0;
function HC(id, margin, arrayOfItems) {
    if (margin === void 0) { margin = marginDefault; }
    return newContainer("_" + id, true, arrayOfItems, margin);
}
function VC(id, margin, arrayOfItems) {
    if (margin === void 0) { margin = marginDefault; }
    return newContainer("_" + id, false, arrayOfItems, margin);
}
function I(id, start, container) {
    if (container === void 0) { container = undefined; }
    return newItem(id, start, container);
}
function HI(id, start, margin, arrayOfItems) {
    return I(id, start, newContainer("_" + id, true, arrayOfItems));
}
function VI(id, start, margin, arrayOfItems) {
    return I(id, start, newContainer("_" + id, false, arrayOfItems));
}
function V(id, field2, field3) {
    if (field3 === void 0) { field3 = undefined; }
    var arrayOfItems = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        arrayOfItems[_i - 3] = arguments[_i];
    }
    return HVC(id, field2, field3, arrayOfItems, VC, VI);
}
function H(id, field2, field3) {
    if (field3 === void 0) { field3 = undefined; }
    var arrayOfItems = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        arrayOfItems[_i - 3] = arguments[_i];
    }
    return HVC(id, field2, field3, arrayOfItems, HC, HI);
}
function v(id, field2, field3) {
    if (field3 === void 0) { field3 = undefined; }
    var arrayOfItems = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        arrayOfItems[_i - 3] = arguments[_i];
    }
    return HVC(id, field2, field3, arrayOfItems, VC, VI);
}
function h(id, field2, field3) {
    if (field3 === void 0) { field3 = undefined; }
    var arrayOfItems = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        arrayOfItems[_i - 3] = arguments[_i];
    }
    return HVC(id, field2, field3, arrayOfItems, HC, HI);
}
function HVC(id, field2, field3, arrayOfItems, Droot2, D2) {
    if (field3 === void 0) { field3 = undefined; }
    var margin;
    var start;
    var newarrayOfItems;
    if (asNumber(field2)) {
        margin = asNumber(field2);
        if (isDefined(field3) && isItem(field3)) {
            arrayOfItems.unshift(field3);
            return Droot2(id, margin, arrayOfItems);
        }
        else
            throw "error";
    }
    else if (asString(field2)) {
        start = field2;
        if (asNumber(field3)) {
            margin = asNumber(field3);
            return D2(id, start, margin, arrayOfItems);
        }
        else if (isItem(field3)) {
            return D2(id, start, undefined, [field3].concat(arrayOfItems));
        }
        else
            throw "error";
    }
    else if (isItem(field2)) {
        newarrayOfItems = [field2];
        if (isItem(field3))
            newarrayOfItems.push(field3);
        else if (isDefined(field3))
            throw "Unexpected";
        return Droot2(id, undefined, newarrayOfItems.concat(arrayOfItems));
    }
}
function _newCoordinates(width, height, x, y, label) {
    if (width === void 0) { width = 0; }
    if (height === void 0) { height = 0; }
    if (x === void 0) { x = 0; }
    if (y === void 0) { y = 0; }
    if (label === void 0) { label = null; }
    var return_object = { x: x, y: y, width: width, height: height };
    if (label)
        return_object['label'] = label;
    return return_object;
}
var _Private = (function () {
    function _Private() {
    }
    _Private._updateRecursive = function (width, height, container, x_offset, y_offset, include_parents) {
        if (x_offset === void 0) { x_offset = 0; }
        if (y_offset === void 0) { y_offset = 0; }
        if (include_parents === void 0) { include_parents = false; }
        var fixed = _Private._fixed(container, width, height);
        var ReturnObject = {};
        _Private._percent(container, width, height, fixed);
        _Private._fill(container, x_offset, y_offset);
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var this_item = _a[_i];
            var width_1 = this_item.size.width + container.margin * 2;
            var height_1 = this_item.size.height + container.margin * 2;
            var x = this_item.size.x - container.margin;
            var y = this_item.size.y - container.margin;
            if ('is_a_container' in this_item) {
                if (include_parents)
                    ReturnObject[this_item.label] = this_item.size;
                var temp = _Private._updateRecursive(width_1, height_1, this_item.is_a_container, x, y);
                for (var attrname in temp)
                    ReturnObject[attrname] = temp[attrname];
            }
            ReturnObject[this_item.label] = this_item.size;
        }
        return ReturnObject;
    };
    _Private._fixed = function (container, width, height) {
        var NOT_DEFINED = -999;
        var fixed = 0;
        var new_size = NOT_DEFINED;
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var each_item = _a[_i];
            if (each_item.start.slice(-2) === "px")
                new_size = parseInt(each_item.start.slice(0, -2));
            if (new_size !== NOT_DEFINED) {
                fixed = fixed + new_size;
                if (!container.direction) {
                    each_item.size.width = width - container.margin * 2;
                    each_item.size.height = new_size;
                }
                else {
                    each_item.size.width = new_size;
                    each_item.size.height = height - container.margin * 2;
                }
                new_size = NOT_DEFINED;
            }
        }
        return fixed;
    };
    _Private._percent = function (container, width, height, fixed) {
        var pixels_left_for_percent;
        var max = (container.direction) ? width : height;
        var new_percent_total;
        pixels_left_for_percent = (max - fixed - container.margin * (container.items.length + 1));
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var each_item = _a[_i];
            if ((typeof each_item.start === "string") && each_item.start.slice(-1) === "%") {
                var new_percent = parseInt(each_item.start.slice(0, -1));
                if (container.direction) {
                    each_item.size.width = parseInt((pixels_left_for_percent * (new_percent / 100)).toFixed(0));
                    each_item.size.height = height - container.margin * 2;
                }
                else {
                    each_item.size.width = width - container.margin * 2;
                    each_item.size.height = parseInt((pixels_left_for_percent * (new_percent / 100)).toFixed(0));
                }
            }
        }
    };
    _Private._fill = function (container, x_offset, y_offset) {
        if (x_offset === void 0) { x_offset = 0; }
        if (y_offset === void 0) { y_offset = 0; }
        var margin = container.margin;
        var sum = margin;
        for (var _i = 0, _a = container.items; _i < _a.length; _i++) {
            var each_item = _a[_i];
            if (container.direction) {
                each_item.size.x = x_offset + sum;
                sum = sum + each_item.size.width + margin;
                each_item.size.y = y_offset + margin;
            }
            else {
                each_item.size.x = x_offset + margin;
                each_item.size.y = y_offset + sum;
                sum = sum + each_item.size.height + margin;
            }
        }
    };
    return _Private;
}());
var ManageArray;
var ManageCurrent;
var winW;
var winH;
var CurrentContainer;
var CurrentSize;
var callback;
var DivIdsVisible = [];
var DivIdsInvisible = [];
var callbackThrottleId;
var resizeCallbackThrottle = 0;
var topDirective;
var verbose = true;
function el(id) {
    return document.getElementById(id);
}
function startHandler() {
    window.onresize = window_resize;
    checkLoads();
    checkWinWH();
}
function stopHandler() {
    window.onresize = function () {
    };
}
function window_resize(e) {
    window.clearTimeout(callbackThrottleId);
    callbackThrottleId = window.setTimeout(checkWinWH, resizeCallbackThrottle);
}
function manageAdd(containerLabel, max_width, max_height) {
    if (max_width === void 0) { max_width = undefined; }
    if (max_height === void 0) { max_height = undefined; }
    ManageArray.push([containerLabel, max_width, max_height]);
    return [containerLabel, max_width, max_height];
}
function use(ContainerId) {
    if (ContainerId[0] !== '_')
        ContainerId = '_' + ContainerId;
    if (ContainerId in containers) {
        if (CurrentContainer !== containers[ContainerId]) {
            CurrentContainer = containers[ContainerId];
            if (verbose)
                console.log("Container " + ContainerId + " found. Setting CurrentContainer");
            ShowAndHide();
        }
    }
    else if (verbose)
        console.log("Container: " + ContainerId.slice(1) + " not Found");
}
function manageSet(obj) {
    if (obj === void 0) { obj = undefined; }
    if (obj === undefined)
        ManageCurrent = undefined;
    else
        ManageCurrent = obj;
    checkWinWH();
}
function checkWinWH() {
    if (document.body && document.body.offsetWidth) {
        winW = document.body.offsetWidth;
        winH = document.body.offsetHeight;
    }
    if (document.compatMode == 'CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth) {
        winW = document.documentElement.offsetWidth;
        winH = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
        winW = window.innerWidth;
        winH = window.innerHeight;
    }
    checkManage([winW, winH]);
    resize_callback([winW, winH]);
}
function checkManage(obj) {
    var CurrentWidth = obj[0];
    var CurrentHeight = obj[1];
    var UseThisManage;
    if (ManageArray) {
        console.log("Current ManageArray");
        console.log(ManageArray);
        for (var _i = 0, ManageArray_1 = ManageArray; _i < ManageArray_1.length; _i++) {
            var ThisManage = ManageArray_1[_i];
            UseThisManage = true;
            if (ThisManage[1])
                UseThisManage = (CurrentWidth <= ThisManage[1]);
            if (UseThisManage && ThisManage[2])
                UseThisManage = (CurrentHeight <= ThisManage[2]);
            if (UseThisManage)
                if (ThisManage[0] !== CurrentContainer.label) {
                    console.log("checkManage switch to " + ThisManage[0]);
                    use(ThisManage[0]);
                    break;
                }
        }
    }
}
function px(p, key) {
    return p[key].toString() + "px";
}
function resize_callback(length_width) {
    CurrentSize = { length: length_width[0], width: length_width[1] };
    var Coordinates = update(length_width[0], length_width[1], CurrentContainer);
    var El;
    for (var id in Coordinates) {
        var p = Coordinates[id];
        El = el(id);
        if (El !== null) {
            El.style.left = px(p, 'x');
            El.style.top = px(p, 'y');
            El.style.width = px(p, 'width');
            El.style.height = px(p, 'height');
        } // else console.log("IT was null!");
    }
    if (callback !== undefined)
        callback(Coordinates);
}
function ShowAndHide() {
    var index;
    DivIdsInvisible = [];
    DivIdsVisible = [];
    for (var key in items)
        if (el(key)) {
            el(key).style.position = "fixed";
            DivIdsInvisible.push(key);
        }
    console.log("Shwo and Hide");
    console.log(update(1000, 1000, CurrentContainer));
    for (var key in update(1000, 1000, CurrentContainer)) {
        index = DivIdsInvisible.indexOf(key);
        if (index > -1) {
            DivIdsInvisible.splice(index, 1);
            DivIdsVisible.push(key);
        }
    }
    for (var _i = 0, DivIdsVisible_1 = DivIdsVisible; _i < DivIdsVisible_1.length; _i++) {
        var ItemId = DivIdsVisible_1[_i];
        smallit(el(ItemId), "visible");
    }
    for (var _a = 0, DivIdsInvisible_1 = DivIdsInvisible; _a < DivIdsInvisible_1.length; _a++) {
        var ItemId = DivIdsInvisible_1[_a];
        smallit(el(ItemId), "hidden");
    }
}
function smallit(e, visibility) {
    if (e) {
        e.style.visibility = visibility;
        e.style.left = "1px";
        e.style.top = "1px";
        e.style.width = "1px";
        e.style.height = "1px";
    }
}
function starts() {
    var ret_dict = {};
    for (var _i = 0, _a = directive('[start]', ["id", "start", "contains"]); _i < _a.length; _i++) {
        var each = _a[_i];
        ret_dict[each['id']] = each;
        each['el'].style.position = "fixed";
    }
    return ret_dict;
}
function liefs() {
    var ret_dict = {};
    for (var _i = 0, _a = directive('liefs', ["margin", "callback", "contains", "vertical", "id"]); _i < _a.length; _i++) {
        var each = _a[_i];
        if (topDirective === undefined)
            topDirective = each;
        each['margin'] = parseInt(each['margin']);
        ret_dict[each['id']] = each;
    }
    return ret_dict;
}
function BuildContainers() {
    var Starts = starts();
    DivIdsVisible = [];
    DivIdsInvisible = [];
    for (var key in Starts)
        if (Starts[key].tagname !== 'liefs')
            DivIdsInvisible.push(Starts[key].id);
    var temp = liefs();
    if (topDirective) {
        if (verbose)
            console.log("Building Containers");
        return BuildContainersRecursive(marginDefault, topDirective, temp);
    }
    return undefined;
}
function BuildContainersRecursive(current_margin, liefDirective, liefDirectivesObjectOf) {
    var index;
    var ItemList = [];
    var thisStart;
    var dictStart = starts();
    var ret_;
    var true_is_hor = true;
    if (liefDirective.vertical) {
        if (verbose)
            console.log("Building " + liefDirective.id + " defined as Vertical.");
        //        if (verbose) console.log(liefDirective);
        true_is_hor = false;
    }
    else {
        if (verbose)
            console.log("Building " + liefDirective.id + " Assumed Horizontal");
    }
    if ('margin' in liefDirective) {
        current_margin = liefDirective.margin;
        if (verbose)
            console.log("Found margin " + current_margin);
    }
    else if (verbose)
        console.log("Using Default Margin of " + current_margin);
    for (var _i = 0, _a = liefDirective.contains.split("|"); _i < _a.length; _i++) {
        var LiefItemId = _a[_i];
        var new_item = void 0;
        if (!(LiefItemId in dictStart))
            throw LiefItemId + " Either Missing, or 'start' attribute missing";
        thisStart = dictStart[LiefItemId];
        index = DivIdsInvisible.indexOf(thisStart.id);
        if (index > -1) {
            DivIdsInvisible.splice(index, 1);
            DivIdsVisible.push(LiefItemId);
        }
        if (thisStart.contains === null) {
            if (verbose)
                console.log("Adding Item " + LiefItemId + "(" + thisStart.start + ")");
            new_item = newItem(LiefItemId, thisStart.start);
        }
        else
            new_item = newItem(LiefItemId, thisStart.start, BuildContainersRecursive(current_margin, liefDirectivesObjectOf[LiefItemId], liefDirectivesObjectOf));
        items[LiefItemId] = new_item;
        ItemList.push(new_item);
    }
    containers[liefDirective.id] = newContainer(liefDirective.id, true_is_hor, ItemList, current_margin);
    return containers[liefDirective.id];
}
function Objectassign(obj) {
    var ro = {};
    for (var key in obj)
        ro[key] = obj[key];
    return ro;
}
function directive(querrySelectorAll, attributesList) {
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
                        if (each['id'] !== undefined)
                            if (each['id'] === NodeList[i].id)
                                Obj[eachAttribute] = true;
            }
            else
                Obj[eachAttribute] = NodeList[i].getAttribute(eachAttribute);
        }
        returnArray.push(Objectassign(Obj));
    }
    return returnArray;
}
function directiveSetStyles(el, stylesObject) {
    for (var key in stylesObject)
        el['style'][key] = stylesObject[key];
}
function checkLoads() {
    //    console.log(window['loadlist']);
    if (window['loadlist'] === undefined)
        window['loadlist'] = [];
    var newlist = [];
    for (var _i = 0, _a = directive("[urlload]", ['urlload', 'id']); _i < _a.length; _i++) {
        var each = _a[_i];
        if (window['loadlist'].indexOf(each['id']) === -1) {
            window['loadlist'].push(each['id']);
            newlist.push([each['id'], each['urlload']]);
        } // else console.log(window['loadlist'].indexOf(each['id']));
    }
    if (newlist.length) {
        liefloads(newlist);
        waitForIt(function () {
            return window['loadsDone'];
        }, function () {
            checkLoads();
        });
    }
}
function start() {
    var temp = BuildContainers();
    if (temp) {
        use(temp.label);
        if (verbose)
            console.log("Starting Handler");
        startHandler();
    }
}
function loadDoc(eid, page) {
    var e = document.getElementById("c" + eid);
    if (e) {
        console.log("Found " + eid);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                e.innerHTML = this.responseText;
            }
        };
        xhttp.open("GET", page, true);
        xhttp.send();
    }
    else
        console.log("Not Found " + eid);
}
function liefloads(loads) {
    window['loadsDone'] = false;
    var e;
    var eid;
    var page;
    var load = loads.pop();
    eid = load[0];
    page = load[1];
    e = document.getElementById(eid);
    if (e) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            var div;
            if (this.readyState == 4 && this.status == 200) {
                //                div = document.createElement("div");
                //                div.id = eid + "_Contents";
                //                div.innerHTML = this.responseText;
                //                div.classList.add("Contents");
                //                e.appendChild(div);
                e.innerHTML = this.responseText;
                if (loads.length)
                    liefloads(loads);
                else
                    window['loadsDone'] = true;
            }
        };
        xhttp.open("GET", page, true);
        xhttp.send();
    }
    else
        console.log("Not Found " + eid);
}
function waitForIt(conditionFunction, actionFunction) {
    if (!conditionFunction())
        window.setTimeout(waitForIt.bind(null, conditionFunction, actionFunction), 100);
    else
        actionFunction();
}
function myRequire(url) {
    var left = [];
    if (!asString(url)) {
        console.log("got here");
        console.log(asArray(url));
        left = url;
        url = left.pop();
    }
    var ajax = new XMLHttpRequest();
    ajax.open('GET', url, false); // <-- the 'false' makes it synchronous
    ajax.onreadystatechange = function () {
        var script = ajax.response || ajax.responseText;
        if (ajax.readyState === 4) {
            switch (ajax.status) {
                case 200:
                    eval.apply(window, [script]);
                    console.log("script loaded: ", url);
                    break;
                default:
                    console.log("ERROR: script not loaded: ", url);
            }
        }
        if (left.length)
            if (left.length === 1)
                myRequire(left[0]);
            else
                myRequire(left);
    };
    ajax.send(null);
}
