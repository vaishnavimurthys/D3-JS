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
        const key = `${new Date(currVal["date"]).getMonth()}/${new Date(currVal["date"]).getFullYear()}`

        if (data[key] === undefined) {
            data[key] = { totalVaccinations: 0, newCases: 0, date: key }
        }

        let totalVaccinations = String(currVal["total_vaccinations_per_hundred"]).trim().length > 0 ? Number(currVal["total_vaccinations_per_hundred"]) : 0;
        let newCases = String(currVal["new_cases"]).trim().length > 0 && currVal["new_cases"] !== "0.0" ? Number(currVal["new_cases"]) : 0

        data[key].totalVaccinations = data[key].totalVaccinations + totalVaccinations;
        data[key].newCases = data[key].newCases + newCases;
        return data;

    }, {})

    console.log(dataMap)


    const groups = Object.keys(data => data);

    const data = Object.values(dataMap)



    const subgroups = ["totalVaccinations", "newCases"];


    // Add X axis
    const x = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding([0.2])
    svg2.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 40])
        .range([height, 0]);
    svg2.append("g")
        .call(d3.axisLeft(y));


    const xSubgroup = d3.scaleBand()
        .domain(["totalVaccinations", "newCases"])
        .range([0, x.bandwidth()])
        .padding([0.05])


    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(["totalVaccinations", "newCases"])
        .range(['#e41a1c', '#377eb8', '#4daf4a'])

    // Show the bars
    svg2.append("g")
        .selectAll("g")
        // Enter in data = loop group per group
        .data(data)
        .join("g")
        .attr("transform", d => { console.log({ d }); return `translate(${x(d.date)}, 0)` })
        .selectAll("rect")
        .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
        .join("rect")
        .attr("x", d => xSubgroup(d.key))
        .attr("y", d => y(d.value))
        .attr("width", xSubgroup.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.key));




})