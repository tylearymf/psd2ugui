using PSD2UGUI.Attribute;
using SimpleJSON;

namespace PSD2UGUI.Struct
{
    [NodeType(ComponentType.TEXTURE)]
    class TextureInfo : BaseInfo
    {
        public TextureInfo(JSONNode node) : base(node)
        {
        }
    }
}
