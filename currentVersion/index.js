var AutoHandlerLayouts, ForceSmallHandlerLayouts, ForceMediumHandlerLayouts, ForceLargeHandlerLayouts;
var JTO = {};
var con;

var currentPage = 0;
var menuIndex = 0;
var menukeys;
var menuObj = {};
var menuHTML = {};
var menuPageItemList = [];
var subListObject;
var extraState = false;

var lastMouse = {x: 0, y: 0};
var lastRed;
var highlight = "";
var prevMenuItem;

var sunInButton = true;

// waiting() called at the bottom of this page to start things off

function waiting() {
    if ((handle_command) && (L) && (document.body)) {
        Handler.delayUntilStart = 0;
        setTimeout(function () {
            mystartup();
        }, 10);
    }
    else setTimeout(waiting, 50);
}
function load_menu_to_ts(){
//  aray = ["description","Intro","Welcome","Example01"];
//  for (var i = 0 ; aray.length ; i++)
//    ts["Menu_" + aray[i]] = "";
  ts.Menu_Video = "";
  ts.Menu_description = "";
  ts.Menu_Intro = "";
  ts.Menu_Welcome = "";
  ts.Menu_Example01 = "";
}
function mystartup() {
    console.log("initActions ");

    var out = "";
    var i, j, k;
    var eachKey;
    var key, value;
    var oldlist;
    var newEl;
    var extra;
    var mystyle;
    var temp;
    load_menu_to_ts();
    var tsKeys = Object.keys(ts);
    // load ts from typedoc

    for (i = 0; i < tsKeys.length; i++) {
        eachKey = tsKeys[i];
        key = eachKey.slice(0, eachKey.indexOf("_"));
        value = eachKey.slice(eachKey.indexOf("_") + 1);
        if ((Object.keys(menuObj)).indexOf(key) === -1) menuObj[key] = [];
        menuObj[key].push(value);
    }
    menuKeys = Object.keys(menuObj);
    menuKeys.sort(function(x,y){ return x == "Menu" ? -1 : y == "Menu" ? 1 : 0; });
    subListObject = Object.assign({}, menuObj);

    for (i = 0; i < menuKeys.length; i++) {
        oldlist = menuObj[menuKeys[i]];
        out = "<span style=\"font-size:150%\">Navigation</span>\n";
        for (j = 0; j <= i; j++) {
            out += "<div class=\"nav\" onclick=\'myClassSelect(\"" + menuKeys[j] + "\")\'";
            out += (j === i) ? " style=\"background-color:LightGreen\">" : ">";
            out += menuKeys[j] + "<br>";
            out += "</div>";
        }
        for (j = 0; j < oldlist.length; j++) {
          temp = menuKeys[i] + "_" + oldlist[j];
            extra = "id=\"nav_"+ temp +"\" onclick='Item.setPage(\"Menu_Intro\", \"" + temp + "\")'";
            mystyle = " style=\"cursor: pointer\;\"";
            out += '<div class="nav" ' + extra + mystyle + '>';
            out += "&nbsp\;&nbsp\;&nbsp\;&nbsp\;" + oldlist[j] + "<br>";
            out += '</div>';
        }
        for (j = i + 1; j < menuKeys.length; j++) {
            out += "<div  class=\"nav\" onclick=\'myClassSelect(\"" + menuKeys[j] + "\")\'>";
            out += menuKeys[j] + "<br>";
            out += "</div>";
        }
        menuObj[menuKeys[i]] = out;
        if (document.getElementById("menu_" + menuKeys[i])) {
            newEl = document.getElementById("menu_" + menuKeys[i]);
            newEl.innerHTML = out;
            newEl.style.overflow = "auto";
        }
        else {
            newEl = document.createElement("div");
            newEl.id = "menu_" + menuKeys[i];
            newEl.style.overflow = "auto";
            newEl.innerHTML = out;
            document.body.appendChild(newEl);
        }


        console.log("added " + menuKeys[i]);


        menuPageItemList.push(I(newEl.id));
    }
//  attach event management
    eleById("THESUN").onclick = function () {
        var ss = document.getElementById("SUNSWAP");
        var ts = document.getElementById("THESUN");
        var swapSunContent = ss.innerHTML;
        var theSunContent = ts.innerHTML;
        ss.innerHTML = theSunContent;
        ts.innerHTML = swapSunContent;

        sunInButton = !sunInButton;
        if (sunInButton) {
            ss.style.visibility = "hidden";
        } else {
            ss.style.visibility = "visible";
        }
        Handler.resizeEvent();
    };
    eleById("selectBack").onclick = function () {
        Item.backPage("Menu_Intro");
    };
    eleById("selectNext").onclick = function () {
        Item.nextPage("Menu_Intro");
    };
    eleById("selectClass").onchange = function () {
        var e = document.getElementById("selectClass");
        var value = e.options[e.selectedIndex].text;
        myClassSelect(value);
    };
    eleById("selectSubClass").onchange = function () {
        var e = document.getElementById("selectSubClass");
        var value = e.options[e.selectedIndex].text;
        Item.setPage("Menu_Intro", currentMenu() + "_" + value);
    };
    // setTimeout(function () {
    //     myClassSelect("Item");
    // }, 2);

    con = new SimpleConsole({
        handleCommand: handle_command,
        placeholder: "Enter JavaScript or ASCII emoji",
        storageID: "simple-console demo"
    });
    document.body.appendChild(con.element);
    con.logHTML("Console - Try it Now: JSON.stringify( Item.get(\"smallLogo\").size );");
    var thisEl = document.querySelector(".simple-console");
    thisEl.id = "console";
    thisEl.style.fontSize = '75%';

// ts is object key=id value=html as text
    tsKeys = Object.keys(ts);
    var tempEl;
    var arrayOfPages = [];
    for (i = 0; i < tsKeys.length; i++) {
        if (tsKeys[i].slice(-2) === "px") {
            ts[tsKeys[i] + "_"] = ts[tsKeys[i]];
            delete ts[tsKeys[i]];
            tsKeys[i] += "_";
        }
        if (document.getElementById(tsKeys[i])) tempEl = document.getElementById(tsKeys[i]);
        else tempEl = htmlToElement(ts[tsKeys[i]]);
        tempEl.style.visibility = "hidden";
        tempEl.style.x = "1px";
        tempEl.style.y = "1px";
        tempEl.style.width = "1px";
        tempEl.style.height = "1px";
        tempEl.style.position = "fixed";
        tempEl.style.overflow = "auto";
        tempEl.id = tsKeys[i];
//      console.log(tsKeys[i] + " - " + tempEl.id);
        document.body.appendChild(tempEl);
//      console.log("Before " + tsKeys[i] + " - " + tempEl.id);
        if (tsKeys[i] != "Menu_Intro") arrayOfPages.push(I(tsKeys[i]));
//      console.log("After " + tsKeys[i] + " - " + tempEl.id);
    }
//  ok pages loaded
//    console.log("out");
// Set Defaults
    Container.marginDefault = 6;
// Define Page Items
//    I("jsonTree"); // ------------------------------------------------------------------------- fix later
    I("loading");
    I("display"); // ------------------------------------------------------------------------- fix later

//  Group Common Items in to 'One Item'

//  Create 'Page' Item with 3 pages "console", "jsonTree", and "legend"
    var BottomPageItemBlock = I("console", "150px", "120px", "500px", I("jsonTree"), I("legend"));

//  Create Navigation Item
    var pageNavBlock = h("pageNavBlock", "20px",
        I("selectBack", "75px"),
        I("select1", "50%"),
        I("select2", "50%"),
        I("selectNext", "75px")
    );

//  Create Page With Header Item Block
    var PagesItemBlock = v("PagesItemBlock", "100%",
        I("PageHeader", "20px"),
        I("Menu_Intro", "100%", arrayOfPages),
        pageNavBlock
    );

    var NavItemBlock = h("NavItemBlock", "20px",
        I("select1", "50%"),
        I("select2", "50%"),
        I("selectBack", "25px"),
        I("selectNext", "25px")
    );
//  Create Navigation Item
    var XsmallNavItemBlock1 = h("XsmallNavItemBlock1", "20px",
        I("select1", "100%")
    );
    var XsmallNavItemBlock2 = h("XsmallNavItemBlock2", "20px",
        I("selectBack", "48px"),
        I("selectNext", "48px"),
        I("select2", "100%")
    );
//  Create Title Item Block
    var TitleItemBlock = h("TitleItemBlock", "64px",
        I("smallLogo", "64px"),
        I("titleBlock", "100%"),
        I("THESUN", "64px")
    );
    var XsmallTitleItemBlock = h("XsmallTitleItemBlock", "32px",
        I("smallLogo", "32px"),
        I("XsmallTitleBlock", "100%"),
        I("THESUN", "32px")
    );

//  Create Menu Tree On Left
    var TreeItemBlock = I("left", "200px", "180px", "220px", menuPageItemList);

//  Create Buttons - When All Buttons are needed
    var FullButtonsItemBlock = h("FullButtonsItemBlock", "20px",
        I("SLauto", "40px"),
        I("SLXsmall", "40px"),
        I("SLsmall", "40px"),
        I("SLmeduim", "40px"),
        I("SLlarge", "40px"),
        I("SLXlarge", "40px"),
        I("SLspacer", "100%"),
        I("BToff", "60px"),
        I("BTconsole", "60px"),
        I("BTdisplay", "60px"),
        I("BTlegend", "60px")
    );
    var XsmallButtonsItemBlock1 = h("XsmallButtonsItemBlock1", "20px",
        I("SLauto", "40px"),
        I("SLXsmall", "40px"),
        I("SLsmall", "40px"),
        I("SLmeduim", "40px"),
        I("SLlarge", "40px"),
        I("SLXlarge", "40px"),
        I("SLspacer", "100%")
    );
    var XsmallButtonsItemBlock2 = h("XsmallButtonsItemBlock2", "20px",
        I("BToff", "60px"),
        I("BTconsole", "60px"),
        I("BTdisplay", "60px"),
        I("BTlegend", "60px"),
        I("SLspacer2", "100%")
    );

//  Create Buttons - Only when 'some' Buttons are needed
    var LayoutButtonsItemBlock = h("LayoutButtonsItemBlock", "20px",
        I("SLauto", "16%"),
        I("SLXsmall", "17%"),
        I("SLsmall", "17%"),
        I("SLmeduim", "17%"),
        I("SLlarge", "17%"),
        I("SLXlarge", "16%")
    );

    var VSectionOfLargeLayoutItemBlock = v("VSectionOfLargeLayoutItemBlock", "100%",
        TitleItemBlock, // 60px
        PagesItemBlock, // 100%
        LayoutButtonsItemBlock,
        I("legend", "100px", "40px", "500px")
    );

    var VSectionOfMediumLayoutCWBottomItemBlock = v("VSectionOfMediumLayoutCWBottomItemBlock", "100%",
        TitleItemBlock, // 60px
//        NavItemBlock,
        PagesItemBlock, // 100%
        FullButtonsItemBlock,
        BottomPageItemBlock
    );
    var VSectionOfMediumLayoutNOBottomItemBlock = v("VSectionOfMediumLayoutNOBottomItemBlock", "100%",
        TitleItemBlock, // 60px
//        NavItemBlock,
        PagesItemBlock, // 100%
        FullButtonsItemBlock
    );
    var RightSideOfLargeLayoutItemBlock = v("RightSideOfLargeLayoutItemBlock", "400px", "300px", "500px",
        I("console", "300px", "100px", "600px"),
        I("jsonTree", "100%")
    );
    var RightSideOfXlargeLayoutItemBlock = h("RightSideOfXlargeLayoutItemBlock", "800px", "500px", "900px",
        I("jsonTree", "400px", "200px", "600px"),
        I("console", "100%")
    );

//  Define Items, intended as 'Containers for Layouts'
    var XsmallLayoutItemBlockCWBottom = v("XsmallLayoutItemBlockCWBottom",
        XsmallTitleItemBlock,
        PagesItemBlock,
        XsmallButtonsItemBlock1,
        XsmallButtonsItemBlock2,
        BottomPageItemBlock
    );
    var XsmallLayoutItemBlockNOBottom = v("XsmallLayoutItemBlockNOBottom",
        XsmallTitleItemBlock,
        PagesItemBlock,
        XsmallButtonsItemBlock1,
        XsmallButtonsItemBlock2
    );
    var SmallLayoutItemBlockCWBottom = v("SmallLayoutItemBlockCWBottom",
        TitleItemBlock, // 60px
        PagesItemBlock, // 100%
        FullButtonsItemBlock,
        BottomPageItemBlock // 60px
    );
    var SmallLayoutItemBlockNoBottom = v("SmallLayoutItemBlockNoBottom",
        TitleItemBlock, // 60px
        PagesItemBlock, // 100%
        FullButtonsItemBlock
    );
    var MediumLayoutItemBlockCWBottom = h("MediumLayoutItemBlockCWBottom",
        TreeItemBlock,
        VSectionOfMediumLayoutCWBottomItemBlock
    );
    var MediumLayoutItemBlockNOBottom = h("MediumLayoutItemBlockNOBottom",
        TreeItemBlock,
        VSectionOfMediumLayoutNOBottomItemBlock
    );
    var LargeLayoutItemBlock = h("LargeLayoutItemBlock",
        TreeItemBlock,
        VSectionOfLargeLayoutItemBlock,
        RightSideOfLargeLayoutItemBlock
    );
    var XlargeLayoutItemBlock = h("XlargeLayoutItemBlock",
        TreeItemBlock,
        VSectionOfLargeLayoutItemBlock,
        RightSideOfXlargeLayoutItemBlock
    );

// Define Layouts

    var XsmallCWBottomLayout = L(function (x, y) {
        return (x < 585 && extraState);
    }, XsmallLayoutItemBlockCWBottom, "XsmallCWBottomLayout");
    var XsmallNOBottomLayout = L(function (x, y) {
        return (x < 585);
    }, XsmallLayoutItemBlockNOBottom, "XsmallNOBottomLayout");
    var SmallCWBottomLayout = L(function (x, y) {
        return (x < 783 && extraState);
    }, SmallLayoutItemBlockCWBottom, "SmallCWBottomLayout");
    var SmallNOBottomLayout = L(function (x, y) {
        return (x < 783);
    }, SmallLayoutItemBlockNoBottom, "SmallNOBottomLayout");
    var MediumCWBottomLayout = L(function (x, y) {
        return (x < 1200 && extraState);
    }, MediumLayoutItemBlockCWBottom, "MediumCWBottomLayout");
    var MediumNOBottomLayout = L(function (x, y) {
        return (x < 1200);
    }, MediumLayoutItemBlockNOBottom, "MediumNOBottomLayout");
    var LargeSometimesForcedLayout = L(function (x, y) {
        return (x < 1600);
    }, LargeLayoutItemBlock, "LargeSometimesForcedLayout");
    var XlargeSometimesForcedLayout = L(function (x, y) {
        return true;
    }, XlargeLayoutItemBlock, "XlargeSometimesForcedLayout");

    var ForceXSmallCWBottomLayout = L(function (x, y) {
        return extraState;
    }, XsmallLayoutItemBlockCWBottom, "ForceXSmallCWBottomLayout");
    var ForceXSmallNOBottomLayout = L(function (x, y) {
        return true;
    }, XsmallLayoutItemBlockNOBottom, "ForceXSmallNOBottomLayout");

    var ForceSmallCWBottomLayout = L(function (x, y) {
        return extraState;
    }, SmallLayoutItemBlockCWBottom, "ForceSmallCWBottomLayout");
    var ForceSmallNOBottomLayout = L(function (x, y) {
        return true;
    }, SmallLayoutItemBlockNoBottom, "ForceSmallNOBottomLayout");

    var ForceMediumCWBottomLayout = L(function (x, y) {
        return (extraState);
    }, MediumLayoutItemBlockCWBottom, "ForceMediumCWBottomLayout");
    var ForceMediumNOBottomLayout = L(function (x, y) {
        return true;
    }, MediumLayoutItemBlockNOBottom, "ForceMediumNOBottomLayout");

    var ForceLargeLayout = L(function (x, y) {
        return true;
    }, LargeLayoutItemBlock, "ForceLargeLayout");

    AutoHandlerLayouts = [XsmallCWBottomLayout,
        XsmallNOBottomLayout,
        SmallCWBottomLayout,
        SmallNOBottomLayout,
        MediumCWBottomLayout,
        MediumNOBottomLayout,
        LargeSometimesForcedLayout,
        XlargeSometimesForcedLayout];

    ForceXSmallHandlerLayouts = [ForceXSmallCWBottomLayout, ForceXSmallNOBottomLayout];
    ForceSmallHandlerLayouts = [ForceSmallCWBottomLayout, ForceSmallNOBottomLayout];
    ForceMediumHandlerLayouts = [ForceMediumCWBottomLayout, ForceMediumNOBottomLayout];
    ForceLargeHandlerLayouts = [ForceLargeLayout];
    ForceXlargeHandlerLayouts = [XlargeSometimesForcedLayout];

//    var extraState = true;
//    highlight("bc");
//    highlight2("sa");

//  Ok - All Definitions Are Done, Now Lets start up our Handler

//    Item.setPage("Pages",)
    H("MasterHandler", AutoHandlerLayouts); // Start Handler with Auto.... but could change later.

    Handler.callback = mycallback;
    setTimeout(function () {
//        if (window.location.href.indexOf("#") === -1) Item.setPage("Menu_Intro", "Item_description");
        Handler.resizeEvent();
    }, 10);


    document.onmousemove = function (e) {
        lastMouse.x = e.clientX;
        lastMouse.y = e.clientY;
        updateDisplay();
    };

// // Close Brackets Here
}

waiting();
