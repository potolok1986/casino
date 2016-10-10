rotate.directive("drWheel", ["$timeout", function ($timeout) {
    var Animation = function (circles, delayInMilliseconds) {
        this.circles = circles * 360;
        this.delay = delayInMilliseconds * 1000;
        this.angleRotateWrap = 0;
        this.angleRotate = 0;
        this.oldAngle = 0;
    };
    Animation.prototype.animate = function (options, callback) {
        var start = performance.now();
        requestAnimationFrame(function animate(time) {
            var timeFraction = (time - start) / options.duration,
                progress;
            if (timeFraction > 1) timeFraction = 1;
            progress = options.timing(timeFraction);
            options.draw(progress);
            timeFraction < 1 ? requestAnimationFrame(animate) : $timeout(callback);
        });
    };
    Animation.prototype.bounce = function (timeFraction) {
        for (var a = 0, b = 1; 1; a += b, b /= 2) {
            if (timeFraction >= (7 - 4 * a) / 11) {
                return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2);
            }
        }
    };
    Animation.prototype.makeEaseOut = function (timing) {
        return function (timeFraction) {
            return 1 - timing(1 - timeFraction);
        }
    };
    Animation.prototype.calculateAngleRotation = function(newAngle) {
        console.log(newAngle, this.oldAngle);
        this.angleRotate = newAngle >= this.oldAngle ? newAngle - this.oldAngle : 360 + (newAngle - this.oldAngle)
    };

    return {
        templateUrl: 'directives/drWheel.html',
        scope: {
            angle: "@drWheel"
        },
        link: function postLink($scope, elem) {
            var $wheel = elem.find("img"),
                $container = elem.find("div"),
                animation = new Animation(3,6);

            $scope.getAngle = function () {
                rotateWheel(parseInt($scope.angle) || 0);
            };

            function rotateWheel(newAngle) {
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
            }
        }
    }
}]);