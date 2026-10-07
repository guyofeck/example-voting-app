var app = angular.module('catsvsdogs', []);
var socket = io.connect();

var bg1 = document.getElementById('background-stats-1');
var bg2 = document.getElementById('background-stats-2');
var bg3 = document.getElementById('background-stats-3');

app.controller('statsCtrl', function($scope){
  $scope.aPercent = 0;
  $scope.bPercent = 0;
  $scope.cPercent = 0;

  var updateScores = function(){
    socket.on('scores', function (json) {
       var data = JSON.parse(json);
       var a = parseInt(data.a || 0);
       var b = parseInt(data.b || 0);
       var c = parseInt(data.c || 0);

       var percentages = getPercentages(a, b, c);
       var total = a + b + c;

       bg1.style.width = (total ? percentages.a : 100 / 3) + "%";
       bg2.style.width = (total ? percentages.b : 100 / 3) + "%";
       bg3.style.width = (total ? percentages.c : 100 / 3) + "%";

       $scope.$apply(function () {
         $scope.aPercent = percentages.a;
         $scope.bPercent = percentages.b;
         $scope.cPercent = percentages.c;
         $scope.total = total;
       });
    });
  };

  var init = function(){
    document.body.style.opacity=1;
    updateScores();
  };
  socket.on('message',function(data){
    init();
  });
});

function getPercentages(a, b, c) {
  var result = {a: 0, b: 0, c: 0};
  var total = a + b + c;

  if (total > 0) {
    result.a = Math.round(a / total * 100);
    result.b = Math.round((a + b) / total * 100) - result.a;
    result.c = 100 - result.a - result.b;
  }

  return result;
}