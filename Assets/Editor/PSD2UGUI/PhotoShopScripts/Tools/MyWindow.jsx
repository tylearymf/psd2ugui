MyWindow = function (title, content, okCallBack, cancelCallBack, onGuiCallBack, okContent, cancelContent) {
    var win = new Window("dialog")
    win.orientation = "column"
    win.alignChildren = ["fill", "bottom"]
    win.preferredSize = [300, 130]
    win.text = !title ? "提示" : title

    var st = win.add("staticText")
    st.alignment = ["fill", "center"]
    st.text = content

    if (onGuiCallBack) onGuiCallBack(win)

    var group = win.add("group")
    var applyBtn = group.add("button")
    applyBtn.text = okContent || "确认"
    applyBtn.size = [120, 24]
    applyBtn.alignment = ["right", "center"]
    applyBtn.onClick = function () {
        if (okCallBack) {
            var val = okCallBack(win)
            if (val != undefined) {
                return val
            }
        }
        return win.close()
    }
    var cancelBtn = group.add("button")
    cancelBtn.text = cancelContent || "取消"
    cancelBtn.size = [120, 24]
    cancelBtn.alignment = ["right", "center"]
    cancelBtn.onClick = function () {
        if (cancelCallBack) {
            var val = cancelCallBack(win)
            if (val != undefined) {
                return val
            }
        }
        return win.close()
    }

    win.show()
}
