const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = 286;
canvas.height = 500;

const img = new Image();
img.src = 'img/olivia.png';

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
    },
    paper_bgcolor: '#f5f5f5'
};

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
        tmp.push(colorArray.splice(0, 286));
    colorArray = tmp;
    pixelScan.data = scannedData;
    ctx.putImageData(pixelScan, 0, 0);
    createPlot();
})

function createPlot() {
    const dataSurface = [{
        z: colorArray,
        colorscale: [
            ['0.0', 'rgb(0,0,0)'],
            ['1.0', 'rgb(0,255,0)']
        ],
        type: 'surface'
    }];

    const dataHeatmap = [{
        z: [...colorArray].reverse(),
        colorscale: [
            ['0.0', 'rgb(0,0,0)'],
            ['1.0', 'rgb(0,255,0)']
        ],
        type: 'heatmap'
    }];

    Plotly.newPlot('heatmapPlot', dataHeatmap, {...layout, title: 'Green color plot', height: 700});
    Plotly.newPlot('surfacePlot', dataSurface, layout);
}
