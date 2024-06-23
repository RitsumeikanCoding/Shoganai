import readXlsxFile from 'read-excel-file'


const ReadExcelFile = (path: ArrayBuffer) => {
    readXlsxFile(path).then((rows) => {
        // `rows` is an array of rows
        // each row being an array of cells.
      })
}