casino.factory("winTable", [function () {
    var table = {
        "joker": {
            cof: 45,
            pos: [0]
        }, "casino": {
            cof: 45,
            pos: [27]
        }, "1$": {
            cof: 1,
            pos: [1,3,6,8,11,13,15,17,19,21,23,28,30,33,35,38,40,42,44,46,48,51,53]
        }, "2$": {
            cof: 2,
            pos: [2,5,9,12,16,22,24,26,29,32,36,39,43,49,52]
        }, "5$": {
            cof: 5,
            pos: [4,10,18,25,31,37,45,50]
        }, "10$": {
            cof: 10,
            pos: [7,20,34,47]
        }, "20$": {
            cof: 20,
            pos: [14, 41]
        }
    };
    return function (position) {
        var i,// counters
            result = null;
        for(i in table){
            if(table[i].pos.indexOf(position) !== -1){
                result = {
                    type: i,
                    cof: table[i].cof
                };
                break;
            }
        }
        return result
    }
}]);