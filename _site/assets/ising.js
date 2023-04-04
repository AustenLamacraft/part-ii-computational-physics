async function loadSim() {
    let pyodide = await loadPyodide();
    await pyodide.loadPackage("numpy"); 
  
    // Code has to be loaded into virtual file system
    await pyodide.runPythonAsync(`
    from pyodide.http import pyfetch
    response = await pyfetch("../assets/ising.py")
    with open("ising.py", "wb") as f:
        f.write(await response.bytes())
        `)

    return pyodide.pyimport("ising")
  }

ising = function(p) {
  let isingModel // will hold the simulation

  const w = 5; // Size of each site
  let started = false
  let update = "Glauber"
  let sublattice = true

  p.setup = async function() {
      const ising = await loadSim();
      started = true
      p.noLoop()
      p.createCanvas(400, 400);
      // p.createCanvas(p.windowWidth / 1.5, p.windowHeight / 2);
    
      const L = p.floor(p.width / w);
      isingModel = ising.IsingModel(L) 

      button = p.createButton('\u23EF');
      button.parent('ising-simulation')
      button.position(0, p.height - 40, 'absolute')
      button.mousePressed(() => p.isLooping() ? p.noLoop() : p.loop());
      
      slider = p.createSlider(1, 3.5, 2.269, 0.01);
      slider.parent('ising-simulation')
      slider.style('width', '150px');
      slider.position(0, p.height, 'absolute');
      
      const updateSelector = p.createSelect()
        .style('font-size', '16px')
        .parent("ising-simulation")
        .position(0, 0, 'absolute')
        .size(100)
      
      updateSelector.option('Glauber')
      updateSelector.option('Block Gibbs')
      updateSelector.option('Wolff')
      
      const setUpdate = function() {
        update = updateSelector.value();
        console.log(update)
      }
      
      updateSelector.changed(setUpdate);
  }

  p.draw = function() {
    p.background(255);
    if (started) {  
      if (update == "Glauber") {
        isingModel.glauber_update(1 / slider.value())
      }
      else if (update === "Block Gibbs") {
        isingModel.gibbs_update(1 / slider.value(), sublattice)
        sublattice = !sublattice  
      }
      else {
        isingModel.wolff_update(1 / slider.value())  
      }
      spins = isingModel.to_js()
    
      spins.forEach((col, colIdx) => {
        col.forEach((site, rowIdx) => {
          if (site == 1) p.fill(0);
          else p.fill(255);
          p.stroke(0);
          p.rect(colIdx * w, rowIdx * w, w, w);
        })
      })
    }
  }
}

new p5(ising, "ising-simulation")