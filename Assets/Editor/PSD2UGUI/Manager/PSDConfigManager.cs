using UnityEngine;
using SimpleJSON;
using System.Collections.Generic;
using System.IO;
using System;
using UnityEngine.UI;
using PSD2UGUI.Extension;
using PSD2UGUI.Struct;

namespace PSD2UGUI.Manager
{
    public class PSDConfigManager
    {
        static readonly PSDConfigManager s_Instance = new PSDConfigManager();
        static public PSDConfigManager Instance
        {
            get
            {
                return s_Instance;
            }
        }

        public Vector2 Pivot { private set; get; }
        public RectTransform GUISystemRoot { private set; get; }
        public string ModuleName { private set; get; }

        public void ParseConfig(string content)
        {
            JSONNode jsonNode = null;

            try
            {
                jsonNode = JSON.Parse(content);
            }
            catch (Exception ex)
            {
                Debug.LogErrorFormat("配置读取失败！");
                Debug.LogException(ex);
                return;
            }

            ModuleName = jsonNode["name"].Value;

            var rootName = "GUISystem";
            var root = GameObject.Find(rootName);
            if (!root)
            {
                root = Extensions.NewGo("GUISystem", null);
                root.AddMissingComponent<CanvasScaler>();
                root.AddMissingComponent<GraphicRaycaster>();
                var canvas = root.AddMissingComponent<Canvas>();
                canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            }

            GUISystemRoot = (RectTransform)root.transform;
            var layers = jsonNode["layers"].Children;
            Pivot = jsonNode["pivot"].ReadVector2();

            EditorCoroutine.StartCoroutine(new EditorWaitForSeconds(0.1F, () =>
            {
                try
                {
                    var nodes = new List<LayerNode>();
                    var index = 0;

                    //生成节点
                    GenerateLayers(layers, GUISystemRoot);

                    //处理节点关系
                    AdjustLayers(layers, GUISystemRoot, nodes, ref index);

                    //回调事件，更新节点
                    UpdateNode(nodes, GUISystemRoot);
                }
                catch (Exception ex)
                {
                    Debug.LogException(ex);
                    UnityEngine.Object.DestroyImmediate(root);
                }
            }));
        }

        string GetUniqueName(JSONNode node)
        {
            var name = string.Format("{0}_{1}", node["name"].Value, node["name"].GetHashCode());
            return name;
        }

        void GenerateLayers(IEnumerable<JSONNode> layers, Transform parent)
        {
            foreach (var item in layers)
            {
                var nodeGo = Extensions.NewGo(GetUniqueName(item), parent);
                var rect = nodeGo.GetComponent<RectTransform>();
                rect.pivot = Pivot;

                var nodeType = item["nodeTypeName"].Value.ToComponentType();
                rect.anchoredPosition3D = item["pos"].ReadVector2();
                rect.sizeDelta = item["size"].ReadVector2();

                var info = NodeManager.Instance.GetInstantiaInfo(nodeType, item);
                if (info.AnchorType != 0)
                {
                    var minAnchor = Vector2.zero;
                    var maxAnchor = Vector2.zero;
                    var pivot = Vector2.zero;
                    switch (info.AnchorType)
                    {
                        case AnchorType.LEFTTOP:
                            pivot = minAnchor = maxAnchor = new Vector2(0F, 1F);
                            break;
                        case AnchorType.LEFT:
                            pivot = minAnchor = maxAnchor = new Vector2(0F, 0.5F);
                            break;
                        case AnchorType.LEFTBOTTOM:
                            pivot = minAnchor = maxAnchor = new Vector2(0F, 0F);
                            break;
                        case AnchorType.TOP:
                            pivot = minAnchor = maxAnchor = new Vector2(0.5F, 1F);
                            break;
                        case AnchorType.CENTER:
                            pivot = minAnchor = maxAnchor = new Vector2(0.5F, 0.5F);
                            break;
                        case AnchorType.BOTTOM:
                            pivot = minAnchor = maxAnchor = new Vector2(0.5F, 0F);
                            break;
                        case AnchorType.RIGHTTOP:
                            pivot = minAnchor = maxAnchor = new Vector2(1F, 1F);
                            break;
                        case AnchorType.RIGHT:
                            pivot = minAnchor = maxAnchor = new Vector2(1F, 0.5F);
                            break;
                        case AnchorType.RIGHTBOTTOM:
                            pivot = minAnchor = maxAnchor = new Vector2(1F, 0F);
                            break;
                        case AnchorType.STRETCH:
                            minAnchor = Vector2.zero;
                            maxAnchor = Vector2.one;
                            pivot = Vector2.one * 0.5F;
                            break;
                        default:
                            throw new NotImplementedException(string.Format("AnchorType:{0} 未实现.", info.AnchorType));
                    }

                    Extensions.SetAnchor(rect, minAnchor, false);
                    Extensions.SetAnchor(rect, maxAnchor, true);
                    Extensions.SetPivot(rect, pivot);
                }

                //将Window的位置信息归零居中
                if (nodeType == ComponentType.WINDOW)
                {
                    rect.anchoredPosition3D = Vector2.zero;
                    rect.sizeDelta = Vector2.zero;
                }

                switch (item["layerTypeName"].Value)
                {
                    case "ArtLayer":
                        break;
                    case "LayerSet":
                        var childs = item["layers"].Children;
                        GenerateLayers(childs, parent);
                        break;
                    default:
                        throw new NotImplementedException();
                }
            }
        }

        struct LayerNode
        {
            public Transform Transform { set; get; }
            public JSONNode JSONNode { set; get; }
            public int Index { set; get; }
        }

        void AdjustLayers(IEnumerable<JSONNode> layers, Transform parent, List<LayerNode> nodes, ref int index)
        {
            index++;
            foreach (var item in layers)
            {
                var child = GUISystemRoot.Find(GetUniqueName(item));
                child.SetParent(parent);
                child.name = item["name"].Value;

                nodes.Add(new LayerNode()
                {
                    Index = index,
                    JSONNode = item,
                    Transform = child,
                });

                if (item["layerTypeName"].Value == "LayerSet")
                {
                    var childs = item["layers"].Children;
                    AdjustLayers(childs, child, nodes, ref index);
                }
            }
        }

        void UpdateNode(List<LayerNode> nodes, Transform parent)
        {
            nodes.Sort((x, y) =>
            {
                return y.Index.CompareTo(x.Index);
            });
            foreach (var item in nodes)
            {
                var nodeType = item.JSONNode["nodeTypeName"].Value.ToComponentType();
                var generate = NodeManager.Instance.GetGenerateNode(nodeType);
                var info = NodeManager.Instance.GetInstantiaInfo(nodeType, item.JSONNode);
                var rect = (RectTransform)item.Transform;

                generate.UpdateNode(info, item.Transform.gameObject);
            }
        }
    }
}