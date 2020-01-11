using PSD2UGUI.Attribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PSD2UGUI.Struct
{
    public enum ComponentType
    {
        [EnumValue("lab")]
        Label,
        [EnumValue("img")]
        Sprite,
        [EnumValue("rimg")]
        Texture,
        [EnumValue("btn")]
        Button,
        [EnumValue("pnl")]
        Panel,
        [EnumValue("wnd")]
        Window,
        [EnumValue("9s")]
        Slice,
    }
}
