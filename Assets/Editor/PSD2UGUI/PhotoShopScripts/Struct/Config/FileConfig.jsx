//配置操作对象
FileConfig = function (config) {
    this.name = "Config.json"
    this.config = config
    this.path = config.psdPath
    this.folder = config.psdName
}

FileConfig.prototype.getFolderPath = function () {
    var path = null
    if (this.config.exportPath == null) {
        path = String.format("{0}/PSDConfig_{1}", this.path, this.folder)
    }
    else {
        path = this.config.exportPath
    }
    var folder = new Folder(path)
    if (!folder.exists) folder.create()
    return path
}

FileConfig.prototype.getFullName = function () {
    return String.format("{0}/{1}", this.getFolderPath(), this.name)
}

FileConfig.prototype.save = function () {
    if (this.path == "" || !this.config) {
        ShowError("配置出错，不能保存")
    }

    var file = new File(this.getFullName())
    file.encoding = "UTF8"
    file.lineFeed = "Windows"
    file.readonly = true
    file.open("w")
    var str = Json.stringify(this.config)
    ShowMsg(str)
    file.writeln(str)
    file.close()
}

FileConfig.prototype.showInExplorer = function () {
    var folder = new Folder(this.getFolderPath())
    folder.execute()
}