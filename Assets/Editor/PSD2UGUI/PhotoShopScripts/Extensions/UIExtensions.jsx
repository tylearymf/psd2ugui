UIExtensions = function () {
}

//ui 扩展
UIExtensions.AddGroup = function (win, text, callback) {
    var group = win.add("group")
    var stext = group.add("staticText")
    stext.alignment = ["fill", "center"]
    stext.text = text
    callback(group)
}

//ui 扩展
UIExtensions.AddDropDownList = function (group, type, defaultValue, callback) {
    var drop = group.add("dropDownList")
    for (var key in type) {
        drop.add("item", type[key])
    }
    var item = drop.find(defaultValue)
    if (item) item.selected = true
    drop.onChange = function () {
        callback(drop)
    }
}