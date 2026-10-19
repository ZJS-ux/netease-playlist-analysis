# 数据与参考来源

## 历史歌单与歌曲关系

- 来源：[joyfuljune/S16k](https://huggingface.co/datasets/joyfuljune/S16k)。
- 历史歌单共 46,613 条，创建日期覆盖 2013 年至 2024 年初；创建时间不是采集时间，历史采集日未知。
- 来源声明许可：CC BY-NC-SA 4.0。本仓库相关派生展示与结果表沿用该来源与非商业、署名、相同方式共享条件。
- 样本由特定入口扩展而来，不能作为网易云全平台随机样本。旧歌曲关系是部分观察，不能当作真实曲目总数。

## 独立补充与定向采集

- 635 条独立补充样本的快照日期为 2024-05-28。来源仓库的具体地址见下方补充来源；未发现明确开放许可，因此本仓库不包含该批逐歌单原始明细，只保留分析汇总。
- 89 个历史歌单 ID 于 2026-10-16 定向刷新，完整歌曲 ID 清单数量与返回总数核验一致；这不表示这些歌单创建于该年。
- 3,020 条唯一歌单评论来自普通/热门评论截取，覆盖 82 个歌单。评论发表范围为 2014—2026 年；近 90 天窗口相对采集时点计算，不能随当前日期自动解释。
- 公开展示不包含账号 ID、头像、本地登录信息、评论原文或歌单逐条明细；相关交互只使用聚合统计。评论是公开内容线索，不作为真实满意度或人工确认标签。

## 参考案例

课程提供的《在线音乐歌单分析》，原文件署名 **qsy**。本项目参考其问题导向的分析结构，以 Python 复现并扩展，并使用本项目的实际运行结果、补充样本和验证设计。原案例作为参考资料，不随本仓库分发。

## 第三方可视化库

交互图使用 Plotly.js。本地库文件保留其原始版权与许可声明；其许可独立于分析文档和数据许可。

## 数据解释边界

不同来源不拼接为同一时点总体；历史采集日未知，不计算精确增长率。聚类不是内容质量等级，主题需要原文解释，分类不是个人概率，补全代理不是线上推荐效果。规则标签及既有 AI 初筛未经人工复核。

补充来源：[https://github.com/LindiaC/music163-mining/blob/main/MusicList_2024-05-28T02-23-05.csv](https://github.com/LindiaC/music163-mining/blob/main/MusicList_2024-05-28T02-23-05.csv), [https://github.com/LindiaC/music163-mining](https://github.com/LindiaC/music163-mining), [https://github.com/LindiaC/music163-mining/blob/48b9eee5502ec342ea53e459069a41ba401dd15e/wyyMusic/wyyMusic/spiders/MusicList.py](https://github.com/LindiaC/music163-mining/blob/48b9eee5502ec342ea53e459069a41ba401dd15e/wyyMusic/wyyMusic/spiders/MusicList.py)。
