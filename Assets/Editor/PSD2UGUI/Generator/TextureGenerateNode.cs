using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;
using PSD2UGUI.Attribute;
using PSD2UGUI.Extension;
using PSD2UGUI.Interface;
using PSD2UGUI.Struct;

namespace PSD2UGUI.Generator
{
    [NodeType(ComponentType.Texture)]
    class TextureGenerateNode : Singleton<TextureGenerateNode>, IGenerateNode
    {
        void IGenerateNode.UpdateNode(BaseInfo baseInfo, GameObject node)
        {
            var info = baseInfo as TextureInfo;
            var image = node.AddMissingComponent<RawImage>();
            Extensions.UpdateTexture(image, info);
        }
    }
}
