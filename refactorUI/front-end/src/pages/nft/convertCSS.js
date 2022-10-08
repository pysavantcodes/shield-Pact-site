
//Victors functon for converting css string to Object
const makeName = (x)=>x?.split('-').map((x,i)=>i==0?x:x[0].toUpperCase()+x.slice(1,Infinity)).join('');
const CSS = (str)=>str.replace(/;$/,'').split(';').map(sty=>sty.split(':')).map(x=>x.map(y=>y?.trim()),{}).reduce((x,p)=>({...x,...{[makeName(p[0])]:p[1]}}),{});

export default CSS;