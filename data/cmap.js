
// //appending SVG
var svg = d3.select("#layout-1")
 .attr("class", "map-svg")
  .append("svg")
  .attr("width", "700")
  .attr("height", "450");
  
  // //Setting width and Heights of SVG
  var cmwidth = +svg.attr("width");
  var cmheight = +svg.attr("height");
  
  // //Fitting the Map to scale
  const map_type = d3.geoMercator()
   .scale(100)
   .center([0, 20])
    .translate([cmwidth / 2, cmheight / 1.7]);
    
// //Initialising Map
const map = new Map();
displayCount();
function displayCount() {
     //color scales
      const popScale = d3.scaleThreshold()
       .domain([10000000000, 15000000000, 20000000000,40000000000,50000000000,100000000000, 250000000000, 300000000000, 350000000000])
        .range(d3.schemeBlues[7]);
         // add a tooltip div  
         var tooltip = d3.select("body")
          .append("div")
           .attr("class", "tooltip")
           .style("opacity", 0)
           .style("position", "absolute")
            .style("background-color", "lightskyblue")
             .style("padding", "5px");
             // //Loading data externally, JSON and CSV format and processing data to select needed data  
             Promise.all([d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
              d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv", function (d) { 
                  const countryCode = d.iso_code;
                   const totalCases = +d.total_vaccinations;
                    if (map.has(countryCode)) {
                         const currentTotal = map.get(countryCode);
                          map.set(countryCode, currentTotal + totalCases);
                         } else {
                            map.set(countryCode, totalCases); 
                        }
                        })
                        ,
                    ]).then(function (loadData) { let topo = loadData[0]
             // //Drawing the map       
                             svg.append("g")
                              .selectAll("path")
                               .data(topo.features)
                               .join("path")
             // //drawing each country         
                                .attr("d", d3.geoPath()
                                .projection(map_type)
                                 )
             // //set the color for each country based on the value of population           
              .attr("fill", function (d) {
                 const total_cases_per_million = map.get(d.id) || 0;
                  return popScale(total_cases_per_million);
                })
                .attr("stroke", "black")
                 .attr("stroke-width", "0")
                 .on("mouseover", function (event, d) {
                     tooltip.style("opacity", 0.9)
                      .html(d.properties.name+"</br>"+map.get(d.id)+"m")
                      .style("left", (event.pageX + 10) + "px")
                      .style("top", (event.pageY + 10) + "px");


                       d3.select(this)
                        .attr("stroke-width", 1)
                         .attr("stroke", "black");


    
                        tooltip.transition()
                          .duration(200)
                           .style("opacity", .9);
                         })
                         .on("mouseout", function (d) {
                             d3.select(this)
                             .attr("stroke-width", 0)
                              .attr("stroke", "black");
                               tooltip.transition()
                               .duration(500)
                                .style("opacity", 0);
                            }) })}

