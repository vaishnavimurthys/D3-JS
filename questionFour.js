const margin = { top: 30, right: 30, bottom: 30, left: 100 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg2 = d3.select("#questionFour")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const parseDate = d3.timeParse("%Y-%m-%d");




// get the data
d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv").then(function (d) {

  console.log(d)

  const dataMap = d.reduce((data, currVal) => {

    if (data[currVal["date"]] === undefined) {
      data[currVal["date"]] = { totalVaccinations: 0, newCases: 0, date: currVal["date"] }
    }

    let totalVaccinations = String(currVal["total_vaccinations_per_hundred"]).trim().length > 0 ? Number(currVal["total_vaccinations_per_hundred"]) : 0;
    let newCases = String(currVal["new_cases"]).trim().length > 0 && currVal["new_cases"] !== "0.0"? Number(currVal["new_cases"]) : 0

    data[currVal["date"]].totalVaccinations = data[currVal["date"]].totalVaccinations + totalVaccinations;
    data[currVal["date"]].newCases = data[currVal["date"]].newCases + newCases;
    return data;

  }, {})

  console.log(dataMap)

  const data = Object.values(dataMap)

  console.log(data)


  let keys = ["totalVaccinations", "newCases"];

  // color palette
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSet2);

  //stack the data?
  var stackedData = d3.stack()
    .keys(keys)
    (data)




  const x = d3.scaleTime()
    .domain(d3.extent(data, function (d) { return parseDate(d.date) }))
    .range([0, width]);
  svg2.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));



  const y = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) { return +d.totalVaccinations; })])
    .range([height, 0]);
  svg2.append("g")
    .call(d3.axisLeft(y));


  var areaChart = svg2.append('g')
    .attr("clip-path", "url(#clip)")


  var area = d3.area()
    .x(function (d) { return x(parseDate(d.data.date)); })
    .y0(function (d) { return y(d[0]); })
    .y1(function (d) { return y(d[1]); })

  areaChart
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
    .attr("class", function (d) { return "myArea " + d.key })
    .style("fill", function (d) { return color(d.key); })
    .attr("d", area)

})