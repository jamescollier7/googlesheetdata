(()=>{
  'use strict';
  
  const API_KEY_NAME = `apikey`
  const SHEET_ID_NAME = `sheetid`
 
  let apiKey = getFromLocalStorage(API_KEY_NAME)
  let sheetId = getFromLocalStorage(SHEET_ID_NAME)
  
  const configFormEle = document.getElementById(`config-form`)
  const resetConfigBtn = document.getElementById(`reset-config`)

  configFormEle.addEventListener(`submit`, (e)=>{
    e.preventDefault()
    const configForm = e.currentTarget
    setApiKey(configForm.querySelector(`#${API_KEY_NAME}`).value)
    setSheetId(configForm.querySelector(`#${SHEET_ID_NAME}`).value)
    hideElement(configFormEle)
    showElement(resetConfigBtn)
    doFirstFetch()
  })
  
  resetConfigBtn.addEventListener(`click`, (e)=>{
    localStorage.clear()
    showElement(configFormEle)
    hideElement(resetConfigBtn)
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
  
  async function fetchCellData(cell) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheet}/values/Sheet1!${cell}?key=${apiKey}`)
    
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`
      throw new Error(message)
    }

    const data = await response.json()
    
    const cellValue = data?.values?.[0]?.[0]
    return cellValue
  }
  
  function doFirstFetch() {
    fetchCellData(`A1`).then(cellValue => console.log(cellValue))
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
  } else {
    showElement(configFormEle)
  }
})()
