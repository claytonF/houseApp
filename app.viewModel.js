var icookieData = [];
  var myViewModel;

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


function setData(cookieData) {
  var houseData = JSON.parse(cookieData);
  function houseModel() {
    var self = this;
    //console.log(self);

    var myhouse = self.house = ko.observableArray(houseData);
    console.log(myhouse()[0].marketValue);

    myhouse.subscribe(function(changes){
      console.log(changes);
    })
  }


  // var houseModel = function(houseData) {
  //   var self = this;
  //   self.houseData = ko.observableArray(ko.utils.arrayMap(houseData, function(house){
  //     console.log(house);
  //     return {
  //       marketValue: house.marketValue,
  //       share: house.share,
  //       currentSavings: house.currentSavings,
  //       interestRate: house.interestRate,
  //       repaymentTerm: house.repaymentTerm,
  //       income: house.income,
  //       netMonthly: house.netMonthly,
  //       serviceCharge: house.serviceCharge,
  //       rentPercentage: house.rentPercentage
  //     };

  //   }));

  // };

  ko.applyBindings(new houseModel());
  
};

var cookieData = readCookie('purchaseData')
	if (cookieData) {


	    setData(cookieData);

	   
};

var data = [];
function getData() {
  $("input").each(function(){
    var v = $(this).val();
    var k = $(this).attr("id");
    var thisData = {};
    thisData[k] = v;
    data.push(thisData);    
  });
};

function createCookie(name,value,days) {
  if (days) {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
};

$("#formSubmit").on("click", function(e){
  //e.preventDefault();
  getData();
  createCookie('purchaseData',JSON.stringify(data),1000);
});


