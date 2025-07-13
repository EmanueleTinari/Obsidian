```dataviewjs
let el
const repeat = setInterval(() => {
  if (el && !el?.checkVisibility()) {
    // Clear the repeat if the note is no longer open
    clearInterval(repeat)
    console.log(`Clearing interval: ${ repeat }`)
  } else {
    // Remove the current contents of the Dataview block
    // so that we can replace it with new contents
    dv.container.innerHTML = ''
    el = dv.el('div', '')
   
    // Put all your Dataview output here
    dv.header(5, 'This time will keep updating while the note is open:')
    dv.paragraph(moment().format('HH:mm:ss'))
    //console.log(`${ repeat } : ${ moment().format('HH:mm:ss') }`)
  }
}, 1000)
```