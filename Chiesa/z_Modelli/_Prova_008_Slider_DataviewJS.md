
```dataviewjs

const slider = dv.el("input");
    const valelt=dv.el("i","50%");
    const progress = dv.el("progress");
    slider.type="range";
    slider.style='width:80%;height:15px;background:#ff8;';
    progress.value = 0.5;
    progress.style = 'width:80%;height:50px;';
    slider.addEventListener('input', (e) =>{testSlider(e.target.value)});
    function testSlider(val) {
      valelt.innerHTML=val+"%";
      progress.value = val/100.
    }
```

