using UnityEngine;
using UnityEngine.UI;
using PSD2UGUI.Attribute;
using PSD2UGUI.Extension;
using PSD2UGUI.Interface;
using PSD2UGUI.Struct;

namespace PSD2UGUI.Generator
{
    [NodeType(ComponentType.SPRITE)]
    class SpriteGenerateNode : Singleton<SpriteGenerateNode>, IGenerateNode
    {
        void IGenerateNode.UpdateNode(BaseInfo baseInfo, GameObject node)
        {
            var info = baseInfo as SpriteInfo;
            var image = node.AddMissingComponent<Image>();
            image.type = Image.Type.Simple;
            Extensions.UpdateImage(image, info);
        }
    }
}
