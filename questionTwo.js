// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 20, left: 50 },
    width = 460 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

// append the svg object to the body of the page
const q2Svg = d3.select("#questionTwo")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.csv").then(function (allData) {


    const countriesUnderObservation = ["BGR", "PER", "BIH", "IND", "USA"];

    // List of subgroups = header of the csv files = soil condition here
    const subgroups = ["iso_code", "total_cases_per_million", "total_deaths_per_million"]

    const data = allData.filter(ele => countriesUnderObservation.includes(ele["iso_code"])).map(ele => ({ ...ele,
         total_cases_per_million: ele["total_cases_per_million"].length > 0 ? Number(ele["total_cases_per_million"]) : 0,
         total_deaths_per_million: ele["total_deaths_per_million"].length > 0 ? Number(ele["total_deaths_per_million"]) : 0  }))

    const globalTotalCases = allData.reduce((acc, currValue) => {
        acc += Number(currValue["total_cases_per_million"])
        return acc;
    }, 0)

    const globalTotalCaseAvg = globalTotalCases / allData.length

    const globalTotalDeath =  allData.reduce((acc, currValue) => {
        acc += Number(currValue["total_deaths_per_million"])
        return acc;
    }, 0)

    const globalTotalDeathAvg = globalTotalDeath / allData.length

    console.log(data)

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const groups = data.map(d => d["iso_code"])

    console.log(groups)

    // Add X axis
    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
    q2Svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0));


    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.total_cases_per_million; })])
        .range([height, 0]);
    q2Svg.append("g")
        .call(d3.axisLeft(y));

    // Another scale for subgroup position?
    const xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, x.bandwidth()])
        .padding([0.05])

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c', '#377eb8'])

    // Show the bars
    q2Svg.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function (d) { return "translate(" + x(d.iso_code) + ",0)"; })
        .selectAll("rect")
        .data(function (d) { return subgroups.map(function (key) { console.log(key, d[key]); return { key: key, value: d[key] }; }); })
        .enter().append("rect")
        .attr("x", function (d) { return xSubgroup(d.key); })
        .attr("y", function (d) { return y(d.value); })
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function (d) { return height - y(d.value); })
        .attr("fill", function (d) { return color(d.key); });

        console.log(globalTotalCaseAvg);


        q2Svg.append("line").style("stroke", "#377eb8")
        .style("stroke-width", 1)
        .attr("x1", x(0))
        .attr("x2", y(width))
        .attr("y1", y(globalTotalCaseAvg))
        .attr("y2", y(globalTotalCaseAvg));


        q2Svg.append("line").style("stroke", '#e41a1c')
        .style("stroke-width", 1)
        .attr("x1", x(0))
        .attr("x2", y(width))
        .attr("y1", y(globalTotalDeathAvg))
        .attr("y2", y(globalTotalDeathAvg));


})






