using UnityEditor;
using UnityEngine;
using Object = UnityEngine.Object;
using System.IO;
using PSD2UGUI.Manager;

namespace PSD2UGUI
{
    public class PSDConfigWindow : EditorWindow
    {
        Object m_ConfigFolder;
        string m_ConfigPath;
        string m_ErrorTips = "请拖入PSDConfig文件夹";

        [MenuItem("Window/PSDConfigWindow")]
        static public void Open()
        {
            var view = GetWindow<PSDConfigWindow>();
            view.titleContent = new GUIContent("PSDConfig");
            view.Show();
        }

        void OnGUI()
        {
            GUI.changed = false;
            m_ConfigFolder = EditorGUILayout.ObjectField("PSDConfig文件夹：", m_ConfigFolder, typeof(Object), true);
            if (GUI.changed)
            {
                if (m_ConfigFolder == null)
                {
                    m_ConfigPath = string.Empty;
                    m_ErrorTips = "请拖入PSDConfig文件夹";
                }
                else
                {
                    var path = AssetDatabase.GetAssetPath(m_ConfigFolder);
                    var diretory = new DirectoryInfo(path);
                    m_ConfigPath = string.Empty;

                    if (!diretory.Exists)
                    {
                        m_ErrorTips = "该对象不是文件夹";
                    }
                    else
                    {
                        var file = diretory.GetFiles(PSDConfigManager.k_ConfigName);
                        if (file.Length == 0)
                        {
                            m_ErrorTips = string.Format("该文件夹不包含{0}配置", PSDConfigManager.k_ConfigName);
                        }
                        else if (file.Length > 1)
                        {
                            m_ErrorTips = string.Format("该文件夹包含多个{0}配置", PSDConfigManager.k_ConfigName);
                        }
                        else
                        {
                            m_ErrorTips = string.Empty;
                            m_ConfigPath = file[0].FullName;
                        }
                    }
                }
            }

            if (!string.IsNullOrEmpty(m_ErrorTips))
            {
                EditorGUILayout.HelpBox(m_ErrorTips, MessageType.Error);
            }

            EditorGUI.BeginDisabledGroup(!string.IsNullOrEmpty(m_ErrorTips) || string.IsNullOrEmpty(m_ConfigPath));
            if (GUILayout.Button("生成"))
            {
                PSDConfigManager.Instance.ParseConfig(m_ConfigPath);
            }
            EditorGUI.EndDisabledGroup();
        }
    }
}