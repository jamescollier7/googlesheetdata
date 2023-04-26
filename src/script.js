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
  
  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC = `https://sheets.googleapis.com/$discovery/rest?version=v4`

  /**
   * Callback after api.js is loaded.
   */
  function gapiLoaded() {
    if (sheetId && apiKey) {
      gapi.load('client', initializeGapiClient)
    } else {
      showElement(configFormEle)
    }
  }

  /**
  * Callback after the API client is loaded. Loads the discovery doc to initialize the API.
  */
  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: apiKey,
      discoveryDocs: [DISCOVERY_DOC],
    });
    showElement(resetConfigBtn)
    showElement(addRecordFormEle)
    doFirstFetch()
  }

  configFormEle.addEventListener(`submit`, (e)=>{
    e.preventDefault()
    const configForm = e.currentTarget
    setApiKey(configForm.querySelector(`#${API_KEY_NAME}`).value)
    setSheetId(configForm.querySelector(`#${SHEET_ID_NAME}`).value)
    hideElement(configFormEle)
    gapi.load('client', initializeGapiClient);
  })
  
  resetConfigBtn.addEventListener(`click`, (e)=>{
    localStorage.clear()
    showElement(configFormEle)
    hideElement(resetConfigBtn)
    hideElement(addRecordFormEle)
    window.location.reload()
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
    let response
    try {
      // Fetch first 10 files
      response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `Sheet1!${cellRef}`,
      })
    } catch (err) {
      console.error(err)
      return
    }
    
    const range = response.result
    if (!range || !range.values || range.values.length == 0) {
      console.warn('No values found.')
      return;
    }
    
    return data
  }
  
  async function writeDataToSpreadsheet(cells) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1%AD5:append?key=${apiKey}&insertDataOption=INSERT_ROWS&valueInputOption=RAW`, {
      method: "POST",
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
  
})()
