using PSD2UGUI.Attribute;
using SimpleJSON;

namespace PSD2UGUI.Struct
{
    [NodeType(ComponentType.SLICE)]
    class SliceInfo : SpriteInfo
    {
        public SliceInfo(JSONNode node) : base(node)
        {
        }
    }
}
