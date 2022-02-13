const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = 286;
canvas.height = 500;

const img = new Image();
img.src = 'img/olivia.png';

let colorArray = [];

img.addEventListener('load', () => {
    ctx.drawImage(img, 0, 0);
    const pixelScan = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const scannedData = pixelScan.data;

    for (let i = 0; i < scannedData.length; i += 4) {
        colorArray.push(scannedData[i+1]);
        scannedData[i] = 0;
        scannedData[i+1] = scannedData[i+1];
        scannedData[i+2] = 0;
    }
    let tmp = [];
    while(colorArray.length)
        tmp.push(colorArray.splice(0, 286).reverse());
    colorArray = tmp;
    pixelScan.data = scannedData;
    ctx.putImageData(pixelScan, 0, 0);
    console.log(scannedData.length/4);
    console.log(colorArray);
    const data = [{
        z: colorArray,
        colorscale: [
            ['0.0', 'rgb(0,0,0)'],
            ['1.0', 'rgb(0,255,0)']
        ],
        type: 'surface'
    }];
    const layout = {
        title: 'Green color surface plot',
        autosize: false,
        width: 500,
        height: 500,
        margin: {
            l: 65,
            r: 50,
            b: 65,
            t: 90,
        }
    };
    Plotly.newPlot('surfacePlot', data, layout);
})

