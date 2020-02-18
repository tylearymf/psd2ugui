using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using PSD2UGUI.Attribute;
using PSD2UGUI.Extension;
using PSD2UGUI.Interface;
using PSD2UGUI.Struct;
using Object = UnityEngine.Object;

namespace PSD2UGUI.Manager
{
    class ResourceManager
    {
        const string k_ConfigPrefixPath = "Assets/UI/PsdConfig";
        const string k_ConfigName = "PSDConfig";

        static public Font GetFontByName(string name)
        {
            var fonts = Resources.FindObjectsOfTypeAll<Font>();
            foreach (var item in fonts)
            {
                if (item.name == name)
                {
                    return item;
                }
            }
            return null;
        }

        static string GetImagePath(string psdName, string fileName, bool isTexture)
        {
            var subFolderName = isTexture ? "Textures" : "Sprites";
            return string.Format("{0}/{1}_{2}/{3}/{4}.png", k_ConfigPrefixPath, k_ConfigName, psdName, subFolderName, fileName);
        }

        static TextureImporter GetImporter(string path)
        {
            var importer = (TextureImporter)TextureImporter.GetAtPath(path);
            return importer;
        }

        static public void SetSpriteBorder(string psdName, string spriteName, Vector4 border)
        {
            var path = GetImagePath(psdName, spriteName, false);
            var importer = GetImporter(path);
            importer.spriteBorder = border;
            importer.SaveAndReimport();
        }

        static public Sprite GetSpriteByName(string psdName, string spriteName)
        {
            var path = GetImagePath(psdName, spriteName, false);
            var importer = GetImporter(path);
            if (importer.textureType != TextureImporterType.Sprite)
            {
                importer.textureType = TextureImporterType.Sprite;
                importer.SaveAndReimport();
            }

            var sprite = AssetDatabase.LoadAssetAtPath<Sprite>(path);
            return sprite;
        }

        static public Texture GetTextureByName(string psdName, string textureName)
        {
            var path = GetImagePath(psdName, textureName, true);
            var importer = GetImporter(path);
            if (importer.textureType != TextureImporterType.Default)
            {
                importer.textureType = TextureImporterType.Default;
                importer.SaveAndReimport();
            }

            var texture = AssetDatabase.LoadAssetAtPath<Texture2D>(path);
            return texture;
        }
    }
}
