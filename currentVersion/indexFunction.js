function mycallback() {
    updateDisplay();
    updateHeader();
    updateMenuPage();

    var sok = Object.keys( Handler.showObj );
    var itemt;
    for (var i=0; i < sok.length ; i++ ) {
      if (Handler.showObj[ sok[i] ].show === true) {
        itemt = Item.get( sok[i] );
        if (itemt.el) itemt.el.style.backgroundColor = (sunInButton) ? "white" : "";
      }

    var chatbutton = document.getElementsByClassName("mylivechat_inline");
    // if (chatbutton.length > 0) {
    //   var el = chatbutton[0];
    //   var c = Handler.handlers[0].activeContainer.lastUpdate.Menu_Intro;
    //   var ss = screenSize();
    //   var x = ss.x - (c.width + c.x);
    //   var y = ss.y - (c.height + c.y);
    //   el.style.right = px(x);
    //   el.style.bottom = px(y);
    // }

    var bc = document.getElementById('bc');
    var bd = document.getElementById('bd');
    var bl = document.getElementById('bl');
    var bo = document.getElementById('bo');

    bc.style.backgroundColor = "";
    bd.style.backgroundColor = "";
    bl.style.backgroundColor = "";
    bo.style.backgroundColor = "";

    if (extraState) {
        if (Item.get('console').currentPage === 0) bc.style.backgroundColor="green";
        if (Item.get('console').currentPage === 1) bd.style.backgroundColor="green";
        if (Item.get('console').currentPage === 2) bl.style.backgroundColor="green";
    } else bo.style.backgroundColor="green";
}

function myforce(value) {
    clearClasses();
    if (value === "auto") {
        Handler.handlers[0].layouts = AutoHandlerLayouts;
        document.getElementById("sa").className = "buttonlit";
    } else if (value === "xs") {
        Handler.handlers[0].layouts = ForceXSmallHandlerLayouts;
        document.getElementById("xs").className = "buttonlit";
    } else if (value === "ss") {
        Handler.handlers[0].layouts = ForceSmallHandlerLayouts;
        document.getElementById("ss").className = "buttonlit";
    } else if (value === "sm") {
        Handler.handlers[0].layouts = ForceMediumHandlerLayouts;
        document.getElementById("sm").className = "buttonlit";
    } else if (value === "sl") {
        Handler.handlers[0].layouts = ForceLargeHandlerLayouts;
        document.getElementById("sl").className = "buttonlit";
    } else if (value === "sx") {
        Handler.handlers[0].layouts = ForceXlargeHandlerLayouts;
        document.getElementById("sx").className = "buttonlit";
    }
    Handler.resizeEvent();
}

function clearClasses() {
    for (var each of ["sa", "xs", "ss", "sm", "sl", "sx"]) {
        document.getElementById(each).className = "nav" ; // removeAttribute("class");
    }
}

function myClassSelect(classname) {
    var subname = (classname === "Functions") ? "typeof" : ((classname === "Directive" ) ? "el" : "description");

    Item.setPage("Menu_Intro",classname+"_"+subname);
}
function pg(page) {
    var menu = "Functions";
    if (page.indexOf("_") !== -1) {
        menu = page.slice(0, page.indexOf("_"));
        page = page.slice(page.indexOf("_") + 1);
    }
    console.log("--------------------------------------------" + menu + "\n" + page);
}
function eleById(id) { return document.getElementById(id); }
function showMy(name) {
    var m = {
        "console": "bc",
        "jsonTree": "bd",
        "tips": "bl"
    };
    if (name === "") {
        extraState = false;
        highlight("bo");
        Handler.resizeEvent();
    } else {
        extraState = true;
        highlight(m[name]);
        Item.setPage('console', name);
    }
}
function classSwap(id, after) { document.getElementById(id).className = after; }
function highlight(name) {}
function highlight2(name) {}


function updateMenuPage() {
    var out = "";
    var keys = Object.keys( menuObj );
    var extra;
    var i;
    var llist;
    var menuPages = Item.get("left").pages;
    var menuNames = [];
    for ( i = 0 ; i < menuPages.length ; i++ ) menuNames.push( menuPages[i].label );

// set select tree to correct page
    if ( currentMenu() !== CurrentMenu()) {
        if (menuNames.indexOf("menu_" + CurrentMenu()) !== - 1)
          Item.setPage("left", "menu_" + CurrentMenu());
//        else Item.setPage("left", "menu_Item");
    }
// highlight item in tree
    if (prevMenuItem) prevMenuItem.style.backgroundColor = "";
    prevMenuItem = document.getElementById("nav_" + CurrentMenu() + "_" + CurrentPage());
    if (prevMenuItem) prevMenuItem.style.backgroundColor = "#26E786";
/*
    var searchname = "nav" + CurrentPage();
    if (document.getElementsByClassName(searchname).length) {
        if (highlight !== "") {
            for (var each of document.getElementsByClassName(highlight)) { each.style.cssText = ""; }
            for (var each of document.getElementsByClassName(searchname)) { each.style.cssText = "background-color: red;"; }
            highlight = searchname;
        }
    }
*/
// update select

// selected="selected"

    for (i = 0; i < keys.length; i++) {
        extra = (CurrentMenu() === keys[i]) ? " selected=\"selected\"" : "";
        out += '<option value="' + keys[i] +'" class="myButton"' + extra + '>' + keys[i] + '</option>';
    }
    document.getElementById("selectClass").innerHTML = out;

    out = "";
    llist = subListObject[CurrentMenu()];
    for (i = 0; i < llist.length; i++) {
        extra = (CurrentPage() === llist[i]) ? " selected=\"selected\"" : "";
        out += '<option value="' + llist[i] +'" class="myButton"' + extra + '>' + llist[i] + '</option>';
    }
    document.getElementById("selectSubClass").innerHTML = out;


// <select id="selectSubClass" style="cursor:pointer">
//</select>

}

function currentMenu() {
    var item = Item.get("left");
    var label = ((item).pages[ item.currentPage ]).label;
//  alert(label + " " + CurrentMenu());
    return label.slice(5);
//  if (label.indexOf("_") !== -1) label = label.slice(0,  label.indexOf("_"));
//   return label;
//  }
}

function CurrentMenu() {
    var item = Item.get("Menu_Intro");
    var label = ((item).pages[ item.currentPage ]).label;
    if (label.indexOf("_") !== -1) label = label.slice(0,  label.indexOf("_"));
    return label;
}

function CurrentPage() {
    var item = Item.get("Menu_Intro");
    var label = ((item).pages[ item.currentPage ]).label;
    if (label.indexOf("_") !== -1) label = label.slice( label.indexOf("_") + 1 );
    if (label[label.length-1] === "_") label = label.slice(0,-1);
    return label;
}

function updateHeader() {
    var headerEl = document.getElementById("PageHeader");
    var out = "";
    var cMenu = CurrentMenu();
    var cPage = CurrentPage();
    if (cPage === "description") {
      out += '<span style="color: fusha">Menu Topic Description For: </span>';
      out += '<span style="color: Green">' + cMenu + '</span>';
    }
    else {
      switch(cMenu) {
          case "Menu":
              out += '<span style="color: green">Main Menu:</span> Topic:' + cPage;
              break;
          case "Functions":
              out += '<span style="color: green">Functions Added To Global Sapce: Function: ' + cPage + '()';
              break;
          case "Directive":
              out += 'Directive is an expansion <span style="color: red">not created yet...</span> moves Javascript to html';
              break;
          default:
              out += "Javascript: &gt; " + cMenu + "." + cPage;
      }
  }

    headerEl.innerHTML = out;
}

function updateDisplay() {
    var eachHandler;
    var out="";
    if ((Item.get("jsonTree")) && (!isMouseOver( Item.get("jsonTree").size ))) {
        document.getElementById('redBox').style.cssText = "visibility: hidden;";
    }

    var jt = document.getElementById("jsonTree");
    jt.className  = "";
    jt.style.fontSize = "80%";
    for (i = 0; i < Handler.handlers.length; i++) {
        eachHandler = Handler.handlers[i];
        out += "Handler: "+ eachHandler.label;
        out += " Mouse: x=" +  lastMouse.x.toString() + ", y=" + lastMouse.x.toString() + "<br>";
        out += "Active Layout: " + eachHandler.activeLayout.label + "<br>";
        out += "Active Container: " + eachHandler.activeContainer.label + "<br><br>" + eachHandler.activeContainer.label + "<br>";
        out += recursiveItem(eachHandler.activeContainer, "&nbsp;&nbsp;&nbsp;");
    }
    jt.innerHTML = out;
}
function isMouseOver(size) {
    if (size)
        return ((lastMouse.x > size.x) && (lastMouse.x < size.x + size.width) && (lastMouse.y > size.y) && (lastMouse.y < size.y + size.height));
    return false;
}
function redBoxOn(el) {
    var myStyle = "";
    var redBoxEl = document.getElementById('redBox');
    if (!redBoxEl) alert("no redbox");
    lastRed = el.id.slice(3);
    var itemSize = Item.get(lastRed).size;
    if (!itemSize) alert(lastRed);

    myStyle += "position:fixed; visibility: visible";
    myStyle += ";left: " + px(itemSize.x);
    myStyle += ";top: " + px(itemSize.y);
    myStyle += ";width: " + px(itemSize.width);
    myStyle += ";height: " + px(itemSize.height);
    myStyle += ";background-color: red;";
    redBoxEl.style.cssText = myStyle;
//    if (redBoxEl.style.cssText !== myStyle) alert(redBoxEl.style.cssText + "\n" + myStyle);
//    alert(myStyle);
//    console.log(document.getElementById('redBox'));
}

function recursiveItem(container, prefix) {
    var riout = "";
    var riitem;
    var j;
    var isOver;
    for (j = 0; j < container.items.length; j++) {
        riitem = container.items[j];
        isOver = isMouseOver(riitem.size);
        if (isOver) {
            if (riitem.el) riout += '<span style="background-color:green">';
            else riout += '<span style="background-color:LightGreen">';
        }
        var id = 'id="' + "mo_" + riitem.label + '"';
        riout += '<span id="mo_' + riitem.label + '" onmouseover="redBoxOn(this)">';
        if ((lastRed !== undefined) && lastRed === riitem.label) riout += '<span style="background-color:red">';
        riout += prefix + riitem.label + pagesOf(riitem) + size(riitem.size) + "<br>";
        if ((lastRed !== undefined) && lastRed === riitem.label) riout += '</span>';
        riout += '</span>';
        if (isOver) riout += '</span>';
        if (riitem.dragBar) {
            isOver = isMouseOver(riitem.dragBar.size);
            if (isOver) {
                if (riitem.el) riout += '<span style="background-color:green">';
                else riout += '<span style="background-color:LightGreen">';
            }

            riout += prefix + "\\--Dragbar " + size(riitem.dragBar.size) + "<br>";
            if (isOver) riout += '</span>';
        }
        if (riitem.container) riout += recursiveItem(riitem.container, prefix + "|&nbsp;&nbsp;");
    }
    return riout;
}
function pagesOf(item) {
    if (item.pages) return "[\"" + item.pages[item.currentPage].label + "\"]";
    return"";
}
function size(size) {
    return " x=" + size.x.toString() + ", y=" + size.y.toString() + ", width=" + size.width.toString() + ", height=" + size.height.toString();
}
function updateDisplayOld() {
    if (Item.get("Menu_Intro").currentPage !== currentPage) {
//      alert("Page Change");
        currentPage = Item.get("Menu_Intro").currentPage;
    }

    JTO = {};

    var show = "", eachKey,
        hide = "", temp, item;
//    console.log(Handler.showObj);

    for (i = 0; i < Object.keys(Handler.showObj).length; i++) {
        eachKey = Object.keys(Handler.showObj)[i];
        if (Handler.showObj[eachKey].show)
            show += eachKey + ", ";
        else
            hide += eachKey + ", ";
    }
    var display = document.getElementById("display");
    var r = "";
    r += "Active Container: " + Handler.handlers[0].activeContainer.label;
    r += "<br><br>Handlers:" + Handler.handlers.map(function(handlerInstance) {
            return " " + handlerInstance.label;
        });
    r += "<br><br>Laouts: " + Handler.handlers[0].layouts.map(function(layoutInstance) {
            return " " + layoutInstance.label;
        });
    r += "<br><br>Containers: " + showContainers();

    r += "<br><br>Handler.delayUntilStart: " + Handler.delayUntilStart.toString();
    r += "<br><br>Handler.verbose: " + (Handler.verbose ? "true" : "flase");
    r += "<br><br>Visible Items: " + show;
    r += "<br><br>Hidden Items: " + hide;
    r += "<br><br>";

    display.innerHTML = r;

    JTO.ActiveHandler = Handler.handlers[0].label;
    JTO.ActiveContainer = Handler.handlers[0].activeContainer.label;
    JTO.VisibleItems = {};

    temp = "[";

    for (i = 0; i < Object.keys(Handler.showObj).length; i++) {
        eachKey = Object.keys(Handler.showObj)[i];
        if (Handler.showObj[eachKey].show) {
            if (Item.get(eachKey).size) {
                JTO.VisibleItems[eachKey] = JSON.stringify(Item.get(eachKey).size);
                if (Item.get(eachKey).pages) {
                    item = Item.get(eachKey);
                    JTO.VisibleItems[eachKey + "@page[" + item.currentPage + "]"] = item.pages[item.currentPage].label + JSON.stringify(item.size);
                }
            }
        }
        else
            temp += (temp === "[") ? eachKey : ", " + eachKey;
//            if (Item.get(eachKey).size) JTO.InvisibleItems.push(eachKey);
    }
    JTO.InvisibleItems = temp + "]";


    var formatter = new JSONFormatter(JTO);
    formatter.openAtDepth(2);
    document.getElementById("jsonTree").innerHTML = (formatter.render()).innerHTML;

}
function showContainers() {
    var c = Container.containers;
    var isfirst = true;
    var eachKey;
    var ret = "";
    for (i = 0; i < Object.keys(c).length; i++) {
        eachKey = Object.keys(c)[i];
        ret += (isfirst ? "" : ", ") + eachKey;
        isfirst = false;
    }
    return ret;
}

function htmlToElement(html) {
    var template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstChild;
}

function handle_command(command) {
    // Conversational trivialities
    var log_emoji = function(face, rotate_direction) {
        // top notch emotional mirroring
        var span = document.createElement("span");
        span.style.display = "inline-block";
        span.style.transform = "rotate(" + (rotate_direction / 4) + "turn)";
        span.style.cursor = "vertical-text";
        span.style.fontSize = "0.5em";
        span.innerText = face.replace(">", "〉").replace("<", "〈");
        con.log(span);
    };
    if (command.match(/^((Well|So|Um|Uh),? )?(Hi|Hello|Hey|Greetings|Hola)/i)) {
        con.log((command.match(/^[A-Z]/) ? "Hello" : "hello") + (command.match(/\.|!/) ? "." : ""));
    } else if (command.match(/^((Well|So|Um|Uh),? )?(What'?s up|Sup)/i)) {
        con.log((command.match(/^[A-Z]/) ? "Not much" : "not much") + (command.match(/\?|!/) ? "." : ""));
    } else if (command.match(/^(>?[:;8X]-?[()O03PCDS])$/i)) {
        log_emoji(command, +1);
    } else if (command.match(/^([D()O0C]-?[:;8X]<?)$/i)) {
        log_emoji(command, -1);
    } else if (command.match(/^<3$/i)) {
        con.log("❤");
        // Unhelp
    } else if (command.match(/^(!*\?+!*|(please |plz )?(((I )?(want|need)[sz]?|display|show( me)?|view) )?(the |some )?help|^(gimme|give me|lend me) ((the |some )?)help| a hand( here)?)/i)) { // overly comprehensive, much?
        con.log("I could definitely help you if I wanted to.");
    } else {
        var err;
        try {
            var result = eval(command);
        } catch (error) {
            err = error;
        }
        if (err) {
            con.error(err);
        } else {
            con.log(result).classList.add("result");
        }
    }
}
