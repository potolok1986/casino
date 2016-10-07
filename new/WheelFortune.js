var WheelFortune = {
    welcomeText: "welcome text",
    imageDir: null,
    sectorsID: null,
    stopSector: null,
    userWonSector: null,
    callback: null,
    attempts: 0,
    denomination: 0,
    popupHtml: "popup text",
    wheelMode: "paid",
    determinedGetUrl: "",
    wheelElements: {},
    wheelImgsPath: "/assets/img/sys/popup/wheelFortune/",
    spinCost: 300,
    bgWheelLoaded: !1,
    variables: {
        images: ["spr-wheel.png", "bg-wheel.png"],
        theSpeed: 15,
        pointerAngle: 0,
        wheelMode: "status",
        wheel: null,
        soundIsPlayed: null,
        imagesIsLoaded: !1,
        reSpin: !1,
        angle: 0,
        targetAngle: 0,
        currentAngle: 0,
        power: 2,
        prizeReceived: 0,
        ServerTargetAngle: 0,
        randomLastThreshold: 150,
        spinTimer: null,
        wheelState: "reset"
    },
    prizes: {
        1: {name: "1", startAngle: 0, endAngle: 44},
        2: {name: "2", startAngle: 45, endAngle: 89},
        3: {name: "3", startAngle: 90, endAngle: 134},
        4: {name: "4", startAngle: 135, endAngle: 179},
        5: {name: "5", startAngle: 180, endAngle: 224},
        6: {name: "6", startAngle: 225, endAngle: 269},
        7: {name: "7", startAngle: 270, endAngle: 314},
        8: {name: "8", startAngle: 315, endAngle: 360}
    },
    imgLoading: function () {
        function e(e) {
            var t = document.createElement("img");
            return t.src = e, t.complete || t.width + t.height > 0
        }

        var t = this, n = t.variables, a = !1;
        [2, 5, 10, 50, 100].forEach(function (e, n, o) {
            t.getSectors("wheelfortuneCash/denomination/" + e), n + 1 === o.length && (a = !0)
        });
        var o = setInterval(function () {
            a && (n.images.forEach(function (a, o, r) {
                var i = t.wheelImgsPath + a;
                e(i) && t.preloadImage(i), o + 1 === r.length && (n.imagesIsLoaded = !0)
            }), clearInterval(o))
        }, 500)
    },
    init: function (e) {
        var t = e ? $.extend({}, this, e) : this, n = t.variables;
        t.imgLoading(), t.wheelElements = {
            $loader: $('[data-wheel="loader"]', document),
            $spinButton: $('[data-wheel="spin"]', document),
            $wheelContainer: $('[data-wheel="container"]', document),
            $wheelLights: $('[data-wheel="lights"]', document),
            $welcomeAlert: $('[data-wheel="welcome-alert"]', document),
            $popupInfo: $('[data-wheel="popup-info"]', document),
            $popupVictory: $('[data-wheel="popup-victory"]', document),
            $popupDefeat: $('[data-wheel="popup-defeat"]', document),
            $highlightSector: $('[data-wheel="highlight-sector"]', document),
            $getPrizeBtn: $('[data-wheel="get-prize"]', document),
            $attempts: $('[data-wheel="attempts"]', document),
            $range: $('[data-wheel="range"]', document),
            $denomination: $('[data-wheel="denomination"]', document),
            sound: $('[data-wheel="audio"]', document).get(0),
            surface: $('[data-wheel="canvas"]', document).get(0)
        };
        var a = t.wheelElements, o = a.surface, r = (a.sound, a.$spinButton);
        t.wheelMode && (n.wheelMode = t.wheelMode);
        for (var i = 0; 76 > i; i++)a.$wheelLights.append("<li/>");
        if (a.$welcomeAlert.append("<p>" + t.welcomeText + "</p>"), a.$popupVictory.find(a.$getPrizeBtn).text("Забрать"), !t.imageDir)throw new Error("[ERROR:init] param imageDir is " + t.imageDir);
        if (n.wheelSectorsArray = t.getSectors(t.imageDir, t.sectorsID ? t.sectorsID : void 0), o.getContext)if (t.denomination)t.initDenomination(t.denomination); else var l = t.drawWheel(n.wheelSectorsArray, t.wheelImgsPath), s = setInterval(function () {
            t.isCanvasBlank(l);
            var e = t.bgWheelLoaded ? t.convertCanvasToImage(l, "wheel-bg") : null;
            null != e && n.imagesIsLoaded && (n.wheel = e, clearInterval(s), $(n.wheel).on("load", function () {
                a.$loader.fadeOut("fast"), a.$wheelContainer.fadeIn("fast"), t.initialDraw(), "number" == typeof t.userWonSector && (a.$welcomeAlert.addClass("hide"), n.targetAngle = -1 * (45 * t.userWonSector - 45 + 45 / 1.95), n.currentAngle = n.targetAngle + 1, t.doSpin(n.currentAngle))
            }))
        }, 1e3);
        if (r.on("click", function () {
                if (!$(this).hasClass("disable"))if (a.$welcomeAlert.hasClass("hide") || a.$welcomeAlert.addClass("hide"), t.attempts < 0)t.callback && "function" == typeof t.callback && t.callback(); else {
                    if ("number" == typeof t.stopSector)var e = t.stopSector;
                    "paid" == n.wheelMode && (t.loaderHide = !0, t.lockDenomination(t.denomination)), t.startSpin(e), a.$wheelContainer.trigger("spin"), "paid" != n.wheelMode && "free" != n.wheelMode || a.$wheelContainer.trigger("changeAttempts")
                }
            }), $('[data-wheel="sound"]', document).on("click", function () {
                $(this).toggleClass("off"), a.sound.volume = a.sound.volume ? 0 : 1
            }), "paid" == n.wheelMode || "free" == n.wheelMode) {
            var d = $('[data-wheel="info"]', document);
            a.$popupDefeat.find(a.$getPrizeBtn).text("Выйти");
            var h = t.attempts < 0 ? 0 : t.attempts;
            a.$attempts.html("Попыток: <span>" + h + "</span>"), a.$popupInfo.find(".best-wheel-info-text").append(t.popupHtml), "free" != n.wheelMode && d.removeClass("hide"), a.$attempts.removeClass("hide"), d.on("click", function () {
                a.$popupInfo.show(), $('[data-wheel="popup-close"]', document).on("click", function () {
                    a.$popupInfo.hide()
                })
            })
        } else a.$popupDefeat.remove()
    },
    initialDraw: function () {
        var e = this, t = e.variables, n = e.wheelElements, a = t.wheel, o = n.surface.getContext("2d");
        o.drawImage(a, 38, 30), o.save(), o.beginPath(), o.arc(.5 * a.width + 38, .5 * a.height + 30, .5 * a.width, 0, 2 * Math.PI, !1), o.lineWidth = 3, o.strokeStyle = "rgba(0,0,0,0.5)", o.stroke(), o.closePath()
    },
    startSpin: function (e) {
        var t = this, n = t.variables, a = t.wheelElements, o = void 0;
        "spinning" != n.wheelState && ("undefined" == typeof e ? (o = 0, t.determinedGetUrl && $.ajax({
            type: "POST",
            url: t.determinedGetUrl,
            data: {denomination: t.denomination},
            cache: !1,
            success: function (e) {
                var a, o = e.num;
                -1 === o && (t.resetWheel(), t.callback()), a = Math.floor(t.prizes[o].startAngle + .5 * (t.prizes[o].endAngle - t.prizes[o].startAngle)), a = 360 + n.pointerAngle - a, n.ServerTargetAngle = 360 * (6 * n.power) + a, n.prizeReceived = !0, "undefined" != typeof e.denomination && e.denomination ? (n.reSpin = !0, t.lockDenomination(e.denomination)) : n.reSpin = !1
            }
        })) : o = Math.floor(t.prizes[e].startAngle + .5 * (t.prizes[e].endAngle - t.prizes[e].startAngle)), "undefined" != typeof o && "reset" == n.wheelState && n.power && (o = 360 + n.pointerAngle - o, n.targetAngle = 360 * (6 * n.power) + o, n.randomLastThreshold = Math.floor(90 + 90 * Math.random()), a.$spinButton.addClass("disable"), n.wheelState = "spinning", n.soundIsPlayed = !1, t.doSpin(), a.$wheelContainer.addClass("spinning"), a.sound.setAttribute("loop", ""), a.sound = t.playSound(a.sound, "/assets/audio/2.mp3")))
    },
    doSpin: function (e) {
        function t(e, t) {
            var a = o.surface.getContext("2d");
            a.save(), a.translate(.5 * t.width + 38, .5 * t.height + 30), a.rotate(n.DegToRad(e)), a.translate(.5 * -t.width, .5 * -t.height), a.drawImage(t, 0, 0), a.restore()
        }

        var n = this, a = n.variables, o = n.wheelElements;
        if (n.determinedGetUrl)if (a.prizeReceived)a.targetAngle = a.ServerTargetAngle; else if (a.targetAngle += 10, a.angle = 14, a.targetAngle > 15e3)return n.stopSound(o.sound), n.resetWheel(), alert("Потеряна связь с сервером!"), !1;
        var r = e ? e : a.currentAngle;
        if (t(r, a.wheel), a.currentAngle += a.angle, a.currentAngle < a.targetAngle) {
            var i = a.targetAngle - a.currentAngle;
            i > 6480 ? a.angle = 55 : i > 5e3 ? a.angle = 45 : i > 4e3 ? a.angle = 30 : i > 2500 ? a.angle = 25 : i > 1800 ? a.angle = 15 : i > 1400 ? a.angle = 14.5 : i > 900 ? a.angle = 11.25 : i > 400 ? a.angle = 7.5 : i > 300 ? a.angle = 4 : i > 220 ? a.angle = 3.5 : i > 200 ? a.angle = 3 : i > 180 ? a.angle = 2.5 : i > 160 ? a.angle = 2 : i > a.randomLastThreshold ? a.angle = 1.5 : a.angle = 1, a.spinTimer = setTimeout(function () {
                n.doSpin()
            }, a.theSpeed)
        } else if (a.wheelState = "stopped", n.prizes) {
            var l = Math.floor(a.currentAngle / 360), s = a.currentAngle - 360 * l, d = Math.floor(a.pointerAngle - s);
            0 > d && (d = 360 - Math.abs(d));
            for (var h = 1; h <= Object.keys(WheelFortune.prizes).length; h++)if (d >= n.prizes[h].startAngle && d <= n.prizes[h].endAngle) {
                var c, g = a.wheelSectorsArray ? a.wheelSectorsArray[h - 1] : "error";
                if ("error" === g)throw new Error("[ERROR:doSpin] wheelSectorsArray is " + n.wheelSectorsArray);
                c = "paid" == a.wheelMode && (1 == h || 5 == h) || "free" == a.wheelMode && (4 == h || 8 == h) ? o.$popupDefeat : o.$popupVictory, c.find('[data-wheel="prize"]').append('<img src="' + g + '"  alt="Prize #' + h + '"/>'), o.$highlightSector.show(), n.stopSound(o.sound), o.sound.removeAttribute("loop"), o.sound = n.playSound(o.sound, "/assets/audio/msg_appear.mp3"), c.fadeIn("slow"), o.$wheelContainer.addClass("won").removeClass("spinning slow"), o.$getPrizeBtn.off().on("click", function () {
                    var e = $(this), t = e.parent();
                    o.$wheelContainer.trigger("getPrize"), o.$highlightSector.hide(), o.$wheelContainer.removeClass("won"), t.find('[data-wheel="prize"] img').remove(), n.resetWheel(), t.fadeOut("slow"), n.loaderHide = !0, a.reSpin || n.unlockDenomination(n.denomination)
                });
                break
            }
        }
        4 == a.angle && 1 != a.soundIsPlayed && (o.sound.removeAttribute("loop"), o.sound = n.playSound(o.sound, "/assets/audio/3.mp3"), o.$wheelContainer.addClass("slow"), a.soundIsPlayed = !0)
    },
    drawWheel: function (e, t) {
        var n = this, a = document.createElement("canvas"), o = 470;
        a.id = "temp-canvas", a.width = o, a.height = o;
        var r = new Image;
        return r.src = t + "bg-wheel.png", r.onload = function () {
            var t = a.getContext("2d");
            t.drawImage(r, 0, 0), e.forEach(function (e, a) {
                var r = new Image;
                r.src = e, r.onload = function () {
                    var e = n.DegToRad(45 * a + 22.5 - 90), i = o / 2, l = o / 2;
                    t.beginPath(), t.arc(.5 * o, .5 * o, .5 * o, 0, 2 * Math.PI, !1), t.lineWidth = 1, t.strokeStyle = "rgba(0,0,0,0.5)", t.stroke(), t.closePath(), t.save(), t.translate(i, l), t.rotate(e), t.translate(i / 2, l / 2), t.drawImage(r, -55, -150, 165, 68), t.restore()
                }
            })
        }, a
    },
    resetWheel: function (e) {
        var t = this, n = t.variables;
        clearTimeout(n.spinTimer), n.angle = 0, n.targetAngle = 0, n.currentAngle = 0, n.prizeReceived = 0, n.ServerTargetAngle = 0, n.wheelState = "reset", "popup-close" != e && t.initialDraw()
    },
    DegToRad: function (e) {
        var t, n = Math.PI;
        return t = e * n / 180
    },
    getSectors: function (e, t) {
        var n, a = this, o = [];
        t = "undefined" == typeof t ? "" : "/" + t;
        for (var r = 1; 8 >= r; r++)n = "/assets/img/" + e + t + "/part-0" + r + ".png", o.push(n), a.preloadImage(n);
        return o
    },
    convertCanvasToImage: function (e, t) {
        var n = new Image;
        return n.src = e.toDataURL("image/png"), n.id = t, n
    },
    playSound: function (e, t) {
        return e.setAttribute("src", t), e.play(), e
    },
    stopSound: function (e) {
        e.pause(), e.src = ""
    },
    preloadImage: function (e) {
        var t = new Image;
        t.src = e
    },
    isCanvasBlank: function (e) {
        var t, n = this, a = document.createElement("canvas"), o = new Image;
        a.width = e.width, a.height = e.height, o.src = n.wheelImgsPath + "bg-wheel.png", o.onload = function () {
            var r = a.getContext("2d");
            r.drawImage(o, 0, 0, e.width, e.height), a = a.toDataURL(), t = e.toDataURL(), resemble(t).compareTo(a).onComplete(function (e) {
                var t = parseInt(e.misMatchPercentage);
                50 > t && (n.bgWheelLoaded = !0)
            })
        }
    },
    initDenomination: function (e) {
        var t = this, n = t.wheelElements, a = t.imageDir, o = $('[data-wheel="denomination"]', document), r = $('[data-wheel="range"]', document), i = r.find("li"), l = null, s = function (e, t) {
            e.addClass(t)
        }, d = function (e) {
            e.attr("class", "best-wheel-denomination")
        };
        i.on({
            mouseover: function () {
                d(o), null != l && clearTimeout(l);
                var e = $(this), t = e.text();
                s(o, t)
            }, mouseout: function () {
                l = setTimeout(function () {
                    d(o)
                }, 400)
            }, click: function () {
                var e = $(this), i = e.text(), l = parseInt(i.replace("x", "")), h = r.data("range-locked");
                "undefined" != typeof h && h !== !1 || l == t.denomination && t.isDenominationInited || (d(o), s(o, i), e.parent().children().off("mouseout mouseover"), t.denomination = l, n.$spinCost = $('[data-wheel="cost"]', document), $(n.$spinCost).length && n.$spinCost.text(t.spinCost * t.denomination), t.imageDir = 1 === t.denomination ? a : "wheelfortuneCash/denomination/" + t.denomination, t.drawCustomWheel(t.imageDir))
            }
        }), "number" == typeof e && i.each(function () {
            var r = $(this), i = r.text(), l = parseInt(i.replace("x", ""));
            l === e && (d(o), s(o, i), n.$spinCost = $('[data-wheel="cost"]', document), $(n.$spinCost).length && n.$spinCost.text(t.spinCost * t.denomination), t.imageDir = 1 === e ? a : "wheelfortuneCash/denomination/" + t.denomination, t.drawCustomWheel(t.imageDir, function () {
                n.$wheelContainer.fadeIn("fast")
            }))
        })
    },
    drawCustomWheel: function (e, t) {
        var n = this, a = n.variables, o = n.wheelElements;
        o.$wheelContainer = $('[data-wheel="container"]', document), o.$loader = $('[data-wheel="loader"]', document), o.surface = $('[data-wheel="canvas"]', document).get(0), n.loaderHide || (o.$wheelContainer.addClass("loading"), o.$loader.fadeIn("fast")), a.wheelSectorsArray = n.getSectors(e);
        var r = n.drawWheel(a.wheelSectorsArray, n.wheelImgsPath), i = setInterval(function () {
            n.isCanvasBlank(r);
            var e = n.bgWheelLoaded ? n.convertCanvasToImage(r, "wheel-bg") : null;
            null != e && a.imagesIsLoaded && (a.wheel = e, clearInterval(i), $(a.wheel).on("load", function () {
                o.$loader.fadeOut("fast"), o.$wheelContainer.removeClass("loading"), n.loaderHide = !1, n.initialDraw(), "function" == typeof t && t()
            }))
        }, 1e3)
    },
    lockDenomination: function (e) {
        $('[data-wheel="range"]', document).find("li").each(function () {
            var t = $(this), n = parseInt(t.text().replace("x", ""));
            n === e && (t.click(), t.parent().children().off("mouseout mouseover"), t.parent().addClass("lock").data("range-locked", !0))
        })
    },
    unlockDenomination: function (e) {
        var t = $('[data-wheel="range"]', document);
        t.removeClass("lock").data("range-locked", !1), "undefined" != typeof e && t.find("li").each(function () {
            var t = $(this), n = parseInt(t.text().replace("x", ""));
            n === e && t.click()
        })
    }
};