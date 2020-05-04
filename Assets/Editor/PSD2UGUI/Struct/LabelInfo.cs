using PSD2UGUI.Attribute;
using SimpleJSON;
using System;
using UnityEngine;

namespace PSD2UGUI.Struct
{
    [NodeType(ComponentType.LABEL)]
    class LabelInfo : BaseInfo
    {
        public enum Direction
        {
            Horizontal,
            Vertical,
        }

        public string Content { protected set; get; }
        public string Font { protected set; get; }
        public int FontSize { protected set; get; }
        public string Color { protected set; get; }
        public Color OutlineColor { protected set; get; }
        public Vector2 OutlineSize { protected set; get; }
        public Direction TextDirection { protected set; get; }
        public TextAnchor TextAnchor { protected set; get; }

        public LabelInfo(JSONNode node) : base(node)
        {
            Content = Info["content"];
            Font = Info["font"];
            FontSize = Info["fontSize"].AsInt;
            Color = Info["color"];
            OutlineColor = UnityEngine.Color.clear;
            OutlineSize = Info["outlineSize"].ReadVector2();

            var outlineColorStr = Info["outlineColor"].Value;
            if (!string.IsNullOrEmpty(outlineColorStr))
            {
                var outlineColor = UnityEngine.Color.clear;
                ColorUtility.TryParseHtmlString("#" + outlineColorStr, out outlineColor);
                OutlineColor = outlineColor;
            }

            TextDirection = Direction.Horizontal;
            var direction = Info["direction"].Value;
            if (!string.IsNullOrEmpty(direction))
            {
                TextDirection = (Direction)Enum.Parse(typeof(Direction), direction, true);
            }

            TextAnchor = TextAnchor.MiddleLeft;
            var alignmenet = Info["alignment"].Value;
            if (!string.IsNullOrEmpty(alignmenet))
            {
                alignmenet = alignmenet.ToLower();
                switch (alignmenet)
                {
                    case "left":
                        TextAnchor = TextAnchor.MiddleLeft;
                        break;
                    case "right":
                        TextAnchor = TextAnchor.MiddleRight;
                        break;
					case "center":
					default:                    
						TextAnchor = TextAnchor.MiddleCenter;
                        break;
                }
            }
        }

        public string GetContentWithColor()
        {
            return string.Format("<color=#{0}>{1}</color>", Color, Content);
        }
    }
}
