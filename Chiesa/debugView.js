module.exports = (dv, input) => {
    dv.paragraph("🔎 debug attivato");
    const jsFiles = app.vault.getAllLoadedFiles()
        .filter(f => f.path.endsWith(".js"))
        .map(f => f.path);
    dv.list(jsFiles);
};