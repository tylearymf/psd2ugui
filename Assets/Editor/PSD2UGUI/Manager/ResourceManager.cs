using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;

namespace PSD2UGUI.Manager
{
    class ResourceManager
    {
        /// <summary>
        /// 配置文件夹/图集文件夹
        /// </summary>
        const string k_ConfigPrefixPath = "Assets/UI/PsdConfig";
        /// <summary>
        /// 字体文件夹
        /// </summary>
        const string k_FontPath = "Assets/Font";

        const string k_SpritesFolderName = "Sprites";
        const string k_TexturesFolderName = "Textures";
        const string k_CommonFolderName = "Common";

        static Dictionary<string, Font> s_FontDic;

        static public Font GetFontByName(string name)
        {
            if (s_FontDic == null)
            {
                s_FontDic = new Dictionary<string, Font>();
                var fonts = Resources.FindObjectsOfTypeAll<Font>().ToList();
                foreach (var item in fonts)
                {
                    s_FontDic.Add(item.name.ToLower(), item);
                }

                var directoryInfo = new DirectoryInfo(k_FontPath);
                if (directoryInfo.Exists)
                {
                    var files = directoryInfo.GetFiles("*.ttf", SearchOption.AllDirectories);
                    foreach (var file in files)
                    {
                        var path = file.FullName.Replace("\\", "/").Replace(Application.dataPath, string.Empty);
                        path = "Assets" + path;

                        var font = AssetDatabase.LoadAssetAtPath<Font>(path);
                        if (!font) continue;
                        s_FontDic[font.name.ToLower()] = font;
                    }
                }
            }

            s_FontDic.TryGetValue(name.ToLower(), out var temp);
            return temp;
        }

        static string GetImagePath(string psdName, string fileName, bool isTexture)
        {
            var subFolderName = isTexture ? k_TexturesFolderName : k_SpritesFolderName;
            return string.Format("{0}/{1}/{2}/{3}.png", k_ConfigPrefixPath, psdName, subFolderName, fileName);
        }

        static TextureImporter GetImporter(string path)
        {
            var importer = (TextureImporter)TextureImporter.GetAtPath(path);
            if (importer == null)
            {
                throw new System.NullReferenceException("该资源找不到.path:" + path);
            }

            return importer;
        }

        static public void SetSpriteBorder(string psdName, string spriteName, bool isCommon, Vector4 border)
        {
            var path = GetImagePath(isCommon ? k_CommonFolderName : psdName, spriteName, false);
            var importer = GetImporter(path);
            importer.spriteBorder = border;
            importer.SaveAndReimport();
        }

        static public Sprite GetSpriteByName(string psdName, string spriteName, bool isCommon)
        {
            var path = GetImagePath(isCommon ? k_CommonFolderName : psdName, spriteName, false);
            var importer = GetImporter(path);
            if (importer.textureType != TextureImporterType.Sprite)
            {
                importer.textureType = TextureImporterType.Sprite;
                importer.SaveAndReimport();
            }

            var sprite = AssetDatabase.LoadAssetAtPath<Sprite>(path);
            return sprite;
        }

        static public Texture GetTextureByName(string psdName, string textureName, bool isCommon)
        {
            var path = GetImagePath(isCommon ? k_CommonFolderName : psdName, textureName, true);
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
