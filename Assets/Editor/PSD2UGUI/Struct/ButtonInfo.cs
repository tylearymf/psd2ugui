using PSD2UGUI.Attribute;
using SimpleJSON;
using System;
using UnityEngine.Assertions;

namespace PSD2UGUI.Struct
{
    [NodeType(ComponentType.BUTTON)]
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
