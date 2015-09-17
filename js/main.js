var currencyApp = angular.module('currencyApp', []);

currencyApp.controller('baseCurrencyController', function($scope, $http, $sce) {
  
  // Information about currencies that can be converted
  $scope.currencies = [
    { abbreviation: "AUD", name: "Australian Dollar", country: "Australia" },
    { abbreviation: "BGN", name: "Bulgarian Lev", country: "Bulgaria" },
    { abbreviation: "BRL", name: "Brazilian Real", country: "Brazil" },
    { abbreviation: "CAD", name: "Canadian Dollar", country: "Canada" },
    { abbreviation: "CHF", name: "Swiss Franc", country: "Switzerland" },
    { abbreviation: "CNY", name: "Yuan Renminbi", country: "China" },
    { abbreviation: "CZK", name: "Czech Koruna", country: "Czech Republic" },
    { abbreviation: "DKK", name: "Danish Krone", country: "Denmark" },
    { abbreviation: "EUR", name: "Euro", country: "European Union" },
    { abbreviation: "GBP", name: "Pound Sterling", country: ["Great Britain", "United Kingdom", "UK", "England"]},
    { abbreviation: "HKD", name: "Hong Kong Dollar", country: "Hong Kong" },
    { abbreviation: "HRK", name: "Croatian Kuna", country: "Croatia" },
    { abbreviation: "HUF", name: "Hungarian Forint", country: "Hungary" },
    { abbreviation: "IDR", name: "Indonesian Rupiah", country: "Indonesia" },
    { abbreviation: "ILS", name: "Israeli New Shekel", country: "Israel" },
    { abbreviation: "INR", name: "Indian Rupee", country: "India" },
    { abbreviation: "JPY", name: "Japanese Yen", country: "Japan" },
    { abbreviation: "KRW", name: "Korean Won", country: "South Korea" },
    { abbreviation: "MXN", name: "Mexican Nuevo Peso", country: "Mexico" },
    { abbreviation: "MYR", name: "Malaysian Ringgit", country: "Malaysia" },
    { abbreviation: "NOK", name: "Norwegian Krone", country: "Norway" },
    { abbreviation: "NZD", name: "New Zealand Dollar", country: "New Zealand" },
    { abbreviation: "PHP", name: "Philippine Peso", country: "Philippines" },
    { abbreviation: "PLN", name: "Polish Zloty", country: "Poland" },
    { abbreviation: "RON", name: "Romanian New Leu", country: "Romania" },
    { abbreviation: "RUB", name: "Russian Ruble", country: "Russia" },
    { abbreviation: "SEK", name: "Swedish Krona", country: "Sweden" },
    { abbreviation: "SGD", name: "Singapore Dollar", country: "Singapore" },
    { abbreviation: "THB", name: "Thai Baht", country: "Thailand" },
    { abbreviation: "TRY", name: "Turkish Lira", country: "Turkey" },
    { abbreviation: "USD", name: "US Dollar", country: ["USA", "America"] },
    { abbreviation: "ZAR", name: "South African Rand", country: "South Africa" }
  ];
   
  
  /**
   * Change the base currency
   * Is used for fetching rates for conversion from API
   *
   * @params string
   *
   */
  $scope.changeBaseTo = function(abbreviation) {
    
    // Do GET request with abbreviation of currency
    $http.get('http://api.fixer.io/latest?base=' + abbreviation + '')
    .then(function(response) {
      
      // Put object with data from API in to scope
      $scope.chosenBase = response.data;
      
      // Delete text in search field
      $scope.baseSearchBar = "";
      
      // Information from $scope.currencies about chosen currency, put in to $scope.chosenBaseInfo
      for(var i = 0; i < $scope.currencies.length; i++) {
        if($scope.currencies[i].abbreviation === $scope.chosenBase.base) {
          $scope.chosenBaseInfo = $scope.currencies[i];
        }
      }
      
      // Change rate if there already is a currency to convert to
      if($scope.convertTo) {
        $scope.changeRate($scope.convertTo);
      }
      // Used for initial load, placed here to be certain all info needed is fetched
      else {
        $scope.changeConvertTo("USD");
        $scope.amount = 100;
      }
      
    }, function(response) {
      alert("Trouble fetching current rates from API. Try again later.");
    });
  }
  
  /**
   * Change currency to convert to from the base currency
   *
   * @params string
   *
   */
  $scope.changeConvertTo = function(abbreviation) {
    
    // Display alert message if there is no base currency
    if(!$scope.chosenBase) {
      alert('You need to choose what to convert from first');
    }
    else {
      // Clear search field
      $scope.convertToSearchBar = "";
      $scope.convertTo = abbreviation;
      $scope.changeRate(abbreviation);
    }
  }
  
  /**
   * Change the exchange rate
   *
   * @params string
   *
   */
  $scope.changeRate = function(convertToAbbreviation) {
    
    // If trying to convert to the same currency rate is 1
    if(convertToAbbreviation === $scope.chosenBaseInfo.abbreviation) {
      $scope.rate = 1;
    }
    else {
      $scope.rate = $scope.chosenBase.rates[convertToAbbreviation];
    }
  }
  
  /**
   * Reverse the currencies currently in field
   *
   * @params string, current base currency
   * @params string, current convertTo currency
   *
   */
   $scope.reverse = function(baseCurrencyAbbreviation, convertToAbbreviation) {
     $scope.changeBaseTo(convertToAbbreviation);
     $scope.changeConvertTo(baseCurrencyAbbreviation);
   }
  
  // Set from EURO to USD if no base currency is set
  if(!$scope.chosenBase) {
    $scope.changeBaseTo("EUR");
  }
  
});