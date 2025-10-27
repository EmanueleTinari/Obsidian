```dataviewjs

const {GenNavbar} = customJS;
let title = dv.current().file.name;
if (moment(title).isValid() && title.length===7) {
let navbar = this.container.createEl('nav', {cls: ["navbar","card"]});
await GenNavbar.genNavbarMonthly(navbar, title); }

```
