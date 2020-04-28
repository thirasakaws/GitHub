//const CryptoJS = require("crypto-js");
var crypto = {};
crypto.encode = function(msg, key, cb) {
  if (!msg || !key) return false;
  var encrypted = CryptoJS.AES.encrypt(msg, key);
  if (cb) cb(encrypted.toString());
  return encrypted.toString();
};

crypto.decode = function(msg, key, cb) {
  if (!msg || !key) return false;
  var decrypted;
  try {
    decrypted = CryptoJS.AES.decrypt(msg, key);
    decrypted = decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    decrypted = false;
  }
  if (cb) cb(decrypted);
  return decrypted;

};

function addCommas(NumberStr) {
  if (!NumberStr) return '';
  NumberStr += '';
  var NumberData = NumberStr.split('.');
  var Number1 = NumberData[0];

  var Number2 = NumberData.length > 1 ? '.' + NumberData[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(Number1)) {
    Number1 = Number1.replace(rgx, '$1' + ',' + '$2');
  }
  if (Number2.length > 3) Number2 = Number2[0] + Number2[1] + Number2[2];
  return Number1 + Number2;
}
var exceptionfeild = [];

function COPYOBJ(fromobj, toobj) {
  var temp = Object.getOwnPropertyNames(fromobj);

  for (var x = 0; x < temp.length; x++) {
    if (typeof(fromobj[temp[x]]) == 'string' || typeof(fromobj[temp[x]]) == 'number' || typeof(fromobj[temp[x]]) == 'boolean' || Array.isArray(fromobj[temp[x]])) {
      if (exceptionfeild.indexOf(temp[x]) !== -1) continue; // Exception Value feild
      toobj[temp[x]] = fromobj[temp[x]];
    }
  }
}
// To use function
//      <table id='obj2use'><tr class='row_tablecontent' style='display:none'><td class='datasetname_id'> this is id value </td></tr></table>
//
function tablerow(objtable, datasetname, tabledata, template, update) { // Do each row
  if (!datasetname) datasetname = '';

  var TR;

  if (!update) { // New Record
	TR = objtable.find('.row_tablecontent').last();

	objtable.append(template); // Append invisible Template for next record
    TR.attr("data-id", tabledata._id); // assign Data To TR tag   attribute  data-id=1.2.3...
  }else if(update=='new'){
    objtable.prepend(template); // Template for next record
    TR = objtable.find('.row_tablecontent').first();
    TR.attr("data-id", tabledata._id);
  }else {
    var nameofrow = "[data-id=" + tabledata._id + "]";
    TR = objtable.find(nameofrow)
      .first();
  }


  setdatabyclass(TR, datasetname, tabledata);

  //TR.show('slow');
  return TR;
};
function setdata_selection(objjquery,objdata,value,showfield,showid){
  var seldata = objjquery.html();
  if(!showfield) showfield = 'name';
  if(!showid) showid = '_id';

  for (var x = 0; x < objdata.length; x++) {
      if ((objdata[x][showid]) == value && value !=='undefined') { // Found
         seldata += '<option value="' + objdata[x][showid] + '" selected >' + objdata[x][showfield] + '</option>';
      } else {
         seldata += '<option value="' + objdata[x][showid] + '" >' + objdata[x][showfield] + '</option>';
      }
   }
   objjquery.html(seldata);
}
function setdatabyclass(objjquery, datasetname, objdata) {
  if (!objdata || objdata == null) return;
  if (!datasetname) datasetname = '';

  if (Number(objdata._id) > 0) objdata.id = Number(objdata._id);
  if (objdata.id > 0) objjquery.attr("data-id", objdata.id);

  var propname = Object.getOwnPropertyNames(objdata);

  for (var x = 0; x < propname.length; x++) {
    var relateobj;
    if (propname[x] == '_id') {

      relateobj = objjquery.find('.' + datasetname + propname[x]);
    } else {
      // GET relate OBject
      relateobj = objjquery.find('.' + datasetname + '_' + propname[x]);

    }
    //console.log("Found "+'.' + datasetname + '_' + propname[x],relateobj)
    for (var y = 0; y < relateobj.length; y++) {
      var jqobj = relateobj[y]; // Change To JQuery OBJECT

      if (jqobj.nodeName == 'SELECT' || jqobj.nodeName == 'BUTTON' || jqobj.nodeName == 'INPUT') { // Select Box
        $(jqobj)
          .val(objdata[propname[x]]);
      } else if (jqobj.nodeName == 'CHECK') { // Checkbox ?? will do it later
        // console.log("FOUND CHECK")

      } else if (jqobj.nodeName == 'IMG') { // IMG SET SRC
        jqobj.src = objdata[propname[x]];

      } else { // Other object
        if (propname[x] == 'lastupdate') {
          $(jqobj)
            .html(moment(objdata[propname[x]], "X")
              .format('D/M H:mm:ss'));
        } else {
          $(jqobj)
            .val(objdata[propname[x]]);
          $(jqobj)
            .html(objdata[propname[x]]);
        }
      }

    }
  }
}
///// URL FUNCTION

//Firsttime Calll
var PREFIX_URL ='/2020';
var url = window.location.href;
var querysplit = url.split('/');
var yearpage = querysplit[3];
var mainview = querysplit[4];
var subview = querysplit[5];
var detailofview = querysplit[6];

var starturl = '/' + mainview;
if (subview) starturl += '/' + subview;
if (detailofview) starturl += '/' + detailofview;

/*
if(detailofview.indexOf('?') !== -1){
    detailofview  = detailofview.split('?');
    detailofview  = detailofview[1];
}
*/
// anyquery ..
function getQueryVal(name, urlsearch) {
  urlsearch = url;
  name = name.replace(/[\[]/, '\\[')
    .replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(urlsearch);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};



var allpage_register = [],all_url2load=[];
var stack_onPageshow =[];
function onPageshow(anycondition,url2load, fnc2set,nowaitsocket=false) {

  if(typeof(url2load) == 'function') {
    nowaitsocket = fnc2set || false;
    fnc2set = url2load;
    url2load = false;

  }


  if (anycondition.indexOf('/') !== 0) { // First String is '/'  not found at first position
    anycondition = '/' + anycondition;
  }
  var url = anycondition;
  var querysplit = url.split('/');
  //var subyearpage = querysplit[3];
  var submainview = querysplit[1];
  var subsubview = querysplit[2];
  var detailofview = querysplit[3];


  var registerurl = '/' + submainview;
  if (subsubview) registerurl += '/' + subsubview;
  if (detailofview) {
    if (detailofview.indexOf('?') !== -1) {
      detailofview = detailofview.split('?');
      detailofview = detailofview[1];
    }
    registerurl += '/' + detailofview;
  }

  //console.log("WILL REGIST",anycondition,registerurl)
  for (var x = 0; x < allpage_register.length; x++) {
    if (allpage_register[x].condition == registerurl) {
      allpage_register[x].fnc = fnc2set;
      allpage_register[x].url2load = url2load;
      allpage_register[x].nowaitsocket = nowaitsocket;
      return; // found old one.
    }
  }
  //console.log("Register Page " + registerurl);
  // not found then register new
  allpage_register.push({
    condition: registerurl,
    fnc: fnc2set,
    url2load:url2load,
    nowaitsocket : nowaitsocket
  });
    return url2load

}
var PREFIX_MAIN_LOCAL ='';
function triggerPageshow(anycondition) { // Register function
  //$('.mainpage').hide(); // Main Class of DIV View 2 Hide
  if (anycondition.indexOf('/') !== 0) { // First String is '/'  not found at first position
    anycondition = '/' + anycondition;
  }

  var querysplit = anycondition.split('/');
  var submainview = querysplit[1];
  var subsubview = querysplit[2];
  var detailofview = querysplit[3];
  if (!submainview) return;
  var con2check = '/' + submainview;
  if (subsubview) con2check += '/' + subsubview;
  if (detailofview) con2check += '/' + detailofview;
  if(cntrlIsPressed){
    var urlsearch = window.location.href;
    window.open(urlsearch,'_blank');
    return;
  }
  console.log("condition",allpage_register)
  for (var x = 0; x < allpage_register.length; x++) {
      //if (con2check.indexOf(allpage_register[x].condition) == 0 || con2check.indexOf(allpage_register[x].condition.replace(PREFIX_URL,'')) == 0  ) { // Found 1 post
      console.log("condition",allpage_register[x].condition)
      if(allpage_register[x].condition == window.location.pathname){
      detailofview = anycondition.replace(allpage_register[x].condition,'');
      var pagedata = allpage_register[x];
      var fnc = pagedata.fnc;
      var url2load = pagedata.url2load;
      // if(pagedata.nowaitsocket == false && !socketalreadyconnect ){
      //   console.log("Wait for Socket 2 Called PageShow:"+anycondition);
      //   stack_onPageshow.push({anycondition:anycondition});
      //   return;
      // }
      // Check if have to wait Socket ?


      //
      try {

        //console.log(pagedata);

        if(url2load){   // opage load with URL
          if(pagedata.alreadyload){
            console.log("content alreadyload " + url2load.url);
            $(url2load.obj).html (pagedata.alreadyload );
            if(typeof(fnc) == 'function'){
              //console.log("call function after load");
                fnc(detailofview);
            }
            if(typeof(refreshpage) == 'function'){
              refreshpage(detailofview);
              if(typeof(refresh_config_module) == 'function'){
                refresh_config_module();
              }
            }
          }else{
            console.log("load new content:" + url2load.url);
            //pagedata.alreadyload = true;
    /*        $.ajaxSetup({
              async :false,
            });
*/
              $.get(url2load.url).done(function(data){
                  pagedata.alreadyload =data;
                //  console.log("Load Complte");
                  $(url2load.obj).html (data);
                  if(typeof(fnc) == 'function'){
                  //  console.log("call function after load");
                      fnc(detailofview);
                  }
                  if(typeof(refreshpage) == 'function'){
                      refreshpage(detailofview);
                      if(typeof(refresh_config_module) == 'function'){
                        refresh_config_module();
                      }
                  }
/*
                  $.ajaxSetup({
                    async :true,
                  });
*/
              }).fail(function(){console.error("Error Loading :"+ url2load.url);});

          }
        }else{
          if(typeof(fnc) == 'function'){
          //  console.log("call function after load");
              fnc(detailofview);
          }
          if(typeof(refreshpage) == 'function'){
              console.error('Refresh function may be bugs..');
              refreshpage(detailofview);
              if(typeof(refresh_config_module) == 'function'){
                refresh_config_module();
              }
          }else{
            console.log('refreshpage is not function' );
          }
        }
      } catch (e) {
        console.log(e);
      }

      return false;
    }
  }


  console.log("check Page Register Fail for ",con2check);

}
var adv_current_pushstate,firsttimevisitwebsite;
function go2View(anyinternalurl, titlename) {
  if(!anyinternalurl )return;
  console.log("go2View " + anyinternalurl);
  var tempsharp = anyinternalurl.indexOf('#') ;
  if(tempsharp !== -1){
    anyinternalurl = anyinternalurl.substr(0,tempsharp);
  }
  if(typeof(refreshpage) == 'function') refreshpage = undefined;    // Clear Old Page data
  if (anyinternalurl.indexOf('/') == 0) {
    anyinternalurl = anyinternalurl.replace('/','');
  }
  var url = anyinternalurl;
  if (anyinternalurl.indexOf('./') === 0) { // First Start is short
    var detailofview = anyinternalurl.substr(2);
    var subyearpage = yearpage;
    var submainview = mainview;
    var subsubview = subview;
    //  console.log("Short Hand");

  } else if (anyinternalurl.indexOf('/') == 0) { // First String is '/'
    var querysplit = url.split('/');
    //var subyearpage = querysplit[3];
    var submainview = querysplit[1];
    var subsubview = querysplit[2];
    var detailofview = querysplit[3];
  } else {
    var querysplit = url.split('/');
    //var subyearpage = querysplit[3];
    var submainview = querysplit[0];
    var subsubview = querysplit[1];
    var detailofview = querysplit[2];
  }

  var registerurl = PREFIX_URL+'/' + anyinternalurl;



  if (!titlename) titlename = subview + '/' + detailofview;

  console.log("PUSH STATE " + anyinternalurl);

  if(!firsttimevisitwebsite){
    firsttimevisitwebsite =true
    window.history. replaceState({
      callpath: anyinternalurl
    }, titlename, registerurl);

  }else{

    window.history.pushState({
      callpath: anyinternalurl
    }, titlename, registerurl);

  }

  adv_current_pushstat = anyinternalurl;
  // $('#view_timer_manage').show(); // Class or ID of DIV 2 Show;
  //  console.log("TRIGGER " + anyinternalurl);
  triggerPageshow(anyinternalurl);

  return false; // Must Return False everytime prevent page reload
}


/// end URL FUNCTION
/// ####### AJAX LOGIN SYSTEM PART

$(document)
  .ajaxSuccess(function(event, xhr, settings) {
    var temp = xhr.responseText;
    if (temp.length < 100 && temp.indexOf('"loginfail"') != -1) {

      //console.log(temp);
      //if (temp.loginfail) { // force logout
      console.log("FOUND LOGIN FIAL");
      go2View('/cpanel/logout');
      return false;
      //}
    }
    if (xhr.responseText == 'forcelogout') {
      console.log("Session Timeout force .. Logout ..");
    }

  });

/*
var _load = $.fn.load;
$.fn.load = function(url, params, callback) {
    if(typeof url !== "string") {
        return _load.apply(this, arguments);
    }

    // do your ajax stuff here
}
*/
function ajax_settoken(token) {
  //return;
  $.ajaxSetup({
    //  dataType: "json",
    headers: {
      'Authorization': 'Bearer ' + token,
    //   contentType:"application/json; charset=utf-8",
    },
//    async :false,
  });
  // setup WS Member here!!
  //connect_wssocket(token,'/webclient');   // When Authentic passed , connect channel /monitor
  console.log("Headers set!");
}

window.onpopstate = function(e) {
  if (e.state && e.state.callpath) {
    //console.log("STATE CHANGE goto view " + e.state.callpath);
    triggerPageshow(e.state.callpath);
  }

};
if (starturl == '/undefined') {
//  window.location.replace('/');

}
var mysessionid;
//
var socket, socketalreadyconnect;

function connect_wssocket(uniqueid,path) {

  console.log("Connecting web Socket");
  if (socketalreadyconnect) {
    console.log("socket already connect then reject this request");
    return;
  }
  mainconfig = { // url , password
    reconnection: true,
    path: path || '/webclient',
    reconnectionDelay: 10000,
    autoConnect: true,
    query: 'uniqueid=' + uniqueid + '&classtype=webclient',
    rejectUnauthorized: false, // Self Sign Pass throuth
    transports: ['websocket'],
    password: '123456'
    // secure: true			// FOR SSL

  };
  mainconfig.query += '&encodedid=' + encodeURIComponent(crypto.encode(uniqueid, mainconfig.password));

  //console.log("Socket io Connecting.." + websocket_url_for_connect + mainconfig.query);

  socketalreadyconnect = true;
  for(var x=0; x < stack_onPageshow.length;x++){
    var call_arg = stack_onPageshow[x];
    console.log("late Called:"+call_arg.anycondition);
    //onPageshow(call_arg.anycondition,call_arg.url2load, call_arg.fnc2set);
    triggerPageshow(call_arg.anycondition);

  }
    stack_onPageshow = undefined;
    return; // Disable web Socket
    socket = io(websocket_url_for_connect, mainconfig);


  socket.on('error', function(err) {
    console.log("connect err", err);
  });
  socket.on("refresh", function(msg) {
    window.location.replace('/2019/cpanel/home');
  });
  socket.on("console", function(msg,cb){
  	if(cb && typeof(cb) == 'function'){
  		cb({msg:'I got your msg'});
  	}
  	console.log('socket console msg: ',msg);
  });
  socket.on('connect', function() {
    console.log("connected");
  });
  socket.on('event', console.log);
  socket.on('disconnect', (err) => {
    console.log("Error disconnect:", err);
    /*
        if (whenOffline) {
          whenOffline();
        }
        */
  });

}

function getParameterByName(name,urlsearch) {
    if(!urlsearch)    urlsearch = window.location.href;
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(urlsearch);

    return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function ADV_search(setting,notsearchatfirst){
   var setval = {
       url:setting.posturl,
       eventname:setting.eventname,
       fnc_result:setting.showfunction,
       paging:setting.paginationDIV,
       pagesize:setting.pagesize,
       pagelimit:setting.limit,
       currentsearch:{
         page:setting.page || 1,
         limit:setting.limit,
       }
   }
   if(setting.search){
     setval.currentsearch.search = setting.search;
   }

 var search_function = function (query,firsttime){
      var disablehistory = firsttime;
       if(setval.currentsearch != query){
         console.log("NEW SEARCH....");
         // outside query..
         disablehistory =true;
         firsttime =true;
         if(!query.limit){
           query.limit = setval.pagelimit;
         }
         setval.currentsearch = query;
       }
       // set URL to showsql
          var showurl = '?'
          if(Number(query.page) >1){
              showurl+='page=' + query.page + '&';
          }
             // test Empty isArray
          var keys = Object.getOwnPropertyNames(query);
          for (var x=0; x < keys.length;x++){
            var testing = query[keys[x]];
            if(Array.isArray(testing) && testing.length == 0){
                delete query[keys[x]];
            }
          }
          if(typeof(query.search) =='object'){
              var keys = Object.getOwnPropertyNames(query.search);

              for (var x=0; x < keys.length;x++){
                if(keys[x] != '_id'){
                  showurl += keys[x] + '=' + encodeURIComponent(query.search[keys[x]]) + '&';
                }else{
                  showurl += 'id=' + Number(query.search[keys[x]]) + '&';
                }
              }
          }


          var currenturl = window.location.pathname ;
          adv_current_pushstat = adv_current_pushstat.replace(window.location.search,'');
          var tempsharp = adv_current_pushstat.indexOf('#') ;
          if(tempsharp !== -1){
            adv_current_pushstat = adv_current_pushstat.substr(0,tempsharp);
          }
          showurl = showurl.substr(0,showurl.length-1);
          if(!disablehistory){
            window.history.pushState({
              callpath: adv_current_pushstat ,
            }, undefined, currenturl  + showurl);
          }
          /*
          var pos = currenturl.indexOf('?')

          */
       //
      if(setval.url){
    	 console.log("Search at POST:"+setval.url);
         $.postJSON(setval.url,query,function (msg) {
          console.log(msg)
             if(!msg.obj) return alert("ERROR ! Not Data pattern return ,No msg.payload.obj");
             var record_per_page = query.limit;
             var totalrecord =   msg.totalrecord;
             var totalpage = Math.ceil(totalrecord/record_per_page);
             var page = [];
             for(var x=1;x <= totalpage; x++) page.push(x);
             // Show data
             //console.log("search result",msg.obj);
             setval.fnc_result(msg.obj,totalrecord);
             if(firsttime){
                if(!setval.paging || setval.paging.length == 0) return ;
                 setval.paging.pagination({
                   dataSource: {data:page},
                   locator:'data',
                   pageSize: 1,
                   pageNumber:setval.currentsearch.page,
                   pageRange:10,showNavigator:true,
                   formatNavigator:' Total '+ totalrecord + ' records ',
                   className: 'paginationjs-theme-blue',
                   callback : search_page_change
               });
             }
             if(typeof(refresh_config_module) == 'function') refresh_config_module();
       })
    }else if(setval.eventname){
       query._callback='required';
       console.log("Emitting  ..." +setval.eventname+":",query);
       socket.emit(setval.eventname, query, function (msg) {
           if(!msg.payload || !msg.payload.obj) {
           	if(msg.payload && msg.payload.detail){
           		return alert(msg.payload.detail);
           	}
           	return alert("ERROR ! Not Data pattern return");
           }
           var record_per_page = query.limit;
           var totalrecord =   msg.payload.totalrecord;
           var totalpage = Math.ceil(totalrecord/record_per_page);
           var page = [];
           for(var x=1;x <= totalpage; x++) page.push(x);
           // Show data
           setval.fnc_result(msg.payload.obj,totalrecord);
           if(firsttime){
              if(!setval.paging || setval.paging.length == 0) return ;
               setval.paging.pagination({
                 dataSource: {data:page},
                 locator:'data',
                 pageSize: 1,
                 pageNumber:setval.currentsearch.page,
                 pageRange:10,showNavigator:true,
                 formatNavigator:' Total '+ totalrecord + ' records ',
                 className: 'paginationjs-theme-blue',
                 callback : search_page_change
             });
           }
           if(typeof(refresh_config_module) == 'function') refresh_config_module();
     })
   }else{
     console.error(" SEARCH FUNCTION Require  setting.eventname or setting.posturl ");
   }
   } ;
   function search_page_change(data,pagination){

     if(setval.currentsearch.page != pagination.pageNumber){
       setval.currentsearch.page = pagination.pageNumber;
       search_function(setval.currentsearch);
     }
   }
   if(!notsearchatfirst){
     search_function(setval.currentsearch,true);  // First Search when Load Page
   }
   return search_function;
 }
var _internal_cached_url={};
$.fn.find_id =  function(url){
    var temp = this.parents('.row_tablecontent').attr('data-id');
    if(Number(temp) > 0){
      return temp;
    }
    else return false;
}
$.fn.loadcached =  function(url,cb){
	if(_internal_cached_url[url]) {
    $(this).html(_internal_cached_url[url]);
   		if(cb)cb();


	}else{
		var main_obj =this;
		$.get(url,function(msg){
		//	console.log("From New Load",msg)
			_internal_cached_url[url]=msg;
			$(main_obj).html(_internal_cached_url[url]);
			if(cb) cb();
		});
	}
}
function getobjbyid(obj,id,removeit){
  if(!Array.isArray(obj)) return false;
  if(Number(id) > 0){
    for(var x=0;x < obj.length;x++){
      if(obj[x]._id == id) {
        var ans =obj[x];
        if(removeit){
          obj.splice(x,1);
        }
        return ans;
      }
    }
  }
}
$.postJSON = function(url, data, callback) {
   var postdata;
    try{
      postdata = JSON.stringify(data);
    }catch(e){
      alert("Invalid Data");
      return false;
    }
    if(!callback){
      return jQuery.ajax({
          'type': 'POST',
          'url': url,
          'contentType': 'application/json',
          'data': postdata,
          'dataType': 'json'
      });
    }
    return jQuery.ajax({
        'type': 'POST',
        'url': url,
        'contentType': 'application/json',
        'data': postdata,
        'dataType': 'json',
        complete:function(obj){
          if(obj.responseJSON){
            callback(obj.responseJSON)
          }else  if(obj.responseText){
            callback(obj.responseText)
          }else{
            callback(obj);
          }
        }

    });
};
$.post =$.postJSON ;
$(document).keydown(function(event){
      if(event.which=="17")
          cntrlIsPressed = true;
  });

  $(document).keyup(function(){
      cntrlIsPressed = false;
  });
;
  var cntrlIsPressed = false;
  function setCookie(cname, cvalue, exdays) {
    if(!cvalue){
      cvalue =String((Math.random()*0xFFFFFF<<0).toString(16)) + String((Math.random()*0xFFFFFF<<0).toString(16)) + String((Math.random()*0xFFFFFF<<0).toString(16));
    }
    if(Number(exdays) > 0 ){
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires="+d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }else{
      document.cookie = cname + "=" + cvalue + ";" ;//+ expires + ";path=/";
    }
    return cvalue;  // case Random
  }
  function getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return undefined;
    }
