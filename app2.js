const type = {
    pencil: "pencil",
    eraser: "eraser",
    highlighter: "highlighter",
    dx: "dx",
  };
  
  
  class DrawingTablet {\

    #canvas;
    #fabricCanvas;
    
    #CONSTANTS = {
      DATA_KEY: "paths",
    };
  
    #isDrawing = false;
    #paths = [];
    #dxPaths = [];
    #rzTimeout;
    #redo = [];
  
    #opts = {
      width: 600,
      height: 600,
      size: undefined,
      bg: "#167e60",
      color: "#000000",
      brushSize: 2,
      logs: false,
      fullSize: false,
      fullWidth: false,
      fullHeight: false,
      fullscreen: false,
      lineCap: "round",
      lineJoin: "round",
      overflow: "hidden",
      scale: 1,
      autosave: true,
    };
  
    brushType = "pencil";
  

    #isDrawing = false;
    #paths = [];
    #dxPaths = [];
    #rzTimeout;
    #redo = [];
  
    #opts = {
      width: 600,
      height: 600,
      size: undefined,
      bg: "#167e60",
      color: "#000000",
      brushSize: 2,
      logs: false,
      fullSize: false,
      fullWidth: false,
      fullHeight: false,
      fullscreen: false,
      lineCap: "round",
      lineJoin: "round",
      overflow: "hidden",
      scale: 1,
      autosave: true,
    };
  
    brushType = type.pencil;
  
    constructor(element, opts) {
        this.#opts = { ...this.#opts, ...opts };
    
        this.#initializeContainer(element);
        this.#initializeOptions();
        this.#initializeCanvas();
        this.drawFromSaved();
        
        // Fabric.js event listeners
        this.#fabricCanvas.on('mouse:down', this.#handleStart);
        this.#fabricCanvas.on('mouse:move', this.#handleMove);
        document.addEventListener('mouseup', this.#handleEnd);
    
        this.#fabricCanvas.on('touch:start', this.#handleStart);
        this.#fabricCanvas.on('touch:move', this.#handleMove);
        document.addEventListener('touchend', this.#handleEnd);
    
        document.addEventListener('keydown', this.#handleKeypress);
    
        window.addEventListener('resize', this.#handleResize);
        this.#log('Events initialized');
    }
    
  
    #handleKeypress = (e) => {
        if (e.ctrlKey && e.code === "KeyZ") {
          this.#fabricCanvas.undo(); // Fabric.js equivalent for undo
        }
        if (e.ctrlKey && e.code === "KeyY") {
          this.#fabricCanvas.redo(); // Fabric.js equivalent for redo
        }
        if (e.ctrlKey && e.code === "KeyS") {
          e.preventDefault();
          this.save(); // Assuming the save function is defined elsewhere
        }
      
        if (e.ctrlKey && e.code === "KeyE") {
          e.preventDefault();
          this.download(); // Assuming the download function is defined elsewhere
        }
      };
      
  
      #getBrush() {
        return {
          color: this.#opts.color,
          bg: this.#opts.bg,
          brushSize: this.#opts.brushSize,
          lineCap: this.#opts.lineCap,
          lineJoin: this.#opts.lineJoin,
          setBrush: (fabricCanvas) => {
            fabricCanvas.freeDrawingBrush.color = this.#opts.color;
            fabricCanvas.freeDrawingBrush.width = this.#opts.brushSize;
            fabricCanvas.freeDrawingBrush.strokeLineCap = this.#opts.lineCap;
            fabricCanvas.freeDrawingBrush.strokeLineJoin = this.#opts.lineJoin;
          }
        };
      }
      
  
      #handleStart = (e) => {
        e.preventDefault();
        if (e.button === 1 || e.button === 0 || e.touches) { // e.button instead of e.which for compatibility with Fabric.js
          this.#log("Drawing Started");
          this.#isDrawing = true;
          
          const pointer = this.#fabricCanvas.getPointer(e.e); // Get pointer coordinates using Fabric.js
          const brush = this.#getBrush();
      
          this.#paths.push([[pointer.x, pointer.y, brush]]);
      
          if (this.brushType === "dx") {
            this.#dxPaths.push([[pointer.x, pointer.y]]);
          }
      
          this.#draw();
        }
      };
      
  
      #handleMove = (e) => {
        e.preventDefault();
        const pointer = this.#fabricCanvas.getPointer(e.e);
        const coords = [pointer.x, pointer.y];
      
        if (this.#isDrawing) {
          this.#paths[this.#paths.length - 1].push(coords);
          if (this.brushType === "dx") {
            this.#dxPaths[this.#dxPaths.length - 1].push(coords);
          }
      
          this.#draw();
        }
      };
      
    
  
      #handleEnd = () => {
        if (this.#isDrawing) {
          this.#log("Drawing End");
          if (this.#opts.autosave) {
            this.save();
            this.#log("Auto Saved");
          }
        }
      
        if (this.#dxPaths.length >= 2) {
          // Get the last two paths
          const lastPath = this.#dxPaths[this.#dxPaths.length - 1];
          const secondLastPath = this.#dxPaths[this.#dxPaths.length - 2];
          
          // Calculate centroids
          const centroidLast = this.#calculateCentroid(lastPath);
          const centroidSecondLast = this.#calculateCentroid(secondLastPath);
          const dxDistance = this.#calculateDistance(centroidLast, centroidSecondLast);
          
          console.log("Centroid of the last path:", centroidLast);
          console.log("Centroid of the second last path:", centroidSecondLast);
          console.log("Distance:", dxDistance);
        }
      
        this.#isDrawing = false;
        this.#fabricCanvas.off('mouse:move'); // Remove the move event listener
        this.#fabricCanvas.off('mouse:up'); // Remove the up event listener
      };
      
  
      #handleResize = () => {
        if (this.#rzTimeout) {
          window.clearTimeout(this.#rzTimeout);
          this.#rzTimeout = null;
        }
        this.#rzTimeout = setTimeout(() => {
          const { width: elWidth, height: elHeight } = this.container.getBoundingClientRect();
          if (this.#opts.fullscreen) {
            this.#opts.width = window.innerWidth;
            this.#opts.height = window.innerHeight;
          } else if (this.#opts.fullSize) {
            this.#opts.width = elWidth;
            this.#opts.height = elHeight;
          } else if (this.#opts.fullWidth) {
            this.#opts.width = elWidth;
          } else if (this.#opts.fullHeight) {
            this.#opts.height = elHeight;
          }
          this.#initializeCanvasSize();
          this.#draw();
        }, 200);
      };
      
      #initializeContainer(element) {
        this.container = document.body;
        if (element) {
          if (typeof element === "string") {
            this.container = document.querySelector(element);
            if (!this.container) {
              throw new Error("Element not found. Please check your selector.");
            }
          } else if (element.tagName) {
            this.container = element;
          } else {
            console.error("Invalid element");
          }
        }
        this.container.style.overflow = this.#opts.overflow;
        this.#log("Container Initialized");
      }
      
      #initializeCanvasSize() {
        this.#fabricCanvas.setWidth(this.#opts.width);
        this.#fabricCanvas.setHeight(this.#opts.height);
        this.#fabricCanvas.calcOffset();
      }
      
  
      #initializeOptions() {
        if (this.#opts.size) {
          this.#opts.width = this.#opts.size;
          this.#opts.height = this.#opts.size;
        }
        if (this.#opts.fullscreen) {
          this.#opts.width = window.innerWidth;
          this.#opts.height = window.innerHeight;
        }
        const { width: elWidth, height: elHeight } = this.container.getBoundingClientRect();
        if (this.#opts.fullSize) {
          this.#opts.width = elWidth;
          this.#opts.height = elHeight;
        }
        if (this.#opts.fullWidth) {
          this.#opts.width = elWidth;
        }
        if (this.#opts.fullHeight) {
          this.#opts.height = elHeight;
        }
      }
      
      #initializeCanvas() {
        this.#fabricCanvas = new fabric.Canvas(null, {
          width: this.#opts.width,
          height: this.#opts.height,
          backgroundColor: this.#opts.bg,
        });
        this.container.appendChild(this.#fabricCanvas.getElement());
        this.#log("Canvas initialized");
      }
      
      #initializeCanvasSize() {
        this.#fabricCanvas.setWidth(this.#opts.width);
        this.#fabricCanvas.setHeight(this.#opts.height);
        this.#fabricCanvas.calcOffset();
      }
      
  
      #coordinates(e) {
        if (e.touches && e.touches.length > 0) {
          return [
            e.touches[0].clientX - this.#fabricCanvas._offset.left,
            e.touches[0].clientY - this.#fabricCanvas._offset.top,
          ];
        }
        return [
          e.clientX - this.#fabricCanvas._offset.left,
          e.clientY - this.#fabricCanvas._offset.top,
        ];
      }
      
      #draw() {
        this.clearOnlyScreen();
        this.#drawPath();
      }
      
      #drawPath() {
        for (let i = 0; i < this.#paths.length; i++) {
          const line = this.#paths[i];
          const startPath = line[0];
          const pathData = [];
      
          for (let j = 0; j < line.length; j++) {
            pathData.push({ x: line[j][0], y: line[j][1] });
          }
      
          const path = new fabric.Path(pathData.map(p => `L ${p.x} ${p.y}`).join(' ').replace(/^L/, 'M'), {
            stroke: startPath[2].color,
            strokeWidth: startPath[2].brushSize,
            fill: null,
            strokeLineCap: startPath[2].lineCap,
            strokeLineJoin: startPath[2].lineJoin,
            selectable: false,
          });
      
          this.#fabricCanvas.add(path);
        }
      }
      
  
    #log(message, opts) {
      const o = {
        icon: true,
        color: "#0cc0e4",
        disableColor: false,
        logs: this.#opts.logs,
        ...opts,
      };
  
      if (o.logs) {
        if (typeof message !== "string") {
          console.log(message);
          return;
        }
        if (o.icon) {
          message = `ⓘ ${message}`;
        }
        if (!o.disableColor) {
          message = `%c${message}`;
        }
        console.log(message, `color: ${o.color}`);
      }
    }
  
  
    #calculateCentroid(vertices) {
      let centroid = { x: 0, y: 0 };
      let signedArea = 0;
      let x0 = 0; // Current vertex X
      let y0 = 0; // Current vertex Y
      let x1 = 0; // Next vertex X
      let y1 = 0; // Next vertex Y
      let a = 0;  // Partial signed area
  
      // For all vertices except last
      for (let i = 0; i < vertices.length - 1; ++i) {
          x0 = vertices[i][0];  // Access X of current vertex
          y0 = vertices[i][1];  // Access Y of current vertex
          x1 = vertices[i + 1][0];  // Access X of next vertex
          y1 = vertices[i + 1][1];  // Access Y of next vertex
          a = x0 * y1 - x1 * y0;
          signedArea += a;
          centroid.x += (x0 + x1) * a;
          centroid.y += (y0 + y1) * a;
      }
  
      // Do last vertex separately to avoid if inside loop
      x0 = vertices[vertices.length - 1][0];  // Access X of last vertex
      y0 = vertices[vertices.length - 1][1];  // Access Y of last vertex
      x1 = vertices[0][0];  // Access X of first vertex
      y1 = vertices[0][1];  // Access Y of first vertex
      a = x0 * y1 - x1 * y0;
      signedArea += a;
      centroid.x += (x0 + x1) * a;
      centroid.y += (y0 + y1) * a;
  
      signedArea *= 0.5;
      centroid.x /= (6 * signedArea);
      centroid.y /= (6 * signedArea);
  
      return centroid;
    }
  
  
    #calculateDistance(centroid1, centroid2) {
      const xDiff = centroid2.x - centroid1.x;
      const yDiff = centroid2.y - centroid1.y;
      return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }
  
    log = (message) => {
        return this.#log(message, { color: "yellow", logs: true });
      };
      
      set bg(color) {
        this.#opts.bg = color;
        this.#fabricCanvas.setBackgroundColor(this.#opts.bg, this.#fabricCanvas.renderAll.bind(this.#fabricCanvas));
      }
      
      set brushSize(size) {
        this.#opts.brushSize = size;
        this.#fabricCanvas.freeDrawingBrush.width = size;
      }
      
      get brushSize() {
        return this.#opts.brushSize;
      }
      
      set brushColor(color) {
        if (this.brushType == type.highlighter) {
          this.#opts.color = color + "55";
        } else {
          this.#opts.color = color;
        }
        this.#fabricCanvas.freeDrawingBrush.color = this.#opts.color;
      }
      
      get brushColor() {
        return this.#opts.color;
      }
      
      get opts() {
        return { ...this.#opts };
      }
      
  
      pencil = () => {
        this.brushType = type.pencil;
        this.#opts.lineCap = "round";
        this.#opts.lineJoin = "round";
        
        this.#fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(this.#fabricCanvas);
        this.#fabricCanvas.freeDrawingBrush.color = this.#opts.color;
        this.#fabricCanvas.freeDrawingBrush.width = this.#opts.brushSize;
        this.#fabricCanvas.freeDrawingBrush.strokeLineCap = this.#opts.lineCap;
        this.#fabricCanvas.freeDrawingBrush.strokeLineJoin = this.#opts.lineJoin;
      };
      
      highlighter = (size = 60) => {
        this.brushType = type.highlighter;
        this.brushSize = size;
        this.#opts.lineCap = "butt";
        this.#opts.lineJoin = "round";
      
        this.#fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(this.#fabricCanvas);
        this.#fabricCanvas.freeDrawingBrush.color = this.#opts.color + "55";
        this.#fabricCanvas.freeDrawingBrush.width = this.brushSize;
        this.#fabricCanvas.freeDrawingBrush.strokeLineCap = this.#opts.lineCap;
        this.#fabricCanvas.freeDrawingBrush.strokeLineJoin = this.#opts.lineJoin;
      };
      
      eraser = () => {
        this.brushType = type.eraser;
        this.brushColor = this.#opts.bg;
        this.#opts.lineCap = "round";
        this.#opts.lineJoin = "round";
        this.brushSize = 50;
      
        this.#fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(this.#fabricCanvas);
        this.#fabricCanvas.freeDrawingBrush.color = this.brushColor;
        this.#fabricCanvas.freeDrawingBrush.width = this.brushSize;
        this.#fabricCanvas.freeDrawingBrush.strokeLineCap = this.#opts.lineCap;
        this.#fabricCanvas.freeDrawingBrush.strokeLineJoin = this.#opts.lineJoin;
      };
      
      dx = () => {
        this.brushType = type.dx;
        this.#opts.lineCap = "round";
        this.#opts.lineJoin = "round";
      
        this.#fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(this.#fabricCanvas);
        this.#fabricCanvas.freeDrawingBrush.color = this.#opts.color;
        this.#fabricCanvas.freeDrawingBrush.width = this.#opts.brushSize;
        this.#fabricCanvas.freeDrawingBrush.strokeLineCap = this.#opts.lineCap;
        this.#fabricCanvas.freeDrawingBrush.strokeLineJoin = this.#opts.lineJoin;
        this.#fabricCanvas.freeDrawingBrush.setLineDash([10, 5]);
      };
      
  
      redraw = () => {
        this.#draw();
        this.#log("Redraw called");
      };
      
      clearOnlyScreen = () => {
        this.#fabricCanvas.clear();
        this.#fabricCanvas.setBackgroundColor(this.#opts.bg, this.#fabricCanvas.renderAll.bind(this.#fabricCanvas));
      };
      
      clear = () => {
        this.clearOnlyScreen();
        this.#paths = [];
        this.clearSaved();
        this.#isDrawing = false;
        this.#log("Cleared");
      };
      
      undo = () => {
        if (this.#paths.length > 0) {
          this.#redo.push({
            type: "path",
            data: this.#paths[this.#paths.length - 1],
          });
          this.#paths.pop();
          this.redraw();
          this.#log("Undo Called");
        }
      };
      
      redo = () => {
        const redoObj = this.#redo[this.#redo.length - 1];
        if (redoObj && redoObj.type == "path") {
          this.#paths.push(redoObj.data);
          this.redraw();
          this.#redo.pop();
          this.#log("Redo Called");
        }
      };
      
      save = () => {
        localStorage.removeItem(this.#CONSTANTS.DATA_KEY);
        localStorage.setItem(this.#CONSTANTS.DATA_KEY, JSON.stringify(this.#paths));
        if (!this.#opts.autosave) {
          this.#log("Saved!");
        }
      };
      
  
      clearSaved = () => {
        localStorage.removeItem(this.#CONSTANTS.DATA_KEY);
        this.#log("Saved cleared");
      };
      
      drawFromSaved = () => {
        const paths = localStorage.getItem(this.#CONSTANTS.DATA_KEY);
        if (paths) {
          this.#paths = JSON.parse(paths);
          this.redraw();
        }
        this.#log("Redrawn from save");
      };
      
      download = (filename = "drawing") => {
        const dataUrl = this.#fabricCanvas.toDataURL({
          format: 'png',
          quality: 1.0,
          multiplier: 1
        });
      
        const a = document.createElement("a");
        a.download = filename;
        a.style.display = "none";
        a.href = dataUrl;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.#log("Download called");
      };
      
  
  // Initializing Drawing Tablet
  dt = new DrawingTablet("#canvas-container", {
    logs: true,
    fullscreen: true,
    brushSize: opts.brushSize,
    bg: "#181818",
    color: opts.brushColor,
    autosave: true,
  });
  
  dt.log("Drawing Tablet Initialized");
  
  dcs = document.querySelectorAll(".dt-default-colors");
  dcp = document.querySelectorAll(".dt-cp-container");
  
  dcs.forEach((e) => {
    e.children[0].style.background = e.dataset.color;
    selectColor();
    e.addEventListener("click", () => {
      dt.brushColor = e.dataset.color;
      opts.brushColor = e.dataset.color;
      selectColor();
    });
  });
  
  function selectColor() {
    dcs.forEach((el) => {
      el.style.border = `2px solid ${opts.brushColor === el.dataset.color ? el.dataset.color : "transparent"}`;
    });
  }
  
  dtPicker.addEventListener("input", (e) => {
    dt.brushColor = e.target.value;
    selectColor();
  });
  
  download.addEventListener("click", () => {
    dt.download();
  });
  
  undo.addEventListener("click", () => {
    dt.undo();
  });
  
  redo.addEventListener("click", () => {
    dt.redo();
  });
  
  clear.addEventListener("click", () => {
    const b = confirm("Are you sure to clear?");
    if (b) {
      dt.clear();
    }
  });
  
  
  size.addEventListener("input", (e) => {
    dt.brushSize = parseInt(e.target.value);
  });
  
  pencil.addEventListener("click", () => {
    dt.pencil();
    dt.brushSize = parseInt(size.value);
    dt.brushColor = opts.brushColor;
    isSelected();
  });
  
  dx.addEventListener("click", () => {
    dt.dx();
    dt.brushSize = parseInt(size.value);
    dt.brushColor = opts.brushColor;
    isSelected();
  });
  
  highlighter.addEventListener("click", () => {
    dt.highlighter();
    dt.brushColor = opts.brushColor;
    isSelected();
  });
  
  eraser.addEventListener("click", () => {
    dt.eraser();
    isSelected();
  });
  
  function isSelected() {
    if (dt.brushType === type.pencil) {
      document.querySelector("#pencil").style.bottom = "-10px";
      document.querySelector("#highlighter").style.bottom = "-25px";
      document.querySelector("#eraser").style.bottom = "-25px";
      document.querySelector("#dx").style.bottom = "-25px";
    } else if (dt.brushType === type.dx) {
      document.querySelector("#pencil").style.bottom = "-25px";
      document.querySelector("#highlighter").style.bottom = "-25px";
      document.querySelector("#eraser").style.bottom = "-25px";
      document.querySelector("#dx").style.bottom = "-10px";
    } else if (dt.brushType === type.eraser) {
      document.querySelector("#pencil").style.bottom = "-25px";
      document.querySelector("#highlighter").style.bottom = "-25px";
      document.querySelector("#eraser").style.bottom = "-10px";
      document.querySelector("#dx").style.bottom = "-25px";
    } else if (dt.brushType === type.highlighter) {
      document.querySelector("#highlighter").style.bottom = "-10px";
      document.querySelector("#pencil").style.bottom = "-25px";
      document.querySelector("#eraser").style.bottom = "-25px";
      document.querySelector("#dx").style.bottom = "-25px";
    }
  }
  isSelected();