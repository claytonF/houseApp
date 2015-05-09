var icookieData = [];
  var myViewModel;

function readCookie(name) {
	var nameEQ = name + "=";

	var ca = document.cookie.split(';');
  //console.log(ca);
	for(var i=0;i < ca.length;i++) {
	    var c = ca[i];
	    while (c.charAt(0)==' ') c = c.substring(1,c.length);
	    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);

	}
	return null;
};


//function setData(cookieData) {
  //var houseData = JSON.parse(cookieData);




$(document).on("ready", function(){
  function houseModel() {
    self = this;

    var houseData;
    var cookieData = readCookie('purchaseData')
    //console.log(cookieData);
    if (cookieData) {
      houseData = JSON.parse(cookieData);

      this.marketValue = ko.observable(houseData[0].marketValue);
      this.share = ko.observable(houseData[1].share);
      this.currentSavings = ko.observable(houseData[2].currentSavings);
      this.interestRate = ko.observable(houseData[3].interestRate);
      this.repaymentTerm = ko.observable(houseData[4].repaymentTerm);
      this.income = ko.observable(houseData[5].income);
      this.netMonthly = ko.observable(houseData[6].netMonthly);
      this.serviceCharge = ko.observable(houseData[7].serviceCharge);
      this.rentPercentage = ko.observable(houseData[8].rentPercentage);    

      $("input").each(function(e){

        for (var key in houseData[e]) {
          var value = houseData[e];
          value = value[key];

          if($(this).attr("id") == key) {
            $(this).val("10000");
          };
        };
      });
    }
    else {

    this.marketValue = ko.observable();
    this.share = ko.observable();
    this.currentSavings = ko.observable();
    this.interestRate = ko.observable();
    this.repaymentTerm = ko.observable();
    this.income = ko.observable();
    this.netMonthly = ko.observable();
    this.serviceCharge = ko.observable();
    this.rentPercentage = ko.observable();

    };

    this.movingCosts = 8000;

    this.deposit = ko.computed(function(){
      return  self.currentSavings() - self.movingCosts;
    });
    //console.log(this.deposit())
    this.shareValue = ko.computed(function(){
      return (self.marketValue() / 100) * self.share()
    });
    //console.log(this.shareValue());

    this.amountBorrowing = ko.computed(function(){
      return self.shareValue() - self.deposit();
    });

    this.monthlyRent = ko.computed(function(){
      return ((self.marketValue() - self.shareValue()) * (self.rentPercentage()/100)) /12;
    });
    //console.log(self.rentPercentage()/100);

    this.monthlyMortgage = ko.computed(function(){
      return 800;
    });

    this.totalMonthly = ko.computed(function(){
      return 800 + self.monthlyRent() + parseInt(self.serviceCharge());
    });

    this.stampDuty = ko.computed(function(){
      var propVal = parseInt(self.shareValue());
      var bracket1 = {
        threshold:125000,
        tax: 0
      };
      var bracket2 = {
        threshold:250000,
        tax: 0.02
      };
      var bracket3 = {
        threshold: 251000,
        tax: 0.05
      };
      //console.log((propVal - bracket2.threshold) * bracket3.tax + (bracket1.threshold * bracket2.tax));

      if(propVal <= bracket1.threshold) {
        return bracket1.tax
      };
      if (propVal > bracket1.threshold && propVal <= bracket2.threshold) {
        return (propVal - bracket1.threshold) * bracket2.tax
      };
      if (propVal > bracket2.threshold) {
        return (propVal - bracket2.threshold) * bracket3.tax + (bracket1.threshold * bracket2.tax);
      };


      
      //return propVal;

    });
    console.log(this.stampDuty());
  };

  ko.applyBindings(new houseModel());

});

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

$(".clear").on("click", function(){
  $(this).prev().val("").focus();
});


