(()=>{
  'use strict';
  
  const SHEET_ID_NAME = `sheetId`
  const API_KEY_NAME = `apiKey`
  let sheetId = getFromLocalStorage(SHEET_ID_NAME)
  let apiKey = getFromLocalStorage(API_KEY_NAME)

  function setSheetId(id) {
    localStorage.setItem(SHEET_ID_NAME, id)
    sheetId = id
  }
  function setApiKey(key) {
    localStorage.setItem(API_KEY_NAME, id)
    apiKey = key
  }
  function getFromLocalStorage(item) {
    return localStorage.getItem(item)
  }
  
  async function fetchCellData(cell) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheet}/values/Sheet1!${cell}?key=${apiKey}`)
    
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`
      throw new Error(message)
    }

    const data = await response.json()
    
    const cellValue = data?.values?.[0]?.[0]
    return cellValue;
  }
  
  fetchCellData(`A1`).then(cellValue => console.log(cellValue))
})()
