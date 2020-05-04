using PSD2UGUI.Attribute;
using SimpleJSON;

namespace PSD2UGUI.Struct
{
    [NodeType(ComponentType.PANEL)]
    class PanelInfo : BaseInfo
    {
        public PanelInfo(JSONNode node) : base(node)
        {
        }
    }
}
