using PSD2UGUI.Attribute;
using SimpleJSON;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace PSD2UGUI.Struct
{
    [NodeType(ComponentType.Label)]
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
        public Direction TextDirection { protected set; get; }
        public TextAnchor TextAnchor { protected set; get; }

        public LabelInfo(JSONNode node) : base(node)
        {
            Content = Info["content"];
            Font = Info["font"];
            FontSize = Info["fontSize"].AsInt;
            Color = Info["color"];

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
                    case "center":
                        TextAnchor = TextAnchor.MiddleCenter;
                        break;
                    case "right":
                        TextAnchor = TextAnchor.MiddleRight;
                        break;
                    default:
                        throw new NotImplementedException();
                }
            }
        }

        public string GetContentWithColor()
        {
            return string.Format("<color=#{0}>{1}</color>", Color, Content);
        }
    }
}
