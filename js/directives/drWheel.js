casino.directive("drWheel", ["Animation", function (Animation) {


    return {
        templateUrl: 'directives/drWheel.html',
        scope: {
            angle: "@drWheel"
        },
        link: function postLink($scope, elem) {
            var $wheel = elem.find("img"),
                $container = elem.find("div"),
                animation = new Animation(3, 6);
            animation.calculateAngleRotation = function (newAngle) {
                console.log(newAngle, this.oldAngle);
                this.angleRotate = newAngle >= this.oldAngle ? newAngle - this.oldAngle : 360 + (newAngle - this.oldAngle)
            };
            animation.rotateWheel = function(newAngle){
                animation.calculateAngleRotation(newAngle);
                $container[0].style.transform = "rotate(" + animation.angleRotateWrap + "deg)";
                animation.angleRotateWrap = newAngle;
                $scope.waiting = true;
                animation.animate({
                    duration: animation.delay,
                    timing: animation.makeEaseOut(animation.bounce),
                    draw: function (progress) {
                        $wheel[0].style.transform = "rotate(" + progress * (animation.angleRotate + animation.circles) + "deg)";
                    }
                }, function () {
                    animation.oldAngle = newAngle;
                    $scope.waiting = false;
                });
            };
            $scope.getAngle = function () {
                animation.rotateWheel(parseInt($scope.angle) || 0);
            };


        }
    }
}]);