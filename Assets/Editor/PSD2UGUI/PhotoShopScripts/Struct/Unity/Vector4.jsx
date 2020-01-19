Vector4 = function (x, y, z, w) {
    Vector3.call(this, x, y, z)
    this.w = w || 0
}
Vector4.prototype.toString = function () {
    return "(" + this.x + "," + this.y + "," + this.z + "," + this.w + ")"
}
Vector4.parse = function (array) {
    var val = new Vector4()
    if (array != null) {
        var temp = new Array()
        for (var i = 0; i < array.length; i++) {
            var v = array[i];
            temp[i] = parseFloat(v);
        }
        val.x = temp[0]
        val.y = temp[1]
        val.z = temp[2] - temp[0]
        val.w = temp[3] - temp[1]
    }
    return val
}