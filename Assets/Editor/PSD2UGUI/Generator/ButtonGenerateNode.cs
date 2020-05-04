using System;
using UnityEngine;
using UnityEngine.UI;
using PSD2UGUI.Attribute;
using PSD2UGUI.Extension;
using PSD2UGUI.Interface;
using PSD2UGUI.Struct;

namespace PSD2UGUI.Generator
{
    [NodeType(ComponentType.BUTTON)]
    class ButtonGenerateNode : Singleton<ButtonGenerateNode>, IGenerateNode
    {
        void IGenerateNode.UpdateNode(BaseInfo baseInfo, GameObject node)
        {
            var info = baseInfo as ButtonInfo;

            var btn = node.AddMissingComponent<Button>();

            Image image = null;
            switch (info.BtnType)
            {
                case ButtonInfo.ButtonType.Container:
                    image = node.GetComponentInChildren<Image>();
                    btn.targetGraphic = image;
                    break;
                case ButtonInfo.ButtonType.Self:
                    image = node.AddMissingComponent<Image>();
                    Extensions.UpdateImage(image, info);
                    break;
                default:
                    throw new NotImplementedException();
            }
        }
    }
}
