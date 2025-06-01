<%*

let qcProject = (await tp.system.suggester((item) => item.basename, app.vault.getMarkdownFiles().filter(file => file.path.startsWith("Documenti")), false, "Please select Project...")).basename

-%>
<% qcProject %>
