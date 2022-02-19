// Pick elements
const canvas = document.querySelector('#canvas');
const btns = document.querySelectorAll('input[name="color"]');
// const btnsContainer = document.querySelector('.toggle');

// Get context for API
const ctx = canvas.getContext('2d');

btns.forEach((elem) => {
    elem.addEventListener("change", function(event) {
        drawImg(event.target.value)
    });
});

// Set canvas resolution
canvas.width = 286;
canvas.height = 500;

// Creating img object and then we can access to the src and set it to our image
const img = new Image();
img.src = 'img/olivia.png';

// Layout for plot
const layout = {
    autosize: false,
    width: 500,
    height: 500,
    margin: {
        l: 65,
        r: 50,
        b: 65,
        t: 90,
    },
    paper_bgcolor: '#f5f5f5'
};

// Array to store pixels (2d array) in color 0-255
let colorArray = [];

// When our image was loaded
img.addEventListener('load', () => {
    drawImg('green');
});

function drawImg(color) {
    // btnsContainer.classList.add('disabled');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image on canvas
    ctx.drawImage(img, 0, 0);
    // Get array data from starting coords and end coords
    const pixelScan = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const scannedData = pixelScan.data;

    colorArray = [];
    // Loop through array and taking only one color
    for (let i = 0; i < scannedData.length; i += 4) {
        if (color === 'red') {
            colorArray.push(scannedData[i]);
            scannedData[i] = scannedData[i];
            scannedData[i+1] = 0;
            scannedData[i+2] = 0;
        }
        if (color === 'green') {
            colorArray.push(scannedData[i+1]);
            scannedData[i] = 0;
            scannedData[i+1] = scannedData[i+1];
            scannedData[i+2] = 0;
        }
        if (color === 'blue') {
            colorArray.push(scannedData[i+2]);
            scannedData[i] = 0;
            scannedData[i+1] = 0;
            scannedData[i+2] = scannedData[i+2];
        }

    }

    // Convert array to necessary format for plot
    let tmp = [];
    while(colorArray.length)
        tmp.push(colorArray.splice(0, 286));
    colorArray = tmp;
    pixelScan.data = scannedData;

    // Put new image data
    ctx.putImageData(pixelScan, 0, 0);

    createPlot(color);
    // btnsContainer.classList.remove('disabled');
}

function createPlot(color) {
    const colorscale = [
        ['0.0', 'rgb(0,0,0)']
    ];

    if (color === 'red') {
        colorscale.push(['1.0', 'rgb(255,0,0)'])
    }
    if (color === 'green') {
        colorscale.push(['1.0', 'rgb(0,255,0)']);
    }
    if (color === 'blue') {
        colorscale.push(['1.0', 'rgb(0,0,255,)']);
    }

    const dataSurface = [{
        z: colorArray,
        colorscale,
        type: 'surface'
    }];

    const dataHeatmap = [{
        z: [...colorArray].reverse(),
        colorscale,
        type: 'heatmap'
    }];

    Plotly.newPlot('heatmapPlot', dataHeatmap, {...layout, title: `${capitalize(color)} color plot`, height: 700});
    Plotly.newPlot('surfacePlot', dataSurface, {...layout, title: `${capitalize(color)} color surface plot`});
}

function capitalize([letter, ...word]) {
    return letter.toUpperCase() + word.join('');
}
