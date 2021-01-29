const ExcelJS = require('exceljs');
var fs = require('fs');
var path = require('path');
//const XLSX = require('xlsx');
var XlsxTemplate = require('xlsx-template');


exports.fillExcel = async (req, res) => {

    // Load an XLSX file into memory
    fs.readFile(path.join(__dirname, 'index_asistencia.xls'), function (err, data) {
        
        // Create a template
        var template = new XlsxTemplate(data);

        // Replacements take place on first sheet
        var sheetNumber = 1;

        // Set up some placeholder values matching the placeholders in the template
        var values = {
            extractDate: new Date(),
            dates: [new Date("2013-06-01"), new Date("2013-06-02"), new Date("2013-06-03")],
            people: [
                { name: "John Smith", age: 20 },
                { name: "Bob Johnson", age: 22 }
            ]
        };

        // Perform substitution
        template.substitute(sheetNumber, values);

        // Get binary data
        var data = template.generate();

        // ...

    });
}

// exports.aaa = async (req, res) => {

//     var workbook = XLSX.readFile(path.resolve(__dirname + '/index_asistencia.xls'));

//     var first_sheet_name = workbook.SheetNames[0];
//     var address_of_cell = 'B13';

//     var worksheet = workbook.Sheets[first_sheet_name];

//     var desired_cell = worksheet['E13'];

//     var desired_value = (desired_cell ? desired_cell.v : undefined);


//     XLSX.writeFile(workbook, path.resolve(__dirname + '/index_asistencia.xls'));


//     return res.send(desired_cell.v)
// }
//