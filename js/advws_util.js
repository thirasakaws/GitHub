var ADVWS = {
  make_edittextarea:function(jqueryobject,callback,validate){
      jqueryobject.editable({
        mode:'inline',
        url :undefined,
        type:'textarea',
        title:'Edit',
        emptytext:'เพิ่ม...',
        validate:validate,
        autotext:'never',
      //  defaultValue:'tt',
        //emptyclass:'',
        success:function(response,newValue){
          //return "Server Offline..";
          var id = $(this).attr('data-id');
          if(!id) id = $(this).parents('.row_tablecontent').attr('data-id');
          var field =$(this).attr('data-field');
          var update = {_id:id};
          if(!field) return console.log('Object has no attribute data-field');
          update[field] = newValue;
          return callback(update,$(this));
        }
      });
    },
  make_edittext:function(jqueryobject,callback,validate){
    jqueryobject.editable({
      mode:'inline',
      url :undefined,
      type:'text',
      title:'Edit',
      emptytext:'เพิ่ม...',
      validate:validate,
      autotext:'never',
    //  defaultValue:'tt',
      //emptyclass:'',
      success:function(response,newValue){
        //return "Server Offline..";
        var id = $(this).attr('data-id');
        if(!id) id = $(this).parents('.row_tablecontent').attr('data-id');
        var field =$(this).attr('data-field');
        var update = {_id:id};
        if(!field) return console.log('Object has no attribute data-field');
        update[field] = newValue;
        return callback(update,$(this));
      }
    });
  },
  make_editselect:function(jqueryobject,selectobj,callback,validate){
    if(!Array.isArray(selectobj)) return console.error("selectobj Must be Array \r\narg is jqueryobject,selectobj,callback,validate");
    var oldvalue = jqueryobject.html();
    jqueryobject.editable({
      mode:'inline',
      url :undefined,
      type:'select',
      title:'Edit',
      emptytext:'เลือก...',
      source:selectobj,
      defaultValue:selectobj[0].value,
      validate:validate,
      autotext:'always',
    //  defaultValue:'tt',
      //emptyclass:'',
      success:function(response,newValue){
        //return "Server Offline..";
        var id = $(this).attr('data-id');
        if(!id) id = $(this).parents('.row_tablecontent').attr('data-id');
        var field =$(this).attr('data-field');
        var update = {_id:id};
        if(!field) return console.log('Object has no attribute data-field');
        update[field] = newValue;
        return callback(update,$(this));
      }
    });
    // first time set
    if(oldvalue){
        jqueryobject.editable('setValue',oldvalue);
    }

  },
  make_selecttags:function(jq_obj,defualt_data,setting,fncupdate,allownewtag=false){
    if(! jq_obj.attr('placeholder')) jq_obj.attr('placeholder','Select..');
    if(typeof(setting) != 'object') return alert("Must Have setting");
    if(!setting.url) return alert("Must Have setting.url");
    if(!setting.postdata) return alert("Must Have setting.postdata");
    $.post(setting.url,setting.postdata,  (tag_suggestion) =>{
      if(!Array.isArray(defualt_data)){
        if(typeof(defualt_data)=='string'){
          defualt_data = [defualt_data];
        }else{
          defualt_data = [];
        }
      }
      //console.log("DEFAULT "+tagname,defualt_data)
      var seldata='';
      if(jq_obj.attr('multiple') !=='multiple'){
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
      jq_obj.html(seldata);

      jq_obj.select2({
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
      jq_obj.off('change.select2');
      jq_obj.on('change.select2',function(e){
        if(typeof(fncupdate) == 'function'){
            fncupdate(jq_obj.val());
        }
      });


    }); // end postdata
  }
}
function hash_replace(template,prefix,tempdata,notclear=false){
    var html = '';
    var data ;
    if(!Array.isArray(tempdata)){
      data=[tempdata];
    }else{
      data=tempdata;
      if(data.length ==0 ) return '';
    }
    var keys = Object.keys(data[0]);

      for(var x=0;x < data.length;x++){
          var thisrow =template;
          keys.map((ek)=>{

            var temp_rex = new RegExp('##'+prefix+'-' + ek +'##','g');
            if(ek == '_id')   temp_rex = new RegExp('##'+prefix+'-id##','g');
            thisrow = thisrow.replace(temp_rex,data[x][ek]);
          });
          html +=thisrow;

      }
      if(notclear) return html;
      var temp = new RegExp('##'+prefix+'-\\w+##','g');
      html = html.replace(temp,'');
      return html;

};
