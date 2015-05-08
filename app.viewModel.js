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
  console.log(houseData);
  function houseModel() {
    
    this.marketValue = ko.observable(houseData[0].marketValue);
    this.share = ko.observable(houseData[1].share);
    this.currentSavings = ko.observable(houseData[2].currentSavings);
    this.interestRate = ko.observable(houseData[3].interestRate);
    this.repaymentTerm = ko.observable(houseData[4].repaymentTerm);
    this.income = ko.observable(houseData[5].income);
    this.netMonthly = ko.observable(houseData[6].netMonthly);
    this.serviceCharge = ko.observable(houseData[7].serviceCharge);
    this.rentPercentage = ko.observable(houseData[8].rentPercentage);
    
  }
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


