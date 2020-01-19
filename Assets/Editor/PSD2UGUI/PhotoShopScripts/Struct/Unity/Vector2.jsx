Vector2 = function (x, y) {
    this.x = x || 0
    this.y = y || 0
}
Vector2.prototype.toString = function () {
    return "(" + this.x + "," + this.y + ")"
}