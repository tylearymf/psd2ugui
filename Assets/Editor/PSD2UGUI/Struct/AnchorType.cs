using PSD2UGUI.Attribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PSD2UGUI.Struct
{
    /// <summary>
    /// 锚点类型，其中 EnumValue 值对应 AnchorType.jsx 中的 Key
    /// </summary>
    public enum AnchorType
    {
        [EnumValue("TopLeft")]
        TopLeft = 1,
        [EnumValue("Left")]
        Left,
        [EnumValue("BottomLeft")]
        BottomLeft,
        [EnumValue("Top")]
        Top,
        [EnumValue("Center")]
        Center,
        [EnumValue("Bottom")]
        Bottom,
        [EnumValue("TopRight")]
        TopRight,
        [EnumValue("Right")]
        Right,
        [EnumValue("BottomRight")]
        BottomRight,
    }
}
