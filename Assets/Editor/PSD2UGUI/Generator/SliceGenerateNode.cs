using UnityEngine;
using UnityEngine.UI;
using PSD2UGUI.Attribute;
using PSD2UGUI.Extension;
using PSD2UGUI.Interface;
using PSD2UGUI.Struct;
using PSD2UGUI.Manager;

namespace PSD2UGUI.Generator
{
    [NodeType(ComponentType.SLICE)]
    class SliceGenerateNode : Singleton<SliceGenerateNode>, IGenerateNode
    {
        void IGenerateNode.UpdateNode(BaseInfo baseInfo, GameObject node)
        {
            var info = baseInfo as SliceInfo;
            var image = node.AddMissingComponent<Image>();
            image.type = Image.Type.Sliced;

            var nodeArgs = info.NodeArgs;
            var border = new Vector4();
            if (nodeArgs.Length == 1)
            {
                border.x = border.y = border.z = border.w = int.Parse(nodeArgs[0]);
            }
            else if (nodeArgs.Length == 4)
            {
                border.x = int.Parse(nodeArgs[0]);
                border.y = int.Parse(nodeArgs[3]);
                border.z = int.Parse(nodeArgs[2]);
                border.w = int.Parse(nodeArgs[1]);
            }

            ResourceManager.SetSpriteBorder(PSDConfigManager.Instance.ModuleName, info.ImageName, info.IsCommonAsset, border);
            Extensions.UpdateImage(image, info);
        }
    }
}
