//配置操作对象
FileConfig = function (config) {
    this.name = "Config"
    this.extension = ".JSON"
    this.folderName = "Configs"
    this.config = config
    this.path = config.psdPath
    this.moduleName = RemoveUnityNotSupportSymbol(config.moduleName)
}

//获取导出根目录的路径
FileConfig.prototype.getRootPath = function () {
    var path = String.format("{0}/Export_{1}", this.path, this.moduleName)
    var folder = new Folder(path)
    if (!folder.exists) folder.create()

    return path
}

//获取模块信息的导出路径
FileConfig.prototype.getWindowPath = function () {
    var path = String.format("{0}/{1}", this.getRootPath(), this.moduleName)
    var folder = new Folder(path)
    if (!folder.exists) folder.create()

    return path
}

//获取公共图集的导出路径
FileConfig.prototype.getCommonPath = function () {
    var path = String.format("{0}/Common", this.getRootPath())
    var folder = new Folder(path)
    if (!folder.exists) folder.create()

    return path
}

FileConfig.prototype.getConfigFolderPath = function () {
    var path = String.format("{0}/{1}", this.getWindowPath(), this.folderName)
    var folder = new Folder(path)
    if (!folder.exists) folder.create()

    return path
}

//获取配置文件的路径
FileConfig.prototype.getConfigFullName = function () {
    var windowName = firstWindowName
    if (windowName == "") {
        windowName = firstPanelName
    }
    if (windowName != "") {
        windowName = "_" + windowName
    }

    return String.format("{0}/{1}{2}{3}", this.getConfigFolderPath(), this.name, windowName, this.extension)
}

FileConfig.prototype.save = function () {
    if (this.path == "" || !this.config) {
        ShowError("配置出错，不能保存")
    }

    var file = new File(this.getConfigFullName())
    file.encoding = "UTF8"
    file.lineFeed = "Windows"
    file.readonly = true
    file.open("w")
    var str = JSON.stringify(this.config)
    ShowMsg(str)
    file.writeln(str)
    file.close()
}

FileConfig.prototype.showInExplorer = function () {
    var folder = new Folder(this.getRootPath())
    folder.execute()
}