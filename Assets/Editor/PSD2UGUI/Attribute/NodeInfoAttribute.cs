using PSD2UGUI.Struct;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
