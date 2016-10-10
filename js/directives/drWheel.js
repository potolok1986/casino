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
                var $this = this;
                $this.calculateAngleRotation(newAngle);
                $container[0].style.transform = "rotate(" + $this.angleRotateWrap + "deg)";
                $this.angleRotateWrap = newAngle;
                $scope.waiting = true;
                $this.animate({
                    duration: $this.delay,
                    timing: $this.makeEaseOut($this.bounce),
                    draw: function (progress) {
                        $wheel[0].style.transform = "rotate(" + progress * ($this.angleRotate + $this.circles) + "deg)";
                    }
                }, function () {
                    $this.oldAngle = newAngle;
                    $scope.waiting = false;
                });
            };
            $scope.getAngle = function () {
                animation.rotateWheel(parseInt($scope.angle) || 0);
            };


        }
    }
}]);