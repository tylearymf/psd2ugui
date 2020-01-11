using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace PSD2UGUI.Attribute
{
    class EnumValueAttribute : System.Attribute
    {
        public EnumValueAttribute(string value)
        {
            this.Value = value;
        }

        public string Value { protected set; get; }
    }
}
