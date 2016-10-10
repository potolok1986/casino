casino.factory("Animation", ["$timeout",function ($timeout) {
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

    return Animation
}]);