using PSD2UGUI.Struct;

namespace PSD2UGUI.Attribute
{
    class NodeTypeAttribute : System.Attribute
    {
        public ComponentType ComponentType { protected set; get; }

        public NodeTypeAttribute(ComponentType componentType)
        {
            ComponentType = componentType;
        }
    }
}
