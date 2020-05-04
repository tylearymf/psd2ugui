using UnityEngine;
using PSD2UGUI.Extension;
using PSD2UGUI.Interface;
using PSD2UGUI.Struct;
using PSD2UGUI.Attribute;

namespace PSD2UGUI.Generator
{
    [NodeType(ComponentType.WINDOW)]
    class WindowGenerateNode : Singleton<WindowGenerateNode>, IGenerateNode
    {
        void IGenerateNode.UpdateNode(BaseInfo baseInfo, GameObject node)
        {
            node.AddMissingComponent<CanvasRenderer>();
        }
    }
}
