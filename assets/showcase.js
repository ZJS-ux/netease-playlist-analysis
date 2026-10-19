/* 公开展示：仅使用聚合统计，不含歌单逐条记录或评论原文。 */
(() => {
 'use strict'; const D=window.CASE_DATA,$=id=>document.getElementById(id),state={};
 const cell=(tr,v)=>{const e=document.createElement('td');e.textContent=String(v??'');tr.appendChild(e)};
 const table=(id,rows,fields,limit=40)=>{const e=$(id);e.replaceChildren();rows.slice(0,limit).forEach(r=>{const tr=document.createElement('tr');fields.forEach(f=>cell(tr,typeof f==='function'?f(r):r[f]));e.appendChild(tr)})};
 const layout=(x,y)=>({paper_bgcolor:'#fffdf9',plot_bgcolor:'#fffdf9',font:{family:'Microsoft YaHei, sans-serif',color:'#263b44'},margin:{l:85,r:35,t:30,b:75},xaxis:{title:{text:x}},yaxis:{title:{text:y}},legend:{orientation:'h',y:-.2}});
 const config={responsive:true,displaylogo:false,toImageButtonOptions:{format:'png',scale:2}},pct=v=>(100*v).toFixed(2)+'%';
 const tags=[...new Set(D.rules.flatMap(r=>[...JSON.parse(r.lhs_json),...JSON.parse(r.rhs_json)]))].sort((a,b)=>a.localeCompare(b,'zh-CN'));
 tags.forEach(t=>$('showRuleTag').add(new Option(t,t)));
 function rules(){
  const tag=$('showRuleTag').value,rows=D.rules.filter(r=>tag==='all'||[...JSON.parse(r.lhs_json),...JSON.parse(r.rhs_json)].includes(tag));
  $('showRuleCount').textContent=`当前 ${rows.length} / ${D.rules.length} 条冻结候选；未完整达标规则保留原因。`;
  Plotly.react('showRulePlot',[{type:'scatter',mode:'markers',x:rows.map(r=>100*r.discovery_support),y:rows.map(r=>100*r.discovery_confidence),text:rows.map(r=>r.rule),marker:{size:rows.map(r=>8+Math.sqrt(r.discovery_union_n)/3),color:rows.map(r=>r.discovery_lift),colorscale:'Viridis',showscale:true,colorbar:{title:{text:'提升度'}}},hovertemplate:'%{text}<br>支持度%{x:.2f}%<br>置信度%{y:.2f}%<extra></extra>'}],layout('发现支持度（%）','发现置信度（%）'),config);
  table('showRuleRows',rows,['rule',r=>pct(r.discovery_support),r=>pct(r.discovery_confidence),r=>r.discovery_lift.toFixed(2),r=>r.confirmation_all_pass?'三项完整通过':r.confirmation_failed_metrics]);state.rules={count:rows.length,tag};
 }
 $('showRuleTag').addEventListener('change',rules);$('showRuleReset').addEventListener('click',()=>{$('showRuleTag').value='all';rules()});rules();
 D.clusterSizes.forEach(g=>$('showCluster').add(new Option(g.cluster_name,String(g.cluster_id))));
 function clusters(){
  const group=$('showCluster').value,rows=D.clusterSizes.filter(r=>group==='all'||+r.cluster_id===+group);
  const traces=rows.map(g=>{const p=D.clusterProfiles.filter(r=>+r.cluster_id===+g.cluster_id);return {type:'bar',name:g.cluster_name,x:p.map(r=>r.metric),y:p.map(r=>r.median_log1p),hovertemplate:'%{x}<br>log1p中位数%{y:.2f}<extra>%{fullData.name}</extra>'}});
  Plotly.react('showClusterPlot',traces,{...layout('累计指标','log1p中位数'),barmode:'group'},config);
  const n=rows.reduce((s,r)=>s+r.n,0);$('showClusterCount').textContent=`当前 ${rows.length} 个类别，合计 ${n.toLocaleString()} 条歌单。仅展示类别画像，不提供逐条投影或明细；热度不等于质量。`;state.clusters={groups:rows.length,count:n,group};
 }
 $('showCluster').addEventListener('change',clusters);clusters();
 [...new Set(D.topicTerms.map(r=>r.topic_label))].forEach(t=>$('showTopic').add(new Option(t,t)));
 function topics(){
  const topic=$('showTopic').value,q=$('showTopicQuery').value.trim().toLowerCase();
  const words=D.topicTerms.filter(r=>r.topic_label===topic&&(!q||r.term.toLowerCase().includes(q)));
  const chart=words.filter(r=>r.rank<=10).slice().reverse();
  Plotly.react('showTopicPlot',[{type:'bar',orientation:'h',x:chart.map(r=>r.weight),y:chart.map(r=>r.term),marker:{color:'#256b83'}}],layout('主题词分布权重','代表词'),config);
  table('showTopicRows',words,['rank','term',r=>r.weight.toFixed(4)]);
  const summary=D.topicShares.find(r=>r.topic_label===topic);
  $('showTopicCount').textContent=`当前匹配 ${words.length} 个代表词；主主题样本 ${summary?.n??'未知'} 条。公开版不提供原文；主题权重不是语义解释正确概率。`;state.topics={count:words.length,topic,q};
 }
 $('showTopic').value=D.topicTerms[0].topic_label;$('showTopic').addEventListener('change',topics);$('showTopicQuery').addEventListener('input',topics);$('showTopicReset').addEventListener('click',()=>{$('showTopic').value=D.topicTerms[0].topic_label;$('showTopicQuery').value='';topics()});topics();
 function models(){
  const metric=$('showMetric').value,rows=D.models.slice().sort((a,b)=>a[metric]-b[metric]);
  Plotly.react('showModelPlot',[{type:'bar',orientation:'h',x:rows.map(r=>r[metric]),y:rows.map(r=>r.model),marker:{color:rows.map(r=>r.model===D.mainModel?'#c87843':'#256b83')}}],{...layout(metric,'模型'),margin:{l:115,r:30,t:25,b:55},xaxis:{title:{text:metric},range:[0,1]}},config);
  $('showModelCount').textContent=`主模型固定为${D.mainModel}（按验证AP选择）；测试正类率${pct(D.testPositiveRate)}。切换指标不重选模型。`;state.models={metric,count:rows.length};
 }
 $('showMetric').addEventListener('change',models);models();
 function pairs(){
  const min=+$('showPairMin').value,rows=D.pairDistribution.filter(r=>r.lower+1e-10>=min),n=rows.reduce((s,r)=>s+r.n,0);
  Plotly.react('showPairPlot',[{type:'bar',x:rows.map(r=>r.label),y:rows.map(r=>r.n),marker:{color:'#256b83'},hovertemplate:'%{x}<br>配对数%{y}<extra></extra>'}],layout('曲目Jaccard区间','配对数量'),config);
  table('showPairRows',rows,['label','n',r=>r.mean_tag==null?'缺失':r.mean_tag.toFixed(3)]);
  $('showPairCount').textContent=`当前门槛覆盖 ${n} / 3916 对；公开版仅展示区间分布，不提供配对明细、歌单名称或ID。`;state.pairs={count:n,min};
 }
 $('showPairMin').addEventListener('change',pairs);$('showPairReset').addEventListener('click',()=>{$('showPairMin').value='0';pairs()});pairs();
 D.scenes.forEach(s=>$('showScene').add(new Option(s,s)));
 const roleName=r=>r==='other'?'已知非创建者':'未知角色';
 function comments(){
  const role=$('showRole').value,scene=$('showScene').value,q=$('showCommentQuery').value.trim().toLowerCase();
  const rows=D.commentScenes.filter(r=>(role==='all'||r.role===role)&&(scene==='all'||r.scene===scene)&&(!q||r.scene.toLowerCase().includes(q)));
  const roles=D.commentRoles.filter(r=>r.author_role!=='creator'&&(role==='all'||r.author_role===role));
  const n=roles.reduce((s,r)=>s+r.comment_n,0);
  const traces=roles.map(g=>{const p=rows.filter(r=>r.role===g.author_role);return {type:'bar',name:roleName(g.author_role),x:p.map(r=>r.scene),y:p.map(r=>100*r.share),hovertemplate:'%{x}<br>词语命中占比%{y:.2f}%<extra>%{fullData.name}</extra>'}});
  Plotly.react('showCommentPlot',traces,{...layout('场景线索（可多选）','该角色评论中的命中占比（%）'),barmode:'group'},config);
  table('showCommentRows',rows,[r=>roleName(r.role),'scene','n','denominator',r=>pct(r.share)]);
  $('showCommentCount').textContent=`角色范围内共有 ${n} 条评论观察，当前显示 ${rows.length} 项汇总。场景可重叠；命中率不等于真实使用率或满意度。公开版不含评论原文。`;state.comments={count:n,rows:rows.length,role,scene,q};
 }
 $('showRole').addEventListener('change',comments);$('showScene').addEventListener('change',comments);$('showCommentQuery').addEventListener('input',comments);$('showCommentReset').addEventListener('click',()=>{$('showRole').value='other';$('showScene').value='all';$('showCommentQuery').value='';comments()});comments();
 window.CASE_STATE=state;
})();
