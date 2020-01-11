using PSD2UGUI.Attribute;
using PSD2UGUI.Manager;
using PSD2UGUI.Struct;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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

        static public GameObject NewGo(string name, Transform parent)
        {
            var go = new GameObject(string.IsNullOrEmpty(name) ? "GameObject" : name);
            go.AddMissingComponent<RectTransform>();

            if (parent)
            {
                var trans = go.transform;
                trans.SetParent(parent);

                trans.localPosition = Vector3.zero;
                trans.localRotation = Quaternion.identity;
                trans.localScale = Vector3.one;

                ((RectTransform)trans).pivot = Vector2.one * 0.5F;
            }

            return go;
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
            image.sprite = ResourceManager.GetSpriteByName(PSDConfigManager.Instance.CurrentPsdName, baseInfo.ImageName);

            if (baseInfo.NodeType == ComponentType.Slice)
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
            image.texture = ResourceManager.GetTextureByName(PSDConfigManager.Instance.CurrentPsdName, baseInfo.ImageName);
            image.rectTransform.sizeDelta = baseInfo.Size;
        }
    }
}
