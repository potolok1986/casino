casino.controller("mainCtrl",["$scope","winTable",function ($scope,winTable) {
    var main = this,winPosition;
    main.bets = {};
    main.bet = 1;
    main.totalCoast = 1000;
    main.getAngle = function () {
        var totalBet = getBets();
        if(!main.bet || !totalBet || main.totalCoast - main.bet < 0){
            return false;
        }
        main.waiting = true;
        main.win = main.winText = "";
        main.totalCoast -= main.bet * totalBet;
        winPosition = getPosition();
        $scope.$broadcast("wheel-rotate", 360 / 54 * winPosition);
    };
    $scope.$on("rotation-complete",function () {
        main.win = winTable(winPosition);
        winCount();
        main.waiting = false;
    });
    $scope.$on("submit",function () {
        main.getAngle();
    });
    function getPosition() {
        var max = 53, min = 0;
        return (Math.floor(Math.random() * (max - min + 1)) + min);
    }
    function winCount() {
        var i,totalCoast = 0;
        for(i in main.bets){

        }
        getBets(function (i) {
            if(getBetTitle(i) === main.win.type){
                totalCoast = main.win.cof * main.bet;
            }
        });
        main.winText = totalCoast ? "You win " + totalCoast : "You louse Sorry";
        main.totalCoast += totalCoast
    }
    function getBetTitle(title) {
        var result;
        switch (title){
            case "one": result = "1$";break;
            case "two": result = "2$";break;
            case "five": result = "5$";break;
            case "ten": result = "10$";break;
            case "twenty": result = "20$";break;
            default : result = title;
        }
        return result;
    }
    function getBets (callback) {
        var i,countBets = 0;
        for(i in main.bets){
            if(main.bets[i]){
                countBets++;
                if(angular.isFunction(callback)){
                    callback(i);
                }
            }
        }
        return countBets;
    }
}]);