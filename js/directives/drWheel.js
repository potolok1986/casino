rotate.directive("drWheel", ["$timeout", function ($timeout) {
    return {
        templateUrl: 'directives/drWheel.html',
        scope:{
            angle:"@drWheel"
        },
        link: function postLink($scope, elem) {
            var $wheel = elem.find("img"),
                $container = elem.find("div"),
                angleRotateWrap = 0,
                angleRotate = 0,
                oldAngle = 0,
                animateDuration = 6000,
                bounceEaseOut = makeEaseOut(bounce);

            $scope.getAngle = function () {
                rotateWheel(parseInt($scope.angle) || 0);
            };

            function rotateWheel(newAngle) {
                angleRotate = calculateAngleRotation(newAngle);
                $container[0].style.transform = "rotate(" + angleRotateWrap + "deg)";
                angleRotateWrap = newAngle;
                $scope.waiting = true;
                animate({
                    duration: animateDuration,
                    timing: bounceEaseOut,
                    draw: function (progress) {
                        $wheel[0].style.transform = "rotate(" + progress * (angleRotate + 720) + "deg)";
                    }
                });
                $timeout(function () {
                    oldAngle = newAngle;
                    $scope.waiting = false;
                },animateDuration + 30)

            }

            function calculateAngleRotation(newAngle) {
                console.log(newAngle,oldAngle);
                return newAngle >= oldAngle ? newAngle - oldAngle : 360 + (newAngle - oldAngle)
            }
            function animate(options) {
                var start = performance.now();
                requestAnimationFrame(function animate(time) {
                    var timeFraction = (time - start) / options.duration;
                    if (timeFraction > 1) timeFraction = 1;
                    var progress = options.timing(timeFraction);
                    options.draw(progress);
                    if (timeFraction < 1) {
                        requestAnimationFrame(animate);
                    }
                });
            }

            function bounce(timeFraction) {
                for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
                    if (timeFraction >= (7 - 4 * a) / 11) {
                        return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2);
                    }
                }
            }

            function makeEaseOut(timing) {
                return function (timeFraction) {
                    return 1 - timing(1 - timeFraction);
                }
            }
        }
    }
}]);