let years=[];
let countries=[]
let indicators=[]
let sv=[]
let pop=[]
let pib=[]


function getJsonData(file)
{
    const request = new XMLHttpRequest();
    
    request.open("GET", file, false);
    request.send();
    let data = JSON.parse(request.responseText);

    console.log('data: ', data);

    for(let i=0;i<data.length;i++)
    {
        indicators.push(data[i].indicator)
        years.push(data[i].an)
        countries.push(data[i].tara)

    }
  

    indicators = indicators.filter(function(elem, i, array)
    {
        return array.indexOf(elem)==i
    });

    years = years.filter(function(elem, i, array)
    {
        return array.indexOf(elem)==i
    });
    countries = countries.filter(function(elem, i, array)
    {
        return array.indexOf(elem)==i
    });

    //console.log(indicators);
    return data;
}


let data = getJsonData('./media/date.json');

let select = document.getElementById("indicators");
for(let i=0;i<indicators.length;i++)
{
    let option = document.createElement("option");
    option.text = indicators[i];
    select.add(option);
}

select = document.getElementById("countries");
for(let i=0;i<countries.length;i++)
{
    let option = document.createElement("option");
    option.text = countries[i];
    select.add(option);

}

select = document.getElementById("years");
for(let i=0;i<years.length;i++)
{
    let option = document.createElement("option");
    option.text = years[i];
    select.add(option);
}


function getSelectedData()
{
    let indicator = document.getElementById('indicators').value;
    let country = document.getElementById('countries').value;
    return data.filter((elem) => elem.tara === country && elem.indicator === indicator);
}

function blankScreen()
{
    document.getElementById("tHead").style.visibility="hidden"
    document.querySelector('table').visibility="hidden"
    document.getElementById("canvas").style.visibility="hidden"
}


class BarChart {
    
        constructor(element, svgns = "http://www.w3.org/2000/svg") {
          this.element = element;
          this.svgns = svgns;
          this.width = element.clientWidth;
          this.height = element.clientHeight;

      }
      
    createSvg() {
        this.svg = document.createElementNS(this.svgns, "svg");
        this.svg.style.border="5px pink "
        this.svg.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`);
        this.svg.setAttribute("id", "svgChart");
        this.element.appendChild(this.svg);
    }

    drawBackground() {
         
            const rect = document.createElementNS(this.svgns, "rect");
            rect.setAttributeNS(null, "x", 0);
            rect.setAttributeNS(null, "y", 0);
            rect.setAttributeNS(null, "width", this.width);
            rect.setAttributeNS(null, "height", this.height);
            rect.style.setProperty("fill", "white");
            this.svg.appendChild(rect);
    }

    drawTitle(country) {
        const title = document.createElementNS(this.svgns, "text");
        title.appendChild(document.createTextNode( `Evolution of ${this.data[0].indicator} in ${country}`));
        title.style.setProperty("font-size",'25px');
        title.setAttribute("x", this.element.clientWidth / 2 - 100);
        title.setAttribute("y", 0.1 * this.element.clientHeight);
        this.svg.appendChild(title);
    }

  
    drawBars() {

        const barWidth = this.width / this.data.length;
        const maxValue = Math.max(...this.data.map(e => e.valoare));
        const scaleFactor = this.height / maxValue;
        let maxBarHeight;

        for (let i = 0; i < this.data.length; i++)
         {
            
            let value=this.data[i].valoare;
            const barHeight = value * scaleFactor * 0.7;
            const barX = i * barWidth;
            const barY = this.height - barHeight;

            const bar = document.createElementNS(this.svgns, "rect");
            bar.setAttribute("x", barX + barWidth / 4.4);
            bar.setAttribute("y", barY + 30); 
            bar.setAttribute("width", barWidth / 2);
            bar.setAttribute("height", barHeight);
         
            if (value === maxValue) {
               
                maxBarHeight = barHeight;

                bar.style.fill = "#673147";

            } else bar.style.fill = "#A95C68";

            bar.style.stroke = "white";
            const strokeWidth = 1.4;
            bar.style.strokeWidth = strokeWidth + "px";

            let indicator = this.data[i].indicator;
            let year = this.data[i].an;

            let mypopup = document.getElementById("popUpChart");
            let textPopUp = document.getElementById("popUpText");

            bar.addEventListener("mouseover", () => {
                bar.getBoundingClientRect();
                textPopUp.innerHTML ="Value: " + value + " Indicator: " + indicator + " Year: "+ year;
                mypopup.style.left = 55 + "px";
                mypopup.style.bottom = 700+ "px";
                mypopup.style.top = 100 + 'px';
                mypopup.style.display="inline-block"
                bar.style.fill = "#673147"
              
             
            });
            this.svg.appendChild(bar);

            bar.addEventListener("mouseout", () =>{ 
                mypopup.style.setProperty("display","none")
                bar.style.fill = "#A95C68";
                
            });
            let text = document.createElementNS(this.svgns, 'text');
            text.appendChild(document.createTextNode(this.data[i].an));
            text.setAttribute('x', barX + 10);
            text.setAttribute('y', barY );
            this.svg.appendChild(text);
        }
        this.drawTitle(this.data[0].tara);

    }
    
    draw(data) {
        this.data = data;
        this.createSvg();
        this.drawBackground();
        this.drawBars();
    }
}

function drawChart() {

    blankScreen();
    let chart = document.getElementById("barChart");
    chart.style.setProperty('display', 'initial');
    let table = document.getElementById('colorTable');
    table.style.setProperty('display', 'none');
    let canvas = document.getElementById('canvas');
    canvas.style.setProperty('display', 'none');
    chart.style.setProperty("height","400px");
    chart.style.setProperty('width', '100%');
    let barChart = new BarChart(chart);
    barChart.draw(getSelectedData());
}


function sum(accumulator, currentValue)
{
    return accumulator + currentValue;
}

function dataPerYear(year)
{
    return data.filter(obj => obj.an === year).map(obj => obj.valoare);
}


function colorCalc(value, min, max, average) {
    if (!value) 
        return ["hsl(0,100%,0%)"].join(""); 
 
    let minuend;
    if (value >= average)
    {
        minuend = max;
    }
    else
    {
        minuend = min;
    }
    let v = (Math.abs(value - minuend))
    let v1=v/(Math.abs(average - minuend));
    let hue = (v1 * 60 + 20).toString(); 
    return [`hsl(${hue},100%,50%)`];
}
function createTable()

{
    blankScreen()
    let canvas = document.getElementById('canvas');
    let myTable = document.getElementById('colorTable');
    myTable.style.setProperty('display', 'initial');
    canvas.style.setProperty('display', 'none');
    let barChart = document.getElementById('barChart');
    barChart.style.setProperty('display', 'none');
    document.getElementById("tHead").style.visibility = "visible";
    document.querySelector('table').style.visibility = "visible";
    let yearOption=document.getElementById("years");
    var year = yearOption.options[yearOption.selectedIndex].text;
    let selectedObjs=dataPerYear(year);
    let msv=selectedObjs.slice(0,27).reduce(sum,0)/countries.length;
    let mpop=selectedObjs.slice(27, 54).reduce(sum, 0)/countries.length;
    let mpib=selectedObjs.slice(54, 81).reduce(sum, 0)/countries.length;
  

    const table = document.getElementById("tBody");
    for(let i=0;i<=27;i++)
    {    
        table.insertAdjacentHTML('beforebegin', 
        `<tr>
            <td>${countries[i]}</td>
            <td id=${i}>${selectedObjs[i]}</td>
            <td id=${i + 27}>${selectedObjs[i + 27]}</td>
            <td id=${i + 54}>${selectedObjs[i + 54]}</td>
        </tr>`);
    }
    table.insertAdjacentHTML('beforebegin', `<tr>
    <td> Media UE </td>
        <td>${Math.round(msv)}</td>
        <td>${Math.round(mpop)}</td>
        <td>${Math.round(mpib)}</td>
    </tr>`);

    let max1 = Math.max(...selectedObjs.slice(0, 27)); //sv
    let min1 = Math.min(...selectedObjs.slice(0, 27)); 
    let max2 = Math.max(...selectedObjs.slice(27, 54)); //pop
    let min2 = Math.min(...selectedObjs.slice(27, 54));
    let max3 = Math.max(...selectedObjs.slice(54, 81)); //pib
    let min3 = Math.min(...selectedObjs.slice(54, 81));

    for (let i = 0; i < 81; i++) {
        let cell = document.getElementById(`${i}`);
        if (i < 27) cell.style.backgroundColor = colorCalc(parseInt(cell.innerText), min1, max1, msv);
        else if (i >= 27 && i < 54) cell.style.backgroundColor = colorCalc(parseInt(cell.innerText), min2, max2, mpop);
        else if (i >= 54 && i < 81) cell.style.backgroundColor = colorCalc(parseInt(cell.innerText), min3, max3, mpib);
    }
}    



function BubbleChart(selectedYearData) {
        
        blankScreen()
        const canvas = document.getElementById("canvas");
        const myTable = document.getElementById('colorTable');
        myTable.style.setProperty('display', 'none');
        canvas.style.display = "inline-block";
        canvas.style.height = "500px";
        canvas.style.width="1000px";
        canvas.style.visibility = "visible";
        canvas.style.border = "10px solid black";
      
        const context = canvas.getContext("2d");
        context.fillStyle = "#FFF0F5";
        context.fillRect(0, 0, canvas.width, canvas.height);
       
        let objs = dataPerYear(selectedYearData);
        let psv = objs.slice(0, 27);
        let ppop = objs.slice(27, 54); 
        let ppib = objs.slice(54, 81);
      
      function findMinMax(array) {
        return {
          min: Math.min(...array),
          max: Math.max(...array)
        };
      }
      const minMaxPIB = findMinMax(ppib);
      const minMaxSV = findMinMax(psv);
      const minMaxPOP = findMinMax(ppop);
      
      const maxPIB = minMaxPIB.max;
      const minPIB = minMaxPIB.min;
      const minSV = minMaxSV.min;
      const maxSV = minMaxSV.max;
      const minPOP = minMaxPOP.min;
      const maxPOP = minMaxPOP.max;
      
    function drawCircle(context, ox, oy, r, color, label) {
      context.beginPath();
      context.moveTo(ox + r, oy);
      context.arc(ox, oy, r, 0, 2 * Math.PI);
      context.fillStyle = color;
      context.strokeStyle = '#F2F0FF';
      context.fill();
      context.stroke();
      context.fillText(label, ox - 5, oy);
      context.closePath();
    }
    
    for (let i = 0; i < countries.length; i++) {
      let r = (70 - 30) * (psv[i] - minSV) / (maxSV - minSV) + 10;
      let oy = (canvas.height - 50) * (ppop[i] - minPOP) / (maxPOP - minPOP) + 30 - r - 10;
      let ox = (canvas.width - 50) * (ppib[i] - minPIB) / (maxPIB - minPIB) + 30 - r - 10;
      let color = `rgb(${256*Math.random() },${256*Math.random() },${256*Math.random()},0.7)`;
      drawCircle(context, ox, oy, r, color, countries[i]);
    }
    
    let distance = (canvas.height - 100) / 8;
    for(let i =0;i<10;i++){
        context.beginPath();
        context.font = "10px Aerial bold";
        context.fillStyle = "black";
        context.fillText(83 + i, 0, distance* i +21);
        context.closePath();
    }
     distance = (canvas.width - 100) / 8;
    for(let i =0;i<10;i++){
        context.beginPath();
        context.font = "10px Aerial bold";
        context.fillStyle = "black";
        context.fillText(5000 + (300000*i),  distance* i +15,10);
        context.closePath();
    }
    context.font = "50px Aerial bold";
    context.fillStyle = "purple";
    context.fillText(selectedYearData, 800, 50);
   
}

function BubbleAnimation() {
    let opt = document.getElementById('years');
    let year = opt.options[opt.selectedIndex].text;
    year=year-2000;
    console.log(year);
    let interval = setInterval(function() {
        if (year > years.length ) {
            clearInterval(interval)
        } 
        else
        {
            BubbleChart(years[year]);
            year++;
        }
    },500);
}
  

document.getElementById('indicators').addEventListener('change',()=>{
    let opt = document.getElementById('countries');
    let year =  opt.options[opt.selectedIndex].value;
    if(year!='Alege o tara')
        document.getElementById('btnChart');
});


document.getElementById('years').addEventListener('change',()=>{
  
    document.getElementById('btnTable');
});

document.getElementById('btnTable').addEventListener('click', ()=> createTable());
document.getElementById('btnChart').addEventListener('click', () => drawChart());
document.getElementById('btnAnimations').addEventListener('click',()=>BubbleAnimation());

document.getElementById('btnBubble').addEventListener("click",()=>{
    let opt = document.getElementById('years');
    let year = opt.options[opt.selectedIndex].text;
    BubbleChart(year)
})

