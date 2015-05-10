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






$(document).on("ready", function(){

$(function () {
  $('[data-toggle="popover"]').popover()
})

  function houseModel() {
    self = this;

    var houseData;
    var cookieData = readCookie('purchaseData');
    //console.log(cookieData);
    
    if (cookieData) {
      houseData = JSON.parse(cookieData);
      var houseObject = {};
      houseData.forEach(function(obj) {
         for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                houseObject[key] = obj[key];
            }
         }
      });

      this.marketValue = ko.observable(parseInt(houseObject.marketValue));
      this.share = ko.observable(parseInt(houseObject.share));
      this.currentSavings = ko.observable(parseInt(houseObject.currentSavings));
      this.movingCosts = ko.observable(parseInt(houseObject.movingCosts));
      this.interestRate = ko.observable(parseFloat(houseObject.interestRate));
      this.repaymentTerm = ko.observable(parseInt(houseObject.repaymentTerm));
      this.income = ko.observable(parseInt(houseObject.income));
      this.netMonthly = ko.observable(parseInt(houseObject.netMonthly));
      this.serviceCharge = ko.observable(parseInt(houseObject.serviceCharge));
      this.rentPercentage = ko.observable(parseFloat(houseObject.rentPercentage));    

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
    this.movingCosts = ko.observable();
    this.interestRate = ko.observable();
    this.repaymentTerm = ko.observable();
    this.income = ko.observable();
    this.netMonthly = ko.observable();
    this.serviceCharge = ko.observable();
    this.rentPercentage = ko.observable();

    };

    

    
    this.shareValue = ko.computed(function(){
      return (self.marketValue() / 100) * self.share()
    });
    //console.log(this.shareValue());

    

    this.monthlyRent = ko.computed(function(){
      return parseFloat((((self.marketValue() - self.shareValue()) * (self.rentPercentage()/100)) /12).toFixed(2));
    });
    //console.log(self.rentPercentage()/100);

    

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

      if(propVal <= bracket1.threshold) {
        return bracket1.tax
      };
      if (propVal > bracket1.threshold && propVal <= bracket2.threshold) {
        return (propVal - bracket1.threshold) * bracket2.tax
      };
      if (propVal > bracket2.threshold) {
        return (propVal - bracket2.threshold) * bracket3.tax + (bracket1.threshold * bracket2.tax);
      };
    });

    this.deposit = ko.computed(function(){
      if (self.currentSavings() > 0) {
        return self.currentSavings() - self.movingCosts() - self.stampDuty();
      }
      else {
        return 0;
      }
    });

    console.log(this.deposit());

    this.amountBorrowing = ko.computed(function(){
      return self.shareValue() - self.deposit();
    });
    this.depositBracket = ko.computed(function(){
      return parseInt(self.deposit() / self.amountBorrowing() * 100);
    });
    this.depositEnough = ko.computed(function(){
      return self.depositBracket() < 10 ? "alert-danger" : "alert-success";
    });

    this.monthlyMortgage = ko.computed(function(){
    
      var amount = parseInt(self.amountBorrowing());
      var years = parseInt(self.repaymentTerm());
      var rate = parseFloat(self.interestRate());

      function calcPayment (amount,rate,time,balloon) {
        if (rate<=0) {
          if (time<=0) {
            return amount;
          } else {
            return amount/time;
          }
        }
        if (balloon==null) balloon = 0;
   
        var ln = Math.pow(1+rate,time);
        return (amount-balloon/ln)/((1-(1/ln))/rate);
      }

      var lnAmt = Math.min(parseFloat(amount),10000000);
      amount = lnAmt;
      var lnRate = Math.min(parseFloat(rate),999.99);
      rate = lnRate;
      lnRate = lnRate/1200;

      var lnYears = Math.min(parseFloat(years),100);
      years = lnYears;

      var lnPayment = Math.round(calcPayment(lnAmt,lnRate,lnYears*12));
      return Math.floor(lnPayment,2,1);
    });

    this.totalMonthly = ko.computed(function(){
      return self.monthlyRent() + parseInt(self.serviceCharge()) + self.monthlyMortgage();
    });

    this.savingsRequired = ko.computed(function(){
      return self.stampDuty() + parseInt(self.movingCosts()) + self.shareValue() * 0.1;
    });
    this.savingsEnough = ko.computed(function(){
      return self.savingsRequired() > self.currentSavings() ? "alert-danger" : "alert-success";
    });
    

    this.multipleOfSalary = ko.computed(function(){
      return parseFloat((self.amountBorrowing() / self.income()).toFixed(1));
    });
    this.salaryEnough = ko.computed(function(){
      return self.multipleOfSalary() > 4 ? "alert-danger" : "alert-success";
    });
    this.multipleOfNetIncome = ko.computed(function(){
      return parseFloat((self.totalMonthly() / self.netMonthly() * 100).toFixed(1));
    });
    this.netIncomeEnough = ko.computed(function(){
      return self.multipleOfNetIncome() > 43 ? "alert-danger" : "alert-success";
    });
    this.amountLeftMonthly = ko.computed(function(){
      return self.netMonthly() - self.totalMonthly();
    });

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

function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

$("#formSubmit").on("click", function(e){
  //e.preventDefault();
  getData();
  createCookie('purchaseData',JSON.stringify(data),1000);
});

$("#formClear").on("click", function(){
  deleteCookie('purchaseData');
});

$(".clear").on("click", function(){
  $(this).prev().val("").focus();
});


