var icookieData = [];
var myViewModel;

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
  //console.log(ca);
	for (var i=0;i < ca.length;i++) {
	    var c = ca[i];
	    while (c.charAt(0)==' ') c = c.substring(1,c.length);
	    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);

	}
	return null;
};


$(document).on("ready", function(){

$(function () {
  $('[data-toggle="popover"]').popover()
});

$('#details-tabs a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
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
      this.income1 = ko.observable(houseObject.income1);
      this.selfEmployed1 = ko.observable(houseObject.selfEmployed1);
      this.income2 = ko.observable(houseObject.income2);
      this.selfEmployed2 = ko.observable(houseObject.selfEmployed2);
      //this.netMonthly = ko.observable(parseInt(houseObject.netMonthly));
      this.serviceCharge = ko.observable(parseInt(houseObject.serviceCharge));
      this.rentPercentage = ko.observable(parseFloat(houseObject.rentPercentage));    

      $("input").each(function(e){

        for (var key in houseData[e]) {
          var value = houseData[e];
          value = value[key];
        };
      });
    }
    else {

    this.marketValue = ko.observable(0);
    this.share = ko.observable(0);
    this.currentSavings = ko.observable(0);
    this.movingCosts = ko.observable(0);
    this.interestRate = ko.observable(0);
    this.repaymentTerm = ko.observable(0);
    this.income1 = ko.observable(0);
    this.selfEmployed1 = ko.observable();
    this.income2 = ko.observable(0);
    this.selfEmployed2 = ko.observable();
    //this.netMonthly = ko.observable();
    this.serviceCharge = ko.observable(0);
    this.rentPercentage = ko.observable(0);

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
      return parseFloat((self.amountBorrowing() / (self.income1() + self.income2)).toFixed(1));
    });
    this.salaryEnough = ko.computed(function(){
      return self.multipleOfSalary() > 4 ? "alert-danger" : "alert-success";
    });

    this.netMonthly = ko.computed(function(){

      //console.log(typeof(ko.utils.unwrapObservable(self.income2())));
      this.ni = ko.computed(function(){
        
        var monthlyGross1 = parseInt(self.income1()) / 12;
        var monthlyGross2 = parseInt(self.income2()) / 12;
        //console.log(monthlyGross1);

        function ni_paye(amount){
          console.log(amount);
          var pt = 672; //primary threshold
          var uel = 3532 // upper earnings limit
          var rate1 = 0.12; //yr 2015/2016 - for monthyl income between uel and pt
          var rate2 = 0.02; //yr 2015/2016
          return amount;
        };
        
        function ni_se(amount){
          console.log(amount);
          var class2 = (2.8 * 52) / 12 // yr 2015/2016 flat weekly rate
          var class4threshold = 8060; // yr 2015/2016 class 4 threshold. Not paid on yearly income below this
          var class4Lb = 42385; // yr 2015/2016 class 4 is 9% up to this amount
          var class4Lrate = 0.09; 
          var class4Urate = 0.02; // 2% paid on earnings above the lower band 
          return amount;
        };
        //ni_se(monthlyGross1);
        if(self.selfEmployed1()) {
          ni_se(monthlyGross1);
        }
        else {
          ni_paye(monthlyGross1)
        };
        if(self.selfEmployed2()) {
          ni_se(monthlyGross2);
        }
        else {
          ni_paye(monthlyGross2)
        };
      
      });

      this.tax = ko.computed(function(){
        var taxThreshold = 10600; // yr 2015/2016 tax threshold

      });

      // return ?

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
    var thisType = $(this)[0].type;
    var v;
    var k;
    console.log($(this));
    
    if(thisType == "number") {
      v = $(this).val();
    };
    if(thisType == "checkbox") {
      var v = $(this).is(":checked");
      //console.log(v);
    };
    
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

$(".formSubmit").on("click", function(e){
  e.preventDefault();
  getData();
  createCookie('purchaseData',JSON.stringify(data),1000);
});

$(".formClear").on("click", function(){
  deleteCookie('purchaseData');
});

$(".clear").on("click", function(){
  $(this).prev().val("").focus();
});

$("input").on("focus",function(){
  if ($(this)[0].value == "0") {
    $(this).val("");
  }
});
$("input").on("blur",function(){
  if ($(this)[0].value == "") {
    $(this).val(0);
  }
});

//console.log($("#selfEmployed1").is(":checked"));