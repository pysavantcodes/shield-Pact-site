const fs = require("fs");

 module.exports = (key, value)=>fs.writeFile("output.js",`\n\nexport const ${key}=${value};`,{flag:'a'},(err)=>{
    if(err)
      return console.log("failed to write");
    console.log("Output.js Updated");
  });