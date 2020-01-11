using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using System;

namespace PSD2UGUI.Extension
{
    public class EditorCoroutine
    {
        readonly EditorYieldInstruction mRoutine;

        public EditorCoroutine(EditorYieldInstruction pRoutine)
        {
            mRoutine = pRoutine;
        }

        static public EditorCoroutine StartCoroutine(EditorYieldInstruction pRoutine)
        {
            var tRoutine = new EditorCoroutine(pRoutine);
            tRoutine.Start();
            return tRoutine;
        }

        static public void StopCoroutine(EditorCoroutine pCoroutine)
        {
            if (pCoroutine != null) pCoroutine.Stop();
        }

        void Start()
        {
            EditorApplication.update -= Update;
            EditorApplication.update += Update;
        }

        void Stop()
        {
            EditorApplication.update -= Update;
        }

        void Update()
        {
            if (mRoutine != null && !mRoutine.MoveNext())
            {
                Stop();
            }
        }
    }

    public abstract class EditorYieldInstruction : IEnumerator
    {
        public abstract object Current { get; }

        public abstract bool MoveNext();

        public abstract void Reset();
    }

    public class EditorWaitForSeconds : EditorYieldInstruction
    {
        readonly long mTicks;
        readonly float mSeconds;
        readonly Action mCallBack;

        public EditorWaitForSeconds(float pSeconds, Action pCallBack)
        {
            mSeconds = pSeconds;
            mCallBack = pCallBack;
            mTicks = DateTime.Now.AddSeconds(pSeconds).Ticks;
        }

        public override object Current { get { return null; } }

        public override bool MoveNext()
        {
            if (DateTime.Now.Ticks >= mTicks)
            {
                if (mCallBack != null) mCallBack();
                return false;
            }
            return true;
        }

        public override void Reset()
        {
        }
    }
}