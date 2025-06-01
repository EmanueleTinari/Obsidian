<%*  
// create new filename
let newsletter_index = await tp.system.prompt('Current index:');
note_name = 'Newsletter' + newsletter_index + '.1';
//rename note
await tp.file.rename(note_name)
// 5000 = 5 secondi
const notice = new Notice("", 5000);
notice.noticeEl.append(
  createEl("strong", { text: "Success" }),
  " script created 3 files",
);
-%>