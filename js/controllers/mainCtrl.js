casino.controller("mainCtrl",["$scope","winTable",function ($scope,winTable) {
    var main = this,winPosition;
    main.bets = {
    	one: new NewBet("1$"),
    	two: new NewBet("2$"),
    	five: new NewBet("5$"),
    	ten: new NewBet("10$"),
    	twenty: new NewBet("20$"),
    	joker: new NewBet("joker"),
    	casino: new NewBet("casino")
	};
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
        var totalCoast = 0;
        getBets(function (bet) {
            if(bet.title === main.win.type){
                totalCoast = main.win.cof * main.bet * bet.value;
            }
        });
        main.winText = totalCoast ? "You win " + totalCoast : "You louse Sorry";
        main.totalCoast += totalCoast
    }

    function getBets (callback) {
        var i,countBets = 0;
        for(i in main.bets){
            if(main.bets[i].value > 0){
                countBets += main.bets[i].value;
                if(angular.isFunction(callback)){
                    callback(main.bets[i]);
                }
            }
        }
        return countBets;
    }
    function NewBet(title) {
        this.title = title;
		this.value = 0;
    }
}]);