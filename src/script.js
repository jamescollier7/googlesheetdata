(()=>{
  'use strict';
  
  const API_KEY_NAME = `apikey`
  const SHEET_ID_NAME = `sheetid`
 
  let apiKey = getFromLocalStorage(API_KEY_NAME)
  let sheetId = getFromLocalStorage(SHEET_ID_NAME)
  
  const configFormEle = document.getElementById(`config-form`)
  const resetConfigBtn = document.getElementById(`reset-config`)
  const resultsTableEle = document.getElementById(`results-table`)
  const addRecordFormEle = document.getElementById(`add-record-form`)

  configFormEle.addEventListener(`submit`, (e)=>{
    e.preventDefault()
    const configForm = e.currentTarget
    setApiKey(configForm.querySelector(`#${API_KEY_NAME}`).value)
    setSheetId(configForm.querySelector(`#${SHEET_ID_NAME}`).value)
    hideElement(configFormEle)
    showElement(resetConfigBtn)
    showElement(addRecordFormEle)
    doFirstFetch()
  })
  
  resetConfigBtn.addEventListener(`click`, (e)=>{
    localStorage.clear()
    showElement(configFormEle)
    hideElement(resetConfigBtn)
    hideElement(addRecordFormEle)
  })
  
  addRecordFormEle.addEventListener(`submit`, (e)=>{
    e.preventDefault()
    const addRowForm = e.currentTarget
    const addRowInput = addRowForm.querySelector(`#addrecord`)
    const cells = addRowInput?.value?.split(`|`)
    writeDataToSpreadsheet(cells)
  })

  function setSheetId(id) {
    localStorage.setItem(SHEET_ID_NAME, id)
    sheetId = id
  }
  function setApiKey(key) {
    localStorage.setItem(API_KEY_NAME, key)
    apiKey = key
  }
  function getFromLocalStorage(item) {
    return localStorage.getItem(item)
  }
  
  async function fetchDataFromTheSpreadsheet(cellRef) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!${cellRef}?key=${apiKey}`)
    
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`
      throw new Error(message)
    }

    const data = await response.json()
    
    return data
  }
  
  async function writeDataToSpreadsheet(cells) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!${cellRef}:append?key=${apiKey}&insertDataOption=INSERT_ROWS&valueInputOption=RAW`, {
      method: "PUT",
      headers:{
        'content-type':'application/json'
      },
      body: {
        "range": "A1:C1",
        "values": [
          [
            "32",
            "33",
            "34"
          ]
        ]
      }
    })
    
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`
      throw new Error(message)
    }
    
    return response
  }
  
  function doFirstFetch() {
    fetchDataFromTheSpreadsheet(`A1:D5`).then(data => writeOutTable(data))
  }
  
  function writeOutTable(data) {
    resultsTableEle.innerHTML = ``
    
    data?.values?.forEach((row)=>{
      let rowdata = `<tr class="border border-gray">`
      row.forEach((cell)=>{
        rowdata += `<td class="border border-gray text-center">${cell}</td>`
      })
      rowdata += `</tr>`
      resultsTableEle.innerHTML += rowdata
    })
  }
  
  function showElement(ele) {
    ele.classList.remove(`hidden`)
  }
  function hideElement(ele) {
    ele.classList.add(`hidden`)
  }
  
  if (sheetId && apiKey) {
    doFirstFetch()
    showElement(resetConfigBtn)
    showElement(addRecordFormEle)
  } else {
    showElement(configFormEle)
  }
})()
