//#region String扩展
if (!String.format) {
    String.format = function (format) {
        var str = format
        var args = Array.prototype.slice.call(arguments, 1);
        for (var index = 0; index < args.length; index++) {
            var element = args[index]
            str = str.replace("{" + index + "}", element)
        }
        return str
    }
}
//#endregion String扩展

//#region 弹提示
//弹普通提示
function ShowMsg(msg) {
    if (showDialog)
        alert(msg)
}

//弹警告提示
function ShowWarn(msg) {
    alert(msg)
}

//弹错误提示
function ShowError(msg) {
    alert(msg)
    throw new Error(msg, "customException", 0)
}
//#endregion 弹提示

//#region RGB转Hex扩展
function RGBToHex(r, g, b, a) {
    toHex = function (rgb) {
        var hex = Number(rgb).toString(16)
        if (hex.length < 2) {
            hex = "0" + hex
        }
        return hex
    }

    var red = toHex(r)
    var green = toHex(g)
    var blue = toHex(b)
    var alpha = "FF"

    if (a) {
        alpha = toHex(a)
    }

    return red + green + blue + alpha
}
//#endregion RGB转Hex扩展