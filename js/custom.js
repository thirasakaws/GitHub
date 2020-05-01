    function create_select(tag_id, dataobj, fielddisplay, default_temp,setvalue,fieldsetstyle) {
        var namedisplay
        var fieldval
        var styletext
        if (fielddisplay) {
            namedisplay = fielddisplay
        } else {
            namedisplay = 'name' //default
        }
        if (setvalue) {
            fieldval = setvalue
        } else {
            fieldval = '_id' //default
        }


        var select_option = ''
        if (default_temp == true) {
            select_option += '<option value="">----select-----</option>'

        }


        for (var x = 0; x < dataobj.length; x++) {
             var styletemp
            if(fieldsetstyle){
               styletemp =dataobj[x][fieldsetstyle]
            }else{
               styletemp =''
            }
            
            
            select_option += '<option style="'+styletemp+'"  value="' + dataobj[x][fieldval] + '">(' + dataobj[x]._id + ') ' + dataobj[x][namedisplay] + '</option>'
        }
        $('#' + tag_id).html(select_option)
    }