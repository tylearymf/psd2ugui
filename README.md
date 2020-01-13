# PSD2UGUI工具使用说明
1、运行环境：Unity2018.4.14f1、Photoshop CC 2015（需要调试的小伙伴可以装个Adobe ExtendScript Toolkit CC）
2、支持说明：<br/>
　·导出类型支持：文本、精灵、大图、按钮、面板、窗口<br/>
　·其他支持：支持九宫格、支持相同图片只会导出一张<br/>
3、操作步骤：<br/>
　1、选择js脚本<br/>
　　·第一种：PS中选择菜单：文件->脚本->浏览，选择psd2ugui.js脚本即可<br/>
　　·第二种：将psd2ugui.js脚本放置到Photoshop的脚本目录<br/>
　　　例如：D:\Program Files\Adobe\Adobe Photoshop CC 2015\Presets\Scripts<br/>
　　　然后PS中选择菜单：文件->脚本->psd2ugui即可<br/>
　2、在弹出的导出选项窗口中配置参数，然后确定就会生成一个带有Config文件和一堆图片的文件夹（PsdConfig_xxx）<br/>
　3、将该PsdConfig_xxx文件夹放置到Unity项目中，然后选择菜单：Window->PsdConfigWindow<br/>
　　　将PsdConfig_xxx拖入到PsdConfigWindow中的指定位置，点击生成即可<br/>

## 支持两种操作方式
1、（操作方式1）直接导出psd的所有图层，然后在Unity中命名并调整布局<br/>
2、（操作方式2）在psd里面命名好图层并调整好布局，然后导出已命名的图层<br/>

## PSD中的导出选项框说明
![图片](/Images/temp.png)<br/>
1、第一行为标题，也显示了当前PSD的分辨率，当前js脚本中配置的游戏分辨率<br/>
2、第二行为导出进度条<br/>
3、第三行为导出路径<br/>
　·例如当前的psd文件路径为 D:/Test/Psd/test.psd，那么配置信息会生成在这个文件夹中 D:/Test/PsdConfig/PSDConfig_test<br/>
4、导出类型<br/>
　·已正确命名的并且显示的图层【注意：从图层的根节点出发，必须要有一条命名好了的节点路径，不然无法导出节点】<br/>
　·所有显示的图层（不用命名节点）<br/>
　·所有图层(包含隐藏图层且不用命名节点)<br/>
5、锚点类型：对应RectTransform的Pivot属性<br/>
6、是否开启适配：如果当前PSD分辨率和游戏分辨率不一致则可勾选<br/>

## 操作方式1的使用说明
1、导出类型选2(所有显示的图层)、3(所有图层)即可<br/>


## 操作方式2的使用说明
1、导出类型选1(已正确命名的并且显示的图层)即可<br/>

### PSD中图层的命名规则
1、xxx@nodeName_nodeType<br/>
2、xxx@nodeName_nodeType_nodeArg1_nodeArg2_nodeArg3...<br/>
　·其中xxx为保留美术命名，方便美术查找节点，美术可随意修改<br/>
　·nodeName为Prefab中的子节点名<br/>
　·nodeType为该节点的简写类型<br/>
　·nodeArg是对应nodeType的参数数据，用于生成不同样式的Prefab

### 自定义的Unity元素类型（可修改、扩展方便）
1、文本信息（Label）<br/>
　·缩写：lab<br/>
　·支持：文本设置，颜色设置（不支持描边），字体设置，横纵排版<br/>
　·命名举例：图层1@testLabel_lab<br/>
2、精灵信息（Sprite）<br/>
　·缩写：img<br/>
　·支持：图片显示<br/>
　·命名举例：图层1@testSprite_img<br/>
3、大图信息（Texture）<br/>
　·缩写：rimg<br/>
　·支持：图片显示<br/>
　·命名举例：图层1@testTexture_rimg<br/>
4、按钮信息（Button）<br/>
　·缩写：btn<br/>
　·支持：一种是自身带有Image图片的按钮，一种是按钮图片在按钮的子对象中<br/>
　　　　·图层1@TestBtn_btn（自身是个Image）<br/>
　　　　·图层1@TestBtn_btn（自身是个组，按钮图片在分组里面）<br/>
　·命名举例：图层1@testBtn_btn<br/>
5、面板信息（Panel）<br/>
　·缩写：pnl<br/>
　·支持：暂无<br/>
6、窗口信息（Window）<br/>
　·缩写：wnd<br/>
　·支持：暂无<br/>
7、九宫格信息（Slice）<br/>
　·缩写：9s<br/>
　·支持：九宫图片显示<br/>
　·命名举例：<br/>
　　　·第一种命名:图层1@test_9s_10（left、top、right、bottom都为10）<br/>
　　　·第二种命名:图层1@test_9s_10_0_10_0（left=10、top=0、right=10、bottom=0）<br/>
n、未完待续...<br/>
