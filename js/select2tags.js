var main_url_get_tags = '/api/tags/get';
var main_url_new_tags = '/api/tags/newtag';
var _temp_obj_for_advtags = {};
var _temp_obj_for_newtage ={};
var _temp_obj_for_tagname ={};

$.fn.adv_tags = function(defualt_data,tagname,allownewtag=false){   // defualt_data Must Be Array
    // Create Tage
  var postdata = {tagname:tagname};
  $.post(main_url_get_tags,postdata,  (tag_suggestion) =>{
    _temp_obj_for_advtags[this.selector] = tag_suggestion;
    _temp_obj_for_newtage[this.selector] = allownewtag;
    _temp_obj_for_tagname[this.selector] = tagname;
    if(!Array.isArray(defualt_data)){
      if(typeof(defualt_data)=='string'){
        defualt_data = [defualt_data];
      }else{
        defualt_data = [];
      }

    }
    //console.log("DEFAULT "+tagname,defualt_data)
    var seldata='';
    if(this.attr('multiple') !=='multiple'){
      seldata += '<option value="">--select--</option>';
    }
    for (var x = 0; x < tag_suggestion.length; x++) {
       if (defualt_data.length > 0) {
          if (defualt_data.indexOf(tag_suggestion[x]) !== -1) { // Found
             seldata += '<option value="' + tag_suggestion[x] + '" selected >' + tag_suggestion[x] + '</option>';
          } else {
             seldata += '<option value="' + tag_suggestion[x] + '" >' + tag_suggestion[x] + '</option>';
          }
       } else {
          seldata += '<option value="' + tag_suggestion[x] + '" >' + tag_suggestion[x] + '</option>';
       }

    }
    this.html(seldata);

    this.select2({
       tags: true,
       tokenSeparators: [',', ' '],
       allowClear:true,
       createTag: function (params) {
         if (params.term === '') {
            return null;
         }
         if (allownewtag) {
            return {id: params.term, text: params.term};
         }
         return null;

       }
    });


  });
}



$.fn.adv_gettags = function (){
  var tag_suggestion =   _temp_obj_for_advtags[this.selector];
  var tag_autocreated = _temp_obj_for_newtage[this.selector] ;
  var adv_tags_name = _temp_obj_for_tagname[this.selector]

  var newtag = [];
  var returnobj = this.val();
   console.log("GET VALUE FROM ",adv_tags_name,tag_autocreated);
   console.log(returnobj);
  if (Array.isArray(returnobj) && returnobj.length > 0) {
     for (var x = 0; x < returnobj.length; x++) {
        if (tag_suggestion.indexOf(returnobj[x]) == -1) {   // Not in Suggestion then
           newtag.push(returnobj[x]);
           tag_suggestion.push(returnobj[x]);
        //   this.append('<option value="' + returnobj[x] + '" >' + returnobj[x] + '</option>');
        }
     }
  }else if(typeof(returnobj)=='string'){
    newtag = [returnobj];
  }
  if (newtag.length > 0) {
     if (tag_autocreated ) {
        $.post(main_url_new_tags, {tags: newtag,tagname:adv_tags_name}, function (data) {
           console.log("new tag write", data);
        });
     }
  }
  return returnobj;

}





$.fn.adv_select = function(setting,fnc_data,fnc){

    //{url,field_id,field_name,value,maxshow}
    var cached_data =[];
    var jquery_obj = this;
    if(!setting || !setting.url ){
      return console.error("Invalid Setting URL ")
    }
    if(!setting.id ){
      setting.id   = '_id';
      //return console.error("Invalid Setting field_id or field_name")
    }
    if(!setting.name ){
      setting.name   = 'name';
      //return console.error("Invalid Setting field_id or field_name")
    }
    if(!(setting.maxshow) > 0 ){
      setting.maxshow=50;
    }
  $.get(setting.url, function (msg) {
      if(typeof(fnc_data) =='function') fnc_data(msg);
      var dataobj = prepredata(msg);
      var seldata=jquery_obj.html().trim();
      if(!seldata){
        seldata='<option value>Select...</option>';
      }
      if(dataobj && dataobj.length > setting.maxshow){    //Transform to Type Ahead
        var newobjdata = change_data_format(dataobj,setting.value);

        jquery_obj.select2({
          data:newobjdata,
          allowClear: true,
          placeholder: "Select...",
          ajax: {
              delay: 300,
              url:setting.url,
              processResults: function (data) {
                var searchfound =change_data_format(prepredata(data));
                return {
                  results: searchfound
                };
              },
              data: function (params) {
                  return {q: params.term};
              }
          }
      });

      }else{
        seldata='<option value>Select...</option>';
        for (var x = 0; x < dataobj.length; x++) {
            var obj = dataobj[x];
            if(obj[setting.name] == setting.value || obj[setting.id] == setting.value){
                seldata += '<option value="' + obj[setting.id]  + '" selected >';
                seldata += obj._template || obj[setting.name] + '</option>';

            }else{
                seldata += '<option value="' + obj[setting.id]  + '">' ;
                seldata += obj._template || obj[setting.name] + '</option>';
            }
        }

        jquery_obj.html(seldata);
      }


  });

  function prepredata(msg){
    var dataobj = get_data_array(msg);
    if(!Array.isArray(dataobj) || dataobj.length == 0) return [];

    if(typeof(fnc) =='function'){
      for(var x=0; x < dataobj.length;x++){
          fnc(dataobj[x]);
      }
    }

    // Check setting.name
    if(setting.template){
      var reg = /(\{\{\w*\}\})/g;
      for (var x = 0; x < dataobj.length; x++) {
          dataobj[x]._template = setting.template.replace(reg,function(match){
              var real_data = match.replace(/(\{\{|\}\})/g,'');
              if(dataobj[x][real_data]){
                return dataobj[x][real_data];
              }else{
                return '';
              }
          });
      }
    }
    return dataobj;
  }

}

function change_data_format(cleandata,default_val){
console.log(default_val)
  var data = $.map(cleandata, function (obj) {
    // obj.id = obj._id || obj.id; // replace pk with your identifier
    // obj.text = obj._template || obj.name;
    var newobj={id:obj._id || obj.id};
      newobj.text = obj._template || obj.name;
      // console.log("create",newobj)
    if(Number(newobj.id) == Number(default_val)){
       newobj.selected= true;
    }
    return newobj;
  });
  // console.log(data)
  return data;
}
function get_data_array(msg){
  if(Array.isArray(msg)){
     return msg;
  }else if(typeof(msg)=='object'){
    var keys = Object.keys(msg);
    for(var x=0;x< keys.length;x++){
       if(Array.isArray(msg[keys[x]])){
         return  msg[keys[x]];
       }
    }
  }
  return false;
}
