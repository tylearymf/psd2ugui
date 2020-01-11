using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PSD2UGUI.Attribute;
using PSD2UGUI.Extension;
using PSD2UGUI.Interface;
using PSD2UGUI.Struct;

namespace PSD2UGUI.Manager
{
    class NodeManager : Singleton<NodeManager>
    {
        public class NodeInfo
        {
            public IGenerateNode generate;
            public Type infoType;
        }

        Dictionary<ComponentType, NodeInfo> s_NodeInfoDic;

        public NodeManager()
        {
            s_NodeInfoDic = new Dictionary<ComponentType, NodeInfo>();
            var types = typeof(NodeManager).Assembly.GetTypes();
            foreach (var type in types)
            {
                var attr = type.GetCustomAttributes(typeof(NodeTypeAttribute), false);
                if (attr.Length == 0) continue;
                var nodeType = attr[0] as NodeTypeAttribute;

                NodeInfo info = null;
                if (!s_NodeInfoDic.TryGetValue(nodeType.ComponentType, out info))
                {
                    info = new NodeInfo();
                    s_NodeInfoDic.Add(nodeType.ComponentType, info);
                }

                if (type.GetInterface(typeof(IGenerateNode).Name) != null)
                {
                    info.generate = Activator.CreateInstance(type) as IGenerateNode;
                }
                else if (type.IsSubclassOf(typeof(BaseInfo)))
                {
                    info.infoType = type;
                }
            }
        }

        public NodeInfo GetNodeInfo(ComponentType componentType)
        {
            NodeInfo info = null;
            if (!s_NodeInfoDic.TryGetValue(componentType, out info))
                return null;
            return info;
        }

        public BaseInfo GetInstantiaInfo(ComponentType componentType, params object[] args)
        {
            NodeInfo info = GetNodeInfo(componentType);
            var baseInfo = Activator.CreateInstance(info.infoType, args) as BaseInfo;
            return baseInfo;
        }

        public IGenerateNode GetGenerateNode(ComponentType componentType)
        {
            NodeInfo info = GetNodeInfo(componentType);
            return info.generate;
        }
    }
}
