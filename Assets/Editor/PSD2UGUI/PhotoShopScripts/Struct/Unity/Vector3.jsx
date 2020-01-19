Vector3 = function (x, y, z) {
    Vector2.call(this, x, y)
    this.z = z || 0
}

Vector3.prototype.toString = function () {
    return "(" + this.x + "," + this.y + "," + this.z + ")"
}