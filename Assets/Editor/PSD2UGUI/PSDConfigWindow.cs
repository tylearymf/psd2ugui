using UnityEditor;
using UnityEngine;
using Object = UnityEngine.Object;
using System.IO;
using PSD2UGUI.Manager;

namespace PSD2UGUI
{
    public class PSDConfigWindow : EditorWindow
    {
        const string k_ErrorTips = "请拖入PSD生成的Config文件";

        TextAsset m_ConfigAsset;
        string m_ErrorTips;

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
            m_ConfigAsset = (TextAsset)EditorGUILayout.ObjectField("PSD Config文件：", m_ConfigAsset, typeof(TextAsset), true);
            if (GUI.changed)
            {
                if (m_ConfigAsset == null)
                {
                    m_ErrorTips = k_ErrorTips;
                }
                else
                {
                    m_ErrorTips = string.Empty;
                }
            }

            if (!string.IsNullOrEmpty(m_ErrorTips))
            {
                EditorGUILayout.HelpBox(m_ErrorTips, MessageType.Error);
            }

            EditorGUI.BeginDisabledGroup(!string.IsNullOrEmpty(m_ErrorTips));
            if (GUILayout.Button("生成"))
            {
                PSDConfigManager.Instance.ParseConfig(m_ConfigAsset.text);
            }
            EditorGUI.EndDisabledGroup();
        }
    }
}