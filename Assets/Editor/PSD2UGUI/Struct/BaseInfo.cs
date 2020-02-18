using PSD2UGUI.Manager;
using SimpleJSON;
using System;
using UnityEngine;
using UnityEngine.UI;
using PSD2UGUI.Extension;

namespace PSD2UGUI.Struct
{
    public abstract class BaseInfo
    {
        public BaseInfo(JSONNode node)
        {
            m_Node = node;
            Name = node["name"].Value;
            LayerTypeName = node["layerTypeName"].Value;
            NodeTypeName = node["nodeTypeName"].Value;

            var array = node["nodeArgs"].AsArray;
            if (array != null)
            {
                NodeArgs = new string[array.Count];
                for (int i = 0; i < array.Count; i++)
                {
                    NodeArgs[i] = array[i].Value;
                }
            }

            Pos = node["pos"].ReadVector2();
            Size = node["size"].ReadVector2();
            Opacity = node["opacity"].AsFloat;

            m_InfoNode = node["info"];
            if (m_InfoNode != null)
            {
                var image = m_InfoNode["imageName"];
                ImageName = image == null ? string.Empty : image.Value;

                foreach (AnchorType item in Enum.GetValues(typeof(AnchorType)))
                {
                    var value = item.GetEnumValue();
                    if (value == m_InfoNode["anchorType"].Value)
                    {
                        AnchorType = item;
                        break;
                    }
                }
            }
        }

        JSONNode m_Node;
        JSONNode m_InfoNode;
        public JSONNode this[string key]
        {
            get
            {
                return m_Node[key];
            }
        }

        public JSONNode this[int key]
        {
            get
            {
                return m_Node[key];
            }
        }
        public JSONNode Info
        {
            get
            {
                return m_InfoNode;
            }
        }

        public string Name { protected set; get; }
        public string LayerTypeName { protected set; get; }
        public string NodeTypeName { protected set; get; }
        public string[] NodeArgs { protected set; get; }
        public Vector2 Pos { protected set; get; }
        public Vector2 Size { protected set; get; }
        public float Opacity { protected set; get; }
        public string ImageName { protected set; get; }
        public AnchorType AnchorType { protected set; get; }


        public ComponentType NodeType
        {
            get
            {
                return Extension.Extensions.ToComponentType(NodeTypeName);
            }
        }
    }
}