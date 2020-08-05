(function(){
    if($('table')[0] != undefined){
        var tdSchedule = $('table thead tr th:contains(Horário)')
        if(tdSchedule[0] != undefined){
          var parentTable = tdSchedule.parent().parent().parent()
          parentTable.addClass('table custom-table')
          $('.simple-panel table th[width="15%"]').attr('width', '19%')
        }
    }
})()
