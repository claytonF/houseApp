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


//$(document).on("ready", function(){

  

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
    this.depositPercentage = ko.observable(parseInt(houseObject.depositPercentage));
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
  this.depositPercentage = ko.observable(0);
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

  this.depositValue = ko.computed(function(){
    if (self.depositPercentage() > 4 && self.depositPercentage() < 101) {
      return (self.shareValue() / 100) * self.depositPercentage();
    };
  });

  this.monthlyRent = ko.computed(function(){
    return parseFloat((((self.marketValue() - self.shareValue()) * (self.rentPercentage()/100)) /12).toFixed(2));
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
    var result = self.shareValue() - self.depositValue();
    if (result > 0) {return result};
  });

  this.depositPerc = ko.computed(function(){
    if (self.depositPercentage() > 100 && self.depositPercentage() < 5) {
      return false;
    }
    else {
      return self.depositValue();
    }
  });

  this.depositBracket = ko.computed(function(){
    var result = parseInt(self.deposit() / self.amountBorrowing() * 100);
    if (result > 0) {return result}
    //return parseInt(self.deposit() / self.amountBorrowing() * 100);
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
    if(lnPayment > 0 && lnYears > 19 && lnYears < 36 && rate >= 1 && rate <= 10) {return Math.floor(lnPayment,2,1)};
    
  });

  this.totalMonthly = ko.computed(function(){
    return parseFloat((self.monthlyRent() + parseInt(self.serviceCharge()) + self.monthlyMortgage()).toFixed(2));
  });

  this.savingsRequired = ko.computed(function(){
    return self.stampDuty() + parseInt(self.movingCosts()) + self.depositPerc();
  });


  this.savingsEnough = ko.computed(function(){
    return self.savingsRequired() > self.currentSavings() ? "alert-danger" : "alert-success";
  });
  

  this.multipleOfSalary = ko.computed(function(){
    var result = parseFloat((self.amountBorrowing() / (parseInt(self.income1()) + parseInt(self.income2()))).toFixed(1));
    if (result > 0) {return result };
    //return parseFloat((self.amountBorrowing() / (parseInt(self.income1()) + parseInt(self.income2()))).toFixed(1));
  });
  this.salaryEnough = ko.computed(function(){
    return self.multipleOfSalary() > 4.5 ? "alert-danger" : "alert-success";
  });

  this.netMonthly = ko.computed(function(){
    var monthlyGross1 = parseInt(self.income1()) / 12;
    var monthlyGross2 = parseInt(self.income2()) / 12;

    function ni(amount,type){
      
      function ni_paye(amount){
        
        var pt = 672; //primary threshold
        var uel = 3532 // upper earnings limit
        var rate1 = 0.12; //yr 2015/2016 - for monthly income between uel and pt
        var rate2 = 0.02; //yr 2015/2016
        var lowerRate;
        var upperRate;
        //if(amount > 0) {
          if(amount > uel) {lowerRate = (uel - pt) * rate1}
          if(amount < uel) {lowerRate = 0};
          if(amount > uel) {upperRate = (amount - uel) * rate2}
          else {upperRate = 0;};
          return lowerRate + upperRate;
        //};   
      };

      function ni_se(amount){
        var grossYearly = amount * 12;
        var class2 = (2.8 * 52) // yr 2015/2016 flat weekly rate
        var class4threshold = 8060; // yr 2015/2016 class 4 threshold. Not paid on yearly income below this
        var class4Lb = 42385; // yr 2015/2016 class 4 is 9% up to this amount
        var class4Lrate = 0.09; 
        var class4Urate = 0.02; // 2% paid on earnings above the lower band 
        var lowerRate;
        var upperRate;

        if(grossYearly > 0) {
          if(grossYearly > class4Lb) {lowerRate = (class4Lb - class4threshold) * class4Lrate;}
          else {lowerRate = (grossYearly - class4threshold) * class4Lrate;}
          if(grossYearly > class4Lb) {upperRate = (grossYearly - class4Lb) * class4Urate;}
          else {upperRate = 0;}
          return parseFloat(((lowerRate + upperRate + class2)/12).toFixed(2));          
        };
      };   

      if(type) { return ni_se(amount);}
      else {return ni_paye(amount)};
    };

    function tax(amount) {
      var bracket1 = {
        threshold:10600,
        tax: 0
      };
      var bracket2 = {
        threshold:31784,
        tax: 0.2
      };
      var bracket3 = {
        tax: 0.4
      };
      function taxableIncome(amount) {
        if(amount > bracket1.threshold) {
           return amount - bracket1.threshold
        }
        else {
          return amount;
        }
      };
      function upperRate(amount) {
        var taxable = taxableIncome(amount);

        if(taxable > bracket2.threshold) {
          return (taxable - bracket2.threshold);
        }
        else {
          return 0;
        }
      }
      function basicRate(amount) {
        
        var lowerTax = taxableIncome(amount);
        var upperTax = upperRate(amount);
        return (lowerTax - upperTax) * bracket2.tax;

      };
      function totalMonthlyTax(amount) {
        return (basicRate(amount) + (upperRate(amount) * bracket3.tax));
      }
      var taxDeduction = totalMonthlyTax(self.income1());
      return (totalMonthlyTax(amount))/12;

    };


    this.net1 = ko.computed(function(){
      
      return monthlyGross1 - (ni(monthlyGross1, self.selfEmployed1()) + tax(self.income1())); 
    });
    this.net2 = ko.computed(function(){
      return monthlyGross2 - (ni(monthlyGross2, self.selfEmployed2()) + tax(self.income2()))
    });

    return parseFloat(((this.net1() + this.net2()).toFixed(2)))

  });

  this.multipleOfNetIncome = ko.computed(function(){
    var result = parseFloat((self.totalMonthly() / self.netMonthly() * 100).toFixed(1));
    if (result > 0) {return result};
     
  });



  this.netIncomeEnough = ko.computed(function(){

    return self.multipleOfNetIncome() > 43 ? "alert-danger" : "alert-success";
  });
  
  this.amountLeftMonthly = ko.computed(function(){
    return parseFloat((self.netMonthly() - self.totalMonthly()).toFixed(2));
  });

};

ko.applyBindings(new houseModel());

//});
(function(){


  var data = [];
  function getData() {
    data = [];
    $("input").each(function(){
      var thisType = $(this)[0].type;
      var v;
      var k;
      
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

  // $(".formSubmit").on("click", function(e){
  //   e.preventDefault();
  //   getData();
  //   createCookie('purchaseData',JSON.stringify(data),1000);
  // });

  // $(".formClear").on("click", function(){
  //   deleteCookie('purchaseData');
  // });

  
  $("input").on("blur",function(){
    if ($(this)[0].value == "") {
      $(this).val(0);
    }
    getData();
    createCookie('purchaseData',JSON.stringify(data),1000);
  });
})();

$(".clear").on("click", function(){
    $(this).prev().val("").focus();
  });

  $("input").on("focus",function(){
    if ($(this)[0].value == "0") {
      $(this).val("");
    }
  });

$(function () {
    $('[data-toggle="popover"]').popover()
});

$('#details-tabs a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
});

//console.log($("#selfEmployed1").is(":checked"));