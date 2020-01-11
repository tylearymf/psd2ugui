using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using PSD2UGUI.Attribute;
using PSD2UGUI.Extension;
using PSD2UGUI.Interface;
using PSD2UGUI.Struct;

namespace PSD2UGUI.Generator
{
    [NodeType(ComponentType.Window)]
    class WindowGenerateNode : Singleton<WindowGenerateNode>, IGenerateNode
    {
        void IGenerateNode.UpdateNode(BaseInfo baseInfo, GameObject node)
        {
            node.AddMissingComponent<CanvasRenderer>();
        }
    }
}
