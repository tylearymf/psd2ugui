using PSD2UGUI.Attribute;
using SimpleJSON;

namespace PSD2UGUI.Struct
{
    [NodeType(ComponentType.WINDOW)]
    class WindowInfo : BaseInfo
    {
        public WindowInfo(JSONNode node) : base(node)
        {
        }
    }
}