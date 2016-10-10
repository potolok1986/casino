var WheelFortuneMobile = {
    welcomeText: "welcome text",
    sectorsID: null,
    stopSector: null,
    callback: null,
    attempts: 0,
    wheelMode: "paid",
    determinedGetUrl: "",
    wheelElements: {},
    wheelImgsPath: "/assets/mobile/img/sys/wheel/",
    deviceOrientation: "orientation" in window ? window.orientation : window.screen.orientation.type,
    wheelSize: null,
    textSectorsArray: ["<span style='text-transform:uppercase;font-size: .7em'>Пустой</span>", "<span><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 72.5 105' style='position: relative; bottom: -0.092em; width: 0.557em; height: 0.807em;'><path d='M5 0h40a27.5 27.5 0 0 1 0 55h-30v6h38v10h-38v29h-10v-29h-5v-10h5v-6h-5v-10h5zM15 10h30a17.5 17.5 0 0 1 0 35h-30z' transform='translate(0 5)' fill='#8198bb' style='fill-rule: evenodd'/><path d='M5 0h40a27.5 27.5 0 0 1 0 55h-30v6h38v10h-38v29h-10v-29h-5v-10h5v-6h-5v-10h5zM15 10h30a17.5 17.5 0 0 1 0 35h-30z' transform='translate(0 0)' fill='#fff' style='fill-rule: evenodd'/></svg></span> 1000", "<span><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 72.5 105' style='position: relative; bottom: -0.092em; width: 0.557em; height: 0.807em;'><path d='M5 0h40a27.5 27.5 0 0 1 0 55h-30v6h38v10h-38v29h-10v-29h-5v-10h5v-6h-5v-10h5zM15 10h30a17.5 17.5 0 0 1 0 35h-30z' transform='translate(0 5)' fill='#8198bb' style='fill-rule: evenodd'/><path d='M5 0h40a27.5 27.5 0 0 1 0 55h-30v6h38v10h-38v29h-10v-29h-5v-10h5v-6h-5v-10h5zM15 10h30a17.5 17.5 0 0 1 0 35h-30z' transform='translate(0 0)' fill='#fff' style='fill-rule: evenodd'/></svg></span> 250", "<div style='line-height: 1;'>100</div><span class='points'>Баллов</span>", "<div style='text-transform:uppercase;font-size: .8em;line-height:2'>Respin</div>", "<span><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 72.5 105' style='position: relative; bottom: -0.092em; width: 0.557em; height: 0.807em;'><path d='M5 0h40a27.5 27.5 0 0 1 0 55h-30v6h38v10h-38v29h-10v-29h-5v-10h5v-6h-5v-10h5zM15 10h30a17.5 17.5 0 0 1 0 35h-30z' transform='translate(0 5)' fill='#8198bb' style='fill-rule: evenodd'/><path d='M5 0h40a27.5 27.5 0 0 1 0 55h-30v6h38v10h-38v29h-10v-29h-5v-10h5v-6h-5v-10h5zM15 10h30a17.5 17.5 0 0 1 0 35h-30z' transform='translate(0 0)' fill='#fff' style='fill-rule: evenodd'/></svg></span> 500", "x2 <span>2ч</span>", "<div style='line-height: 1;'>200</div><span class='points'>Баллов</span>"],
    deviceWidth: window.screen.availWidth,
    bgWheelLoaded: !1,
    envDev: !0,
    variables: {
        images: ["bg.png", "highlight-sector.png", "needle.png", "btn-spin-paid.png", "btn-spin.png"],
        theSpeed: 15,
        pointerAngle: 0,
        wheelMode: "status",
        wheel: null,
        soundIsPlayed: null,
        imagesIsLoaded: !1,
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
        1: {startAngle: 0, endAngle: 44},
        2: {startAngle: 45, endAngle: 89},
        3: {startAngle: 90, endAngle: 134},
        4: {startAngle: 135, endAngle: 179},
        5: {startAngle: 180, endAngle: 224},
        6: {startAngle: 225, endAngle: 269},
        7: {startAngle: 270, endAngle: 314},
        8: {startAngle: 315, endAngle: 360}
    },
    imgLoading: function () {
        function e(e) {
            var t = document.createElement("img");
            return t.src = e, t.complete || t.width + t.height > 0
        }

        var t = this, n = t.variables;
        n.images.forEach(function (a, r, i) {
            var o = t.wheelImgsPath + a;
            e(o) && t.preloadImage(o), r + 1 === i.length && (n.imagesIsLoaded = !0)
        })
    },
    dynamicStyles: function (e) {
        var t = this, n = t.wheelElements, a = parseInt(t.wheelSize - .11 * t.wheelSize), r = $(e);
        r.css({
            width: a,
            height: a,
            "margin-top": -a / 2 + "px",
            "margin-left": -a / 2 + "px"
        }), setTimeout(function () {
            n.$wheelContainer.css({height: t.wheelSize + 20}), "landscape-primary" != t.deviceOrientation || 0 == t.deviceOrientation ? n.$wheelContainer.find(".best-wheel").css("height", window.screen.width - 12) : n.$wheelContainer.css("height", $(".landscape-mode", document).outerHeight() - parseInt(n.$wheelContainer.css("margin-top")))
        }, 100)
    },
    init: function (e) {
        var t = e ? $.extend({}, this, e) : this, n = t.variables;
        t.imgLoading(), t.wheelSize = Math.min(window.screen.availWidth, window.screen.availHeight) - 12, t.wheelImageID = WheelFortuneMobile.generateImageID(), t.wheelElements = {
            $loader: $('[data-wheel="loader"]', document),
            $spinButton: $('[data-wheel="spin"]', document),
            $popup: $('[data-wheel="popup"]', document),
            $sectorPrize: $('[data-wheel="sector"]', document),
            $wheelContainer: $('[data-wheel="container"]', document),
            $welcomeAlert: $('[data-wheel="welcome-alert"]', document),
            $popupVictory: $('[data-wheel="popup-victory"]', document),
            $highlightSector: $('[data-wheel="highlight-sector"]', document),
            $getPrizeBtn: $('[data-wheel="get-prize"]', document),
            sound: $('[data-wheel="audio"]', document).get(0),
            surface: $('[data-wheel="canvas"]', document).get(0)
        };
        var a = t.wheelElements, r = a.surface, i = a.$spinButton;
        a.$wheelContainer.css({height: t.wheelSize + 20});
        var o = function (e) {
            var n = $(window).width() > $(window).height() ? "landscape" : "portrait";
            "portrait" == n ? (t.dynamicStyles(r), t.initialDraw(), a.$wheelContainer.removeClass("please-casino-device")) : (a.$wheelContainer.addClass("please-casino-device"), a.$wheelContainer.css("height", window.screen.height)), "function" == typeof e && e()
        };
        if (function () {
                o()
            }(), $(window).on("resize", function () {
                o()
            }), n.envDev && $(window).on("resize", function () {
                a.$wheelContainer.find(".best-wheel").hide(), setTimeout(function () {
                    a.$loader.show(), t.deviceWidth = window.screen.availWidth, t.wheelSize = t.deviceWidth - 12, t.dynamicStyles(r), t.draw()
                }, 100)
            }), t.wheelMode && (n.wheelMode = t.wheelMode), a.$welcomeAlert.append("<p>" + t.welcomeText + "</p>"), !(t.textSectorsArray.length > 0))throw new Error("[ERROR:init] param textSectorsArray has zero items in array");
        if (n.wheelSectorsArray = t.getSectors(t.textSectorsArray), t.draw(), i.on("click", function () {
                if (!$(this).hasClass("disable"))if (t.attempts < 0)t.callback && "function" == typeof t.callback && t.callback(); else {
                    if ("number" == typeof t.stopSector)var e = t.stopSector;
                    t.startSpin(e), a.$wheelContainer.trigger("spin"), "paid" != n.wheelMode && "free" != n.wheelMode || a.$wheelContainer.trigger("changeAttempts")
                }
            }), "paid" == n.wheelMode) {
            var l = t.attempts < 0 ? 0 : t.attempts;
            $('[data-wheel="attempts"]', document).text(l)
        }
    },
    draw: function () {
        var e = this, t = e.variables, n = e.wheelElements, a = n.surface;
        if (a.getContext) {
            var r = e.drawWheelCanvas(t.wheelSectorsArray, e.wheelImgsPath);
            e.checkIsCanvasBlank(r);
            var i = 0, o = setInterval(function () {
                i > 0 && !e.bgWheelLoaded && e.checkIsCanvasBlank(r), i++;
                var a = e.bgWheelLoaded ? e.convertCanvasToImage(r, "wheel-bg") : null;
                null != a && t.imagesIsLoaded && (t.wheel = a, clearInterval(o), $(t.wheel).on("load", function () {
                    n.$loader.hide(), n.$wheelContainer.find(".best-wheel").show(), e.initialDraw()
                }))
            }, 100)
        }
    },
    initialDraw: function () {
        var e = this, t = e.variables, n = e.wheelElements, a = t.wheel, r = n.surface.getContext("2d");
        null != a && (r.canvas.width = a.width, r.canvas.height = a.height, r.drawImage(a, 0, 0), r.save(), r.beginPath(),
            r.arc(a.width / 2, 0, 0, 0, 2 * Math.PI, !1), r.lineWidth = 3, r.strokeStyle = "rgba(0,0,0,0.5)",
            r.stroke(), r.closePath(), e.envDev && console.timeEnd("Mobile wheel is inited by "))
    },
    drawWheelCanvas: function (e, t) {
        var n = this,
            a = new Image,
            r = document.createElement("canvas"),
            i = parseInt(n.wheelSize),
            o = i > 500 ? "generated-wheel-big.png" : "generated-wheel.png";
        return r.id = "temp-canvas",
            r.width = i,
            r.height = i,
            a.src = t + o,
            a.onload = function () {
                var e = r.getContext("2d");
                e.drawImage(a, 0, 0, i, i)
            },r
    },
    startSpin: function (e) {
        var t = this, n = t.variables, a = t.wheelElements, r = void 0;
        "spinning" != n.wheelState && ("undefined" == typeof e ? (r = 0, t.determinedGetUrl && $.ajax({
            type: "POST",
            url: t.determinedGetUrl,
            cache: !1,
            success: function (e) {
                var a, r = e.num;
                a = Math.floor(t.prizes[r].startAngle + .5 * (t.prizes[r].endAngle - t.prizes[r].startAngle)),
                    a = 360 + n.pointerAngle - a, n.ServerTargetAngle = 360 * (6 * n.power) + a,
                    n.prizeReceived = !0
            }
        })) : r = Math.floor(t.prizes[e].startAngle + .5 * (t.prizes[e].endAngle - t.prizes[e].startAngle)),
        "undefined" != typeof r && "reset" == n.wheelState && n.power && (r = 360 + n.pointerAngle - r, n.targetAngle = 360 * (6 * n.power) + r, n.randomLastThreshold = Math.floor(90 + 90 * Math.random()),
            a.$spinButton.addClass("disable"),
            n.wheelState = "spinning",
            n.soundIsPlayed = !1, t.doSpin(),
            a.$wheelContainer.addClass("spinning"),
            a.sound.setAttribute("loop", ""),
            a.sound = t.playSound(a.sound, "/assets/audio/2.mp3")))
    },
    doSpin: function (e) {
        function t(e, t) {
            var a = r.surface.getContext("2d");
            a.save(), a.translate(.5 * t.width, .5 * t.height), a.rotate(n.DegToRad(e)), a.translate(.5 * -t.width, .5 * -t.height), a.drawImage(t, 0, 0, t.width, t.height), a.restore()
        }

        var n = this, a = n.variables, r = n.wheelElements;
        if (n.determinedGetUrl)if (a.prizeReceived)a.targetAngle = a.ServerTargetAngle; else if (a.targetAngle += 10, a.angle = 14, a.targetAngle > 15e3)return n.stopSound(r.sound), n.resetWheel(), alert("Потеряна связь с сервером!"), !1;
        var i = e ? e : a.currentAngle;
        if (t(i, a.wheel), a.currentAngle += a.angle, a.currentAngle < a.targetAngle) {
            var o = a.targetAngle - a.currentAngle;
            o > 6480 ? a.angle = 55 : o > 5e3 ? a.angle = 45 : o > 4e3 ? a.angle = 30 : o > 2500 ? a.angle = 25 : o > 1800 ? a.angle = 15 : o > 1400 ? a.angle = 14.5 : o > 900 ? a.angle = 11.25 : o > 400 ? a.angle = 7.5 : o > 300 ? a.angle = 4 : o > 220 ? a.angle = 3.5 : o > 200 ? a.angle = 3 : o > 180 ? a.angle = 2.5 : o > 160 ? a.angle = 2 : o > a.randomLastThreshold ? a.angle = 1.5 : a.angle = 1, a.spinTimer = setTimeout(function () {
                n.doSpin()
            }, a.theSpeed)
        } else if (a.wheelState = "stopped", n.prizes) {
            var l = Math.floor(a.currentAngle / 360), s = a.currentAngle - 360 * l, h = Math.floor(a.pointerAngle - s);
            h < 0 && (h = 360 - Math.abs(h));
            for (var d = 1; d <= Object.keys(WheelFortuneMobile.prizes).length; d++)if (h >= n.prizes[d].startAngle && h <= n.prizes[d].endAngle) {
                r.$highlightSector.show(), n.stopSound(r.sound), r.sound.removeAttribute("loop"), r.sound = n.playSound(r.sound, "/assets/audio/msg_appear.mp3");
                var g = a.wheelSectorsArray ? n.textSectorsArray[d - 1] : "error";
                if ("error" === g)throw new Error("[ERROR:doSpin] wheelSectorsArray is " + n.wheelSectorsArray);
                "paid" != a.wheelMode || 1 != d && 5 != d ? setTimeout(function () {
                    r.$popup.find("h1").text("Поздравляем!"), r.$popup.find("h3").show(), r.$sectorPrize.html(g), r.$getPrizeBtn.find("span").text("Забрать"), r.$wheelContainer.hide(), r.$wheelContainer.next().hide(), r.$wheelContainer.next().next().hide(), r.$popup.removeClass("hide")
                }, 300) : setTimeout(function () {
                    r.$popup.find("h1").text("Фортуна капризна!"), r.$popup.find("h3").hide(), r.$sectorPrize.html(g), r.$getPrizeBtn.find("span").text("Выйти"), r.$wheelContainer.hide(), r.$wheelContainer.next().hide(), r.$wheelContainer.next().next().hide(), r.$popup.removeClass("hide")
                }, 300), r.$wheelContainer.addClass("won").removeClass("spinning slow"), r.$getPrizeBtn.off().on("click", function () {
                    r.$wheelContainer.trigger("getPrize"), r.$highlightSector.hide(), r.$wheelContainer.removeClass("won"), r.$sectorPrize.empty(), n.resetWheel(), r.$wheelContainer.show(), r.$wheelContainer.next().show(), r.$wheelContainer.next().next().show(), r.$popup.addClass("hide")
                });
                break
            }
        }
        4 == a.angle && 1 != a.soundIsPlayed && (r.sound.removeAttribute("loop"), r.sound = n.playSound(r.sound, "/assets/audio/3.mp3"), r.$wheelContainer.addClass("slow"), a.soundIsPlayed = !0)
    },
    resetWheel: function (e) {
        var t = this, n = t.variables;
        clearTimeout(n.spinTimer), n.angle = 0, n.targetAngle = 0, n.currentAngle = 0, n.prizeReceived = 0, n.ServerTargetAngle = 0, n.wheelState = "reset", "popup-close" != e && t.initialDraw()
    },
    DegToRad: function (e) {
        var t, n = Math.PI;
        return t = e * n / 180
    },
    getSectors: function (e) {
        var t, n = this, a = [];
        return e.forEach(function (e, r) {
            t = n.renderImage(e), a.push(t)
        }), a
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
    checkIsCanvasBlank: function (e) {
        var t, n = this, a = document.createElement("canvas"), r = new Image;
        a.width = e.width, a.height = e.height, r.src = n.wheelImgsPath + "bg-wheel.png", r.onload = function () {
            var i = a.getContext("2d");
            i.drawImage(r, 0, 0, e.width, e.height), a = a.toDataURL(), t = e.toDataURL(), resemble(t).compareTo(a).onComplete(function (e) {
                var t = parseInt(e.misMatchPercentage);
                t < 50 && (n.bgWheelLoaded = !0)
            })
        }
    },
    renderImage: function (e) {
        var t = new Image, n = $("#sectors-template"), a = n.find("svg").get()[0];
        a.setAttribute("width", "150"), a.setAttribute("height", "70");
        var r = a.outerHTML.replace("htmlContent", e);
        return r = r.replace(/\n/g, " "), r = r.replace(/\n/g, " "), r = r.split("  ").join(""), t.width = 150, t.height = 70, t.onload = function () {
            t.src = "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(r)))
        }, t
    },
    generateImageID: function () {
        var e = this, t = e.textSectorsArray, n = "";
        return t.forEach(function (e) {
            n += e.split(" ").join("")
        }), "_wof" + e.hashCode(n)
    },
    hashCode: function (e) {
        var t, n = 0;
        if (0 == e.length)return n;
        for (var a = 0; a < e.length; a++)t = e.charCodeAt(a), n = (n << 5) - n + t, n &= n;
        return Math.abs(n)
    }
};