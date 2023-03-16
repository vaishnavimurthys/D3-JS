// set the dimensions and margins of the graph
const margin3 = { top: 40, right: 100, bottom: 100, left: 100 },
    width3 = 800 - margin3.left - margin3.right,
    height3 = 700 - margin3.top - margin3.bottom;




// append the svg object to the body of the page


const svg2 = d3.select("#my_dataviz3")
    .append("svg")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.top + margin3.bottom)
    .append("g")
    .attr("transform", `translate(${margin3.left},${margin3.top})`);


d3.csv("https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv")
    .then(function (data) {

        const dataForIndia = data.filter((ele, index) => ele["iso_code"] === "IND" || ele["iso_code"] === "USA" || ele["iso_code"] === "ZAF");

        const dataForIndiaWithGdpAndTotalCases = dataForIndia.map(ele => { return { country: ele["iso_code"], date: ele["date"], totalCases: String(ele["total_cases"]).trim().length > 0 ? Number(ele["total_cases"]) : 0 } })

        const sumstat2 = d3.group(dataForIndiaWithGdpAndTotalCases, d => d.country);



        console.log({ sumstat2 })




        // color palette
        const color = d3.scaleOrdinal()
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])


       




        const parseDate = d3.timeParse("%Y-%m-%d");

        const x = d3.scaleTime()
            .domain(d3.extent(dataForIndiaWithGdpAndTotalCases, function (d) { return parseDate(d.date) }))
            .range([0, width3]);
        svg2.append("g")
            .attr("transform", `translate(0, ${height3})`)
            .call(d3.axisBottom(x).ticks(5));


        //   // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(dataForIndiaWithGdpAndTotalCases, function (d) { return +d.totalCases; })])
            .range([height3, 0]);
        svg2.append("g")
            .call(d3.axisLeft(y));




        // Draw the line
        svg2.selectAll(".line2")
            .data(sumstat2)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", function (d) { console.log(color(d[0]), d); return color(d[0]) })
            .attr("stroke-width", 1.5)
            .attr("d", function (d) {
                return d3.line()
                    .x(function (d) { return x(parseDate(d.date)) })
                    .y(function (d) { return y(+d.totalCases); })
                    (d[1])
            })




        console.log("data", dataForIndia)

    })