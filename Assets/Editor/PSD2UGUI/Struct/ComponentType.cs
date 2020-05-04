using PSD2UGUI.Attribute;

namespace PSD2UGUI.Struct
{
    public enum ComponentType
    {
        [EnumValue("lab")]
        LABEL,
        [EnumValue("img")]
        SPRITE,
        [EnumValue("rimg")]
        TEXTURE,
        [EnumValue("btn")]
        BUTTON,
        [EnumValue("pnl")]
        PANEL,
        [EnumValue("wnd")]
        WINDOW,
        [EnumValue("9s")]
        SLICE,
    }
}
