const csvFilePath='./covid.csv'
const csv=require('csvtojson')
const fs = require('fs')
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    
      
    // Data which will write in a file.
    let data = JSON.stringify(jsonObj)
      
    // Write data in 'Output.txt' .
    fs.writeFile('Output.json', data, (err) => {
          
        // In case of a error throw err.
        if (err) throw err;
    })
    
})