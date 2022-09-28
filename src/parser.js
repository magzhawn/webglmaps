// Requiring the module
const reader = require('xlsx')

// Reading our test file
const file = reader.readFile('./data.xlsx')

let data = []

const sheets = file.SheetNames

for(let i = 0; i < sheets.length; i++)
{
   const temp = reader.utils.sheet_to_json(
        file.Sheets[file.SheetNames[i]])
  let temp_data = []
   temp.forEach((res) => {
      temp_data.push(res)
   })
   data.push(temp_data)
//    if(dat1 => dat1.Activity === "walking"){
//     console.log("Walking" + file.SheetNames[i]);
// }
}

for (let i = 0; i < data.length; i++) {
    console.log("Dev: " + (i + 1));
    for (let j = 0; j < data[i].length; j++) {
        console.log(data[i][j]['Latitude'] + " " + data[i][j]['Longitude'] + " " + data[i][j]['Altitude'])
    }
    console.log("\n");
}

x = data[0][0]['Latitude'];
console.log(x);

// Printing data
// console.log(data);