
<%*
let isAddingTasks = true;
while (isAddingTasks) {
  const task = await tp.system.prompt("Enter a task");
  if (task) {
-%>
- [ ] <% task %>
<%*
  } else {
    isAddingTasks = false;
  }
}
-%>
