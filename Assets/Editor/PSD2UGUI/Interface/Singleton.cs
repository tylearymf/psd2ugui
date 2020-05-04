namespace PSD2UGUI.Interface
{
    class Singleton<T> where T : class, new()
    {
        static readonly T s_Instance = new T();
        static public T Instance
        {
            get
            {
                return s_Instance;
            }
        }
    }
}
