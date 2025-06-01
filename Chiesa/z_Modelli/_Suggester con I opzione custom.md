
<%*
const customOption = "-- CREATE CUSTOM OPTION --"
const items = [customOption, "item 1", "item 2"];
let selectedItem = await tp.system.suggester(item => item, items);
if (selectedItem === customOption) {
  selectedItem = await tp.system.prompt("Type custom option");
}
-%>
<% selectedItem %>