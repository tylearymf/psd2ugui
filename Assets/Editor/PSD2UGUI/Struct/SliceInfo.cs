using PSD2UGUI.Attribute;
using SimpleJSON;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PSD2UGUI.Struct
{
    [NodeType(ComponentType.Slice)]
    class SliceInfo : SpriteInfo
    {
        public SliceInfo(JSONNode node) : base(node)
        {
        }
    }
}
