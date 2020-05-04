using PSD2UGUI.Attribute;
using SimpleJSON;

namespace PSD2UGUI.Struct
{
    [NodeType(ComponentType.SPRITE)]
    class SpriteInfo : BaseInfo
    {
        public SpriteInfo(JSONNode node) : base(node)
        {
        }
    }
}
