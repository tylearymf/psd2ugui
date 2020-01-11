using PSD2UGUI.Attribute;
using SimpleJSON;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine.Assertions;

namespace PSD2UGUI.Struct
{
    [NodeType(ComponentType.Button)]
    class ButtonInfo : BaseInfo
    {
        public enum ButtonType
        {
            Container,
            Self,
        }

        public ButtonType BtnType { protected set; get; }

        public ButtonInfo(JSONNode node) : base(node)
        {
            var btnType = Info["btnType"].Value;
            Assert.AreNotEqual(btnType, string.Empty, "btnType is empty");
            BtnType = (ButtonType)Enum.Parse(typeof(ButtonType), btnType, true);
        }
    }
}
