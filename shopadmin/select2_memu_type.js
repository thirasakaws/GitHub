function select2_calendargroup($jqueryobj, data_frist_show, nocached) {
   var S2obj = $jqueryobj.select2({
      placeholder: "Select Calendar Group",
      allowClear: true
   });

   if (!select2html_calendargroup || nocached) {
      $.get('/api/data/ticket/calendar_list', function (data2) {  // หยิบที่สร้างใน nodered มา
         var seldata = '';  // ตั้งชื่อตัวแปรใหม่ ไปใช้กับ <select
         for (var x = 0; x < data2.length; x++) {
            seldata += '<option value="' + data2[x]._id + '" >' + '(' + data2[x]._id + ')  ' + data2[x].name + '</option>';
         }
         select2html_calendargroup = seldata;
         $jqueryobj.html(select2html_calendargroup);
         if (Array.isArray(data_frist_show)) {

            S2obj.val(data_frist_show);
            S2obj.trigger('change');
         }
      });
   }
   $jqueryobj.html(select2html_calendargroup);
   if (Array.isArray(data_frist_show)) {
      S2obj.val(data_frist_show);
      S2obj.trigger('change');
   }
   return S2obj;
}
