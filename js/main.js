var currencyApp = angular.module('currencyApp', ['ngTouch']);

currencyApp.controller('baseCurrencyController', function($scope, $http) {
  
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
  
  init = function() {
    setBaseCurrency();
  }
  
  /**
   * Set base currency (EURO)
   * Is used for fetching rates for conversion from API
   *
   */
  setBaseCurrency = function() {
    // Do GET request with abbreviation of currency
    $http.get('http://api.fixer.io/latest?base=eur')
    .then(function(response) {
      
      // Put object with rates from API in to scope
      $scope.euroRates  = response.data.rates;
      
      // Set initial base to EUR
      $scope.changeBaseTo("EUR");
      
    }, function(response) {
      alert("Trouble fetching current rates from API. Try again later.");
    });
  }
  
  /**
   * Change the base currency
   * Is used for fetching rates for conversion from API
   *
   * @params string
   *
   */
  $scope.changeBaseTo = function(abbreviation) {
    
    // Delete text in search field
    $scope.baseSearchBar = "";
    $scope.baseSelect = abbreviation;
      
    // Information from $scope.currencies about chosen currency, put in to $scope.chosenBaseInfo
    for(var i = 0; i < $scope.currencies.length; i++) {
      if($scope.currencies[i].abbreviation === abbreviation) {
        $scope.chosenBaseInfo = $scope.currencies[i];
      }
    }
    

    // Used for initial load, placed here to be certain all info needed is fetched
    if(!$scope.convertTo) {
      $scope.changeConvertTo("USD");
      $scope.amount = 100;
    }
    
    $scope.calculateRate();
    
  }
  
  /**
   * Change currency to convert to from the base currency
   *
   * @params string
   *
   */
  $scope.changeConvertTo = function(abbreviation) {
    
    // Display alert message if there is no base currency
    if(!$scope.chosenBaseInfo) {
      alert('You need to choose what to convert from first');
    }
    else {
      // Clear search field
      $scope.convertToSearchBar = "";
      $scope.convertToSelect = abbreviation;
      $scope.convertTo = abbreviation;
      $scope.calculateRate();
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
  
  /**
   * Do conversion between two currencies
   * Changes the $scope.afterConversion variable
   *
   */
  $scope.calculateRate = function() {
    
    var floatNumber, baseNumber;
    
    // Only do conversion if there is both a base and a convertTo
    if($scope.chosenBaseInfo && $scope.convertTo) {
      
      // If chosen base and convert to is the same, no rate required
      if($scope.chosenBaseInfo.abbreviation === $scope.convertTo) {
        $scope.afterConversion = $scope.amount;
      }
      // If the chosen base is euro, use simple conversion rates from API object
      else if($scope.chosenBaseInfo.abbreviation === "EUR" && $scope.convertTo !== "EUR") {
        floatNumber = $scope.amount * $scope.euroRates[$scope.convertTo];
        $scope.afterConversion = floatNumber.toFixed(3);
      }
      // If the chosen base isnt euro but what wants to convert to euro
      else if($scope.chosenBaseInfo.abbreviation !== "EUR" && $scope.convertTo === "EUR") {
        floatNumber = $scope.amount / $scope.euroRates[$scope.chosenBaseInfo.abbreviation];
        $scope.afterConversion = floatNumber.toFixed(3);
      }
      // If neither chosen base or chosen convertTo is euro
      else if($scope.chosenBaseInfo.abbreviation !== "EUR" && $scope.convertTo !== "EUR") {
        // First convert amount to euro
        baseNumber  = $scope.amount / $scope.euroRates[$scope.chosenBaseInfo.abbreviation];
        // Then convert euro to chosen convertTo rate
        floatNumber = baseNumber * $scope.euroRates[$scope.convertTo];
        $scope.afterConversion = floatNumber.toFixed(3);
      }
   
    }
    else {
      alert("You need to choose two currencies");
    }
    
  }
  
  init();
  
});