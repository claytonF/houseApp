$(document).on("ready", function(){


        var data = [];
        //var data = {};
        //console.log(data);

        function getData() {
          $("input").each(function(){
            var v = $(this).val();
            var k = $(this).attr("id");
            var thisData = {};
            thisData[k] = v;
            data.push(thisData);
            //$.extend( data, thisData )
            
          });
        };

        function setData(cookieData) {
          cookieData = cookieData.replace(/[{()}]/g, '');
          cookieData = cookieData.replace(/[\[\]']+/g,'');
          cookieData = cookieData.replace(/['"]+/g, '');
          cookieData = cookieData.split(",");

          for (i = 0; i < cookieData.length; i++) {
            icookieData = cookieData[i].split(":");
            //console.log(icookieData);
            $("#" + icookieData[0]).val(icookieData[1])
          };
        };


        function results() {
          var totalSavings = $("#current-savings").val();
          var marketValue = $("#market-value").val();

          //console.log(totalSavings);

          function deposit() {};
          function stampDuty() {

          };

        };
        setTimeout(function(){results();},500)
       

        $(".clear").on("click", function(){
          $(this).prev().val("").focus();
        });


        function createCookie(name,value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/";
        };

        function readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);

            }
            return null;
        };

        function eraseCookie(name) {
            createCookie(name,"",-1);
        };


        $("#formSubmit").on("click", function(e){
          //e.preventDefault();
          getData();
          createCookie('purchaseData',JSON.stringify(data),1000);
        });
        $("#formClear").on("click", function(){
          eraseCookie(purchaseData)
        });

        var cookieData = readCookie('purchaseData')
        if (cookieData) {
            setData(cookieData);
            //console.log(cookieData);
        };



      });
      