var currencyApp = angular.module('currencyApp', ['ngRoute']);

currencyApp.config(function($routeProvider) {
  $routeProvider
    .when('/', { templateUrl: 'partials/start.html' })
    .when('/:abbreviation', { templateUrl: 'partials/view.html', controller: 'viewController' })
    .otherwise({ redirectTo: '/' })
});

currencyApp.controller('baseCurrencyController', function($scope, $http) {
  
  $scope.currencies = [
    { abbreviation: "AUD", name: "Australian Dollar", country: "Australia" },
    { abbreviation: "BGN", name: "Bulgarian Lev", country: "Bulgaria" },
    { abbreviation: "BRL", name: "Brazilian Real", country: "Brazil" },
    { abbreviation: "CAD", name: "Canadian Dollar", country: "Canada" },
    { abbreviation: "CHF", name: "Swiss Franc", country: "Switzerland" },
    { abbreviation: "CNY", name: "Yuan Renminbi", country: "China" },
    { abbreviation: "CZK", name: "Czech Koruna", country: "Czech Republic" },
    { abbreviation: "DKK", name: "Danish Krone", country: "Denmark" },
    { abbreviation: "GBP", name: "Pound Sterling", country: ["Great Britain", "UK", "England"]},
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
  
  $scope.changeChosenBase = function(object) {
    $scope.chosenBase = object;
    $scope.baseSearchBar = "";
    
    if($scope.convertTo) {
      $scope.changeRate($scope.convertTo);
    }
  }
  
  $scope.changeConvertTo = function(abbreviation) {
    if(!$scope.chosenBase) {
      alert('You need to choose what to convert from first');
    }
    else {
      $scope.convertToSearchBar = "";
      $scope.convertTo = abbreviation;
      $scope.changeRate(abbreviation);
    }
  }
  
  $scope.changeRate = function(abbreviation) {
    $scope.rate = $scope.chosenBase.rates[abbreviation];
  }
  
});

currencyApp.controller('viewController', function($scope, $http, $routeParams) {
  
  $http.get('http://api.fixer.io/latest?base=' + $routeParams.abbreviation + '')
    .then(function(response) {
      
      // Rates from chosen base currency
      $scope.changeChosenBase(response.data);
      
      // Information from $scope.currencies about chosen currency, put in to $scope.chosenBaseInfo
      for(var i = 0; i < $scope.currencies.length; i++) {
        if($scope.currencies[i].abbreviation === $scope.chosenBase.base) {
          $scope.chosenBaseInfo = $scope.currencies[i];
        }
      }
      
    });
    
});