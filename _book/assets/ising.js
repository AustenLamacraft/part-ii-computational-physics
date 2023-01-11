async function loadSim() {
    let pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy"); 
  
    // Code has to be loaded into virtual file system
    await pyodide.runPythonAsync(`
    from pyodide.http import pyfetch
    response = await pyfetch("assets/ising.py")
    with open("ising.py", "wb") as f:
        f.write(await response.bytes())
        `)

    return pyodide.pyimport("ising")
  }

let ising_model // will hold the simulation

const w = 5; // Size of each site
let started = false

async function setup() {
    const ising = await loadSim();
    started = true
    noLoop()
    const canvas = createCanvas(400, 400);
    canvas.parent('ising-simulation');

    const L = floor(width/w);
    ising_model = ising.IsingModel(L) 

    button = createButton('\u23F8');
    button.parent('ising-simulation')
    button.position(-width, -12, 'relative')
    button.mousePressed(() => isLooping() ? noLoop() : loop());
    
    slider = createSlider(1, 3.5, 2.269, 0.01);
    slider.parent('ising-simulation')
    slider.style('width', '150px');
    slider.position(0, 20, 'relative').center('horizontal');
}

function draw() {
  background(255);
  if (started) {  
    ising_model.glauber_update(1 / slider.value())
    config = ising_model.to_js()
  
    config.forEach((col, colIdx) => {
      col.forEach((site, rowIdx) => {
        if (site) fill(0);
        else fill(255);
        stroke(0);
        rect(colIdx * w, rowIdx * w, w, w);
      })
    })
  }
}

