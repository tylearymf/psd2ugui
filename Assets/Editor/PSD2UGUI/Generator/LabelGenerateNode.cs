using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using PSD2UGUI.Attribute;
using PSD2UGUI.Extension;
using PSD2UGUI.Interface;
using PSD2UGUI.Struct;
using PSD2UGUI.Manager;

namespace PSD2UGUI.Generator
{
    [NodeType(ComponentType.Label)]
    class LabelGenerateNode : Singleton<LabelGenerateNode>, IGenerateNode
    {
        const int k_AdjustFontSize = 10;

        void IGenerateNode.UpdateNode(BaseInfo baseInfo, GameObject node)
        {
            var info = baseInfo as LabelInfo;

            var text = node.AddMissingComponent<Text>();
            text.text = info.GetContentWithColor();
            text.fontSize = info.FontSize;

            if (info.OutlineColor != Color.clear)
            {
                var outline = node.AddMissingComponent<Outline>();
                outline.effectColor = info.OutlineColor;
                outline.effectDistance = info.OutlineSize;
            }

            var font = ResourceManager.GetFontByName(info.Font);
            if (font != null)
            {
                text.font = font;
            }
            else
            {
                Debug.LogError("找不到字体：" + info.Font);
            }

            text.horizontalOverflow = HorizontalWrapMode.Overflow;
            text.verticalOverflow = VerticalWrapMode.Overflow;
            text.horizontalOverflow = HorizontalWrapMode.Wrap;
            text.verticalOverflow = VerticalWrapMode.Truncate;

            text.alignment = info.TextAnchor;

            switch (info.TextDirection)
            {
                case LabelInfo.Direction.Horizontal:
                    text.rectTransform.sizeDelta = new Vector2(text.preferredWidth, info.FontSize + k_AdjustFontSize);
                    break;
                case LabelInfo.Direction.Vertical:
                    text.rectTransform.sizeDelta = new Vector2(info.FontSize + k_AdjustFontSize, text.preferredHeight);
                    break;
                default:
                    throw new NotImplementedException();
            }
        }
    }
}
