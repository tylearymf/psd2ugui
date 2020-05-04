using PSD2UGUI.Attribute;
using PSD2UGUI.Manager;
using PSD2UGUI.Struct;
using System;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace PSD2UGUI.Extension
{
    static class Extensions
    {
        static public string GetEnumValue(this Enum @enum)
        {
            var type = @enum.GetType();
            var field = type.GetField(@enum.ToString());
            var attributes = field.GetCustomAttributes(typeof(EnumValueAttribute), false) as EnumValueAttribute[];
            return attributes.Length == 0 ? string.Empty : attributes[0].Value;
        }

        static public ComponentType ToComponentType(this string value)
        {
            var values = Enum.GetValues(typeof(ComponentType));
            foreach (ComponentType item in values)
            {
                if (item.GetEnumValue() == value)
                {
                    return item;
                }
            }

            throw new NotImplementedException("ComponentType:" + value);
        }

        static public T AddMissingComponent<T>(this GameObject go) where T : Component
        {
            var t = go.GetComponent<T>();
            if (t == null)
            {
                t = go.AddComponent<T>();
            }
            return t;
        }

        static public GameObject NewGo(string name, Transform parent, bool setLayer = true)
        {
            var go = new GameObject(string.IsNullOrEmpty(name) ? "GameObject" : name);
            go.AddMissingComponent<RectTransform>();

            if (parent)
            {
                SetLayer(go.transform, parent.gameObject.layer);

                var trans = go.transform;
                trans.SetParent(parent);

                trans.localPosition = Vector3.zero;
                trans.localRotation = Quaternion.identity;
                trans.localScale = Vector3.one;

                ((RectTransform)trans).pivot = Vector2.one * 0.5F;
            }

            return go;
        }

        static public void SetLayer(Transform child, int layer)
        {
            child.gameObject.layer = layer;
            foreach (Transform item in child)
            {
                SetLayer(item, layer);
            }
        }

        static public Transform FindChildRecursive(this Transform transform, string childName)
        {
            if (!transform) return null;

            foreach (Transform item in transform)
            {
                if (item.name == childName)
                {
                    return item;
                }

                var trans = FindChildRecursive(item, childName);
                if (trans != null) return trans;
            }

            return null;
        }

        static public void UpdateImage(Image image, BaseInfo baseInfo)
        {
            image.sprite = ResourceManager.GetSpriteByName(PSDConfigManager.Instance.ModuleName, baseInfo.ImageName, baseInfo.IsCommonAsset);

            if (baseInfo.NodeType == ComponentType.SLICE)
            {
                image.rectTransform.sizeDelta = baseInfo.Size;
            }
            else
            {
                image.SetNativeSize();
            }
        }
        static public void UpdateTexture(RawImage image, BaseInfo baseInfo)
        {
            image.texture = ResourceManager.GetTextureByName(PSDConfigManager.Instance.ModuleName, baseInfo.ImageName, baseInfo.IsCommonAsset);
            image.rectTransform.sizeDelta = baseInfo.Size;
        }

        static public void SetAnchor(RectTransform rect, Vector2 value, bool isMax)
        {
            SetAnchorSmart(rect, value.x, 0, isMax, true, true);
            SetAnchorSmart(rect, value.y, 1, isMax, true, true);
        }

        static void SetAnchorSmart(RectTransform rect, float value, int axis, bool isMax, bool smart, bool enforceExactValue)
        {
            var method = typeof(EditorWindow).Assembly.GetType("UnityEditor.RectTransformEditor").GetMethod("SetAnchorSmart", new Type[] { typeof(RectTransform), typeof(float), typeof(int), typeof(bool), typeof(bool), typeof(bool) });
            method.Invoke(null, new object[] { rect, value, axis, isMax, smart, enforceExactValue });
            EditorUtility.SetDirty(rect);
        }

        static public void SetPivot(RectTransform rect, Vector2 value)
        {
            SetPivotSmart(rect, value.x, 0, true, true);
            SetPivotSmart(rect, value.y, 1, true, true);
        }

        static void SetPivotSmart(RectTransform rect, float value, int axis, bool smart, bool parentSpace)
        {
            var method = typeof(EditorWindow).Assembly.GetType("UnityEditor.RectTransformEditor").GetMethod("SetPivotSmart", new Type[] { typeof(RectTransform), typeof(float), typeof(int), typeof(bool), typeof(bool) });
            method.Invoke(null, new object[] { rect, value, axis, smart, parentSpace });
            EditorUtility.SetDirty(rect);
        }
    }
}
