
var theme;
var msgText;
var textVisible;
var textonly;
var html;

$(document).bind("mobileinit", function(){
    $.mobile.page.prototype.options.addBackBtn= false;
    theme =  $.mobile.loader.prototype.options.theme;
    msgText =  $.mobile.loader.prototype.options.text;
    textVisible =  $.mobile.loader.prototype.options.textVisible;
    textonly = "demo";
    html = "dale";
});

////EDIT THESE LINES
//Title of the blog
var TITLE = "Movistar Blog";
//RSS url
var RSS = "http://telefonica.com.ec/blog/feed/";
//Stores entries
var entries = [];
var selectedEntry = "";

//listen for detail links
$(".contentLink").live("click", function() {
    selectedEntry = $(this).data("entryid");
});

function renderEntries(entries) {
    var s = '';
    $.each(entries, function(i, v) {
        s += '<li><a href="#contentPage" class="contentLink" data-entryid="'+i+'">' + v.title + '</a></li>';
    });
    $("#linksList").html(s);
    $("#linksList").listview("refresh");		
}

//Listen for main page
$("#mainPage").live("pageinit", function() {
    //Set the title
    $("h1", this).text(TITLE);
 
   
    $.ajax({
        url:RSS,
        success:function(res,code) {
            entries = [];
            var xml = $(res);
            var items = xml.find("item");
            

			
            $.mobile.showPageLoadingMsg();
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>Iniciar");          

            $.each(items, function(i, v) {
                entry = { 
                    title:$(v).find("title").text(), 
                    link:$(v).find("link").text(), 
                    //                    description:$.trim($(v).find("description").text()),
                    content:$.trim($(v).find("encoded").text()),
                    date:$.trim($(v).find("pubDate").text()),
                    autor:$.trim($(v).find("creator").text())
                };
                entries.push(entry);
            });
            //store entries
            localStorage["entries"] = JSON.stringify(entries);
            renderEntries(entries);

            $.mobile.hidePageLoadingMsg();
        },
        error:function(jqXHR,status,error) {
            //try to use cache
            if(localStorage["entries"]) {
                $("#status").html("Using cached version...");
                entries = JSON.parse(localStorage["entries"])
                renderEntries(entries);				
            } else {
                $("#status").html("Sorry, we are unable to get the RSS and there is no cache.");
            }
        }
    });
	
});

$("#mainPage").live("pagebeforeshow", function(event,data) {
    if(data.prevPage.length) {
        $("h1", data.prevPage).text("");
        $("#entryText", data.prevPage).html("");
    }
});

//Listen for the content page to load
$("#contentPage").live("pageshow", function(prepage) {
    //Set the title
    $("h1", this).text(entries[selectedEntry].creator);
    console.log(entries[selectedEntry]);
    var contentHTML = "";
    contentHTML += "<h2>"+entries[selectedEntry].title+"</h2>";
    //    contentHTML += entries[selectedEntry].description;
    contentHTML += '<p/><a href="'+entries[selectedEntry].link + '">Vamos al Blog de Movistar!!!</a>';
    contentHTML += entries[selectedEntry].content;
    contentHTML += '<p>'+entries[selectedEntry].autor+'<br/>'+entries[selectedEntry].date+'</p>';
    $("#entryText",this).html(contentHTML);
});
	
