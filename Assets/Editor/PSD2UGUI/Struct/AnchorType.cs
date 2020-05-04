using PSD2UGUI.Attribute;

namespace PSD2UGUI.Struct
{
    /// <summary>
    /// 锚点类型，其中 EnumValue 值对应 AnchorType.jsx 中的 Key
    /// </summary>
    public enum AnchorType
    {
        [EnumValue("LEFTTOP")]
        LEFTTOP = 1,
        [EnumValue("LEFT")]
        LEFT,
        [EnumValue("LEFTBOTTOM")]
        LEFTBOTTOM,
        [EnumValue("TOP")]
        TOP,
        [EnumValue("CENTER")]
        CENTER,
        [EnumValue("BOTTOM")]
        BOTTOM,
        [EnumValue("RIGHTTOP")]
        RIGHTTOP,
        [EnumValue("RIGHT")]
        RIGHT,
        [EnumValue("RIGHTBOTTOM")]
        RIGHTBOTTOM,
        [EnumValue("STRETCH")]
        STRETCH,
    }
}
