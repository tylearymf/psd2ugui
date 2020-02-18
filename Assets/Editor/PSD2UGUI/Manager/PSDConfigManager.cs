using UnityEngine;
using SimpleJSON;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System;
using UnityEngine.Assertions;
using UnityEngine.UI;
using PSD2UGUI.Attribute;
using PSD2UGUI.Extension;
using PSD2UGUI.Interface;
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

        public const string k_ConfigName = "Config.json";
        public Vector2 Pivot { private set; get; }
        public RectTransform ViewParent { private set; get; }
        public string CurrentPsdName { private set; get; }

        public void ParseConfig(string configPath)
        {
            var file = new FileInfo(configPath);
            if (!file.Exists) throw new FileNotFoundException();

            var content = File.ReadAllText(configPath);

            var jsonNode = JSON.Parse(content);

            CurrentPsdName = jsonNode["name"].Value;

            var root = Extensions.NewGo("Root", null);
            root.AddMissingComponent<CanvasScaler>();
            root.AddMissingComponent<GraphicRaycaster>();
            var canvas = root.AddMissingComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;

            var layers = jsonNode["layers"].Children;
            Pivot = jsonNode["pivot"].ReadVector2();

            var view = Extensions.NewGo(CurrentPsdName, root.transform);
            ViewParent = (RectTransform)view.transform;
            ViewParent.anchorMin = Vector2.zero;
            ViewParent.anchorMax = Vector2.one;
            ViewParent.pivot = Vector2.one * 0.5F;
            ViewParent.anchoredPosition3D = Vector3.zero;
            ViewParent.sizeDelta = Vector2.zero;

            EditorCoroutine.StartCoroutine(new EditorWaitForSeconds(0.1F, () =>
            {
                try
                {
                    var nodes = new List<LayerNode>();
                    var index = 0;

                    //生成节点
                    GenerateLayers(layers, ViewParent);

                    //处理节点关系
                    AdjustLayers(layers, ViewParent, nodes, ref index);

                    //回调事件，更新节点
                    UpdateNode(nodes, ViewParent);
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
                var trans = nodeGo.GetComponent<RectTransform>();
                trans.pivot = Pivot;
                trans.anchoredPosition = item["pos"].ReadVector2();
                trans.sizeDelta = item["size"].ReadVector2();

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
                var child = ViewParent.Find(GetUniqueName(item));
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

                if (info.NodeType == ComponentType.Window)
                {
                    rect.anchorMin = Vector2.zero;
                    rect.anchorMax = Vector2.one;
                    rect.pivot = Vector2.one * 0.5F;
                    rect.anchoredPosition3D = Vector3.zero;
                    rect.sizeDelta = Vector2.zero;
                }

                if (info.AnchorType != 0)
                {
                    var anchor = Vector2.zero;
                    switch (info.AnchorType)
                    {
                        case AnchorType.TopLeft:
                            anchor = new Vector2(0F, 1F);
                            break;
                        case AnchorType.Left:
                            anchor = new Vector2(0F, 0.5F);
                            break;
                        case AnchorType.BottomLeft:
                            anchor = new Vector2(0F, 0F);
                            break;
                        case AnchorType.Top:
                            anchor = new Vector2(0.5F, 1F);
                            break;
                        case AnchorType.Center:
                            anchor = new Vector2(0.5F, 0.5F);
                            break;
                        case AnchorType.Bottom:
                            anchor = new Vector2(0.5F, 0F);
                            break;
                        case AnchorType.TopRight:
                            anchor = new Vector2(1F, 1F);
                            break;
                        case AnchorType.Right:
                            anchor = new Vector2(1F, 0.5F);
                            break;
                        case AnchorType.BottomRight:
                            anchor = new Vector2(1F, 0F);
                            break;
                        default:
                            throw new NotImplementedException(string.Format("AnchorType:{0} 未实现.", info.AnchorType));
                    }

                    Extensions.SetAnchor(rect, anchor, false);
                    Extensions.SetAnchor(rect, anchor, true);
                    Extensions.SetPivot(rect, anchor);
                }

                generate.UpdateNode(info, item.Transform.gameObject);
            }
        }
    }
}