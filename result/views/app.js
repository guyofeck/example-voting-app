var app = angular.module('catsvsdogs', []);
var socket = io.connect();

var bg1 = document.getElementById('background-stats-1');
var bg2 = document.getElementById('background-stats-2');
var bg3 = document.getElementById('background-stats-3');

app.controller('statsCtrl', function($scope){
  $scope.aPercent = 100 / 3;
  $scope.bPercent = 100 / 3;
  $scope.cPercent = 100 / 3;

  var updateScores = function(){
    socket.on('scores', function (json) {
       var data = JSON.parse(json);
       var a = parseInt(data.a || 0);
       var b = parseInt(data.b || 0);
       var c = parseInt(data.c || 0);

       var percentages = getPercentages(a, b, c);

       bg1.style.width = percentages.a + "%";
       bg2.style.width = percentages.b + "%";
       bg3.style.width = percentages.c + "%";

       $scope.$apply(function () {
         $scope.aPercent = percentages.a;
         $scope.bPercent = percentages.b;
         $scope.cPercent = percentages.c;
         $scope.total = a + b + c;
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
  var total = a + b + c;

  if (total > 0) {
    return {a: a / total * 100, b: b / total * 100, c: c / total * 100};
  }

  return {a: 100 / 3, b: 100 / 3, c: 100 / 3};
}