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
