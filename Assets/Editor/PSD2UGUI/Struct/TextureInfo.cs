using PSD2UGUI.Attribute;
using SimpleJSON;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PSD2UGUI.Struct
{
    [NodeType(ComponentType.Texture)]
    class TextureInfo : BaseInfo
    {
        public TextureInfo(JSONNode node) : base(node)
        {
        }
    }
}
