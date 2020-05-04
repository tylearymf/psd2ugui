using PSD2UGUI.Struct;
using UnityEngine;

namespace PSD2UGUI.Interface
{
    public interface IGenerateNode
    {
        /// <summary>
        /// 在生成节点并调整完成节点布局后，会触发一次该方法
        /// </summary>
        /// <param name="baseInfo"></param>
        /// <param name="node"></param>
        void UpdateNode(BaseInfo baseInfo, GameObject node);
    }
}