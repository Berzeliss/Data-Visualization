const width = 1000;
const height = 800;

const svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);


d3.csv("data/merged_data.csv").then(function(data) {

    data.forEach(d => {
        d.aqi_value = +d.aqi_value;
        d.life_expectancy = +d['Life expectancy'];
        d.population = +d['2022 Population'];
});


    const xScale = d3.scaleLinear ()
        .domain([0, d3.max(data, d => d.aqi_value)])
        .range([50, width - 50]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.life_expectancy), d3.max(data, d => d.life_expectancy)]) // Adjust based on Life Expectancy range
        .range([height - 50, 50]);

    const populationScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.population), d3.max(data, d => d.population)])
        .range([5, 20]);

    

    svg.append("g")
        .attr("transform", `translate(0,${height - 50})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(50,0)`)
        .call(d3.axisLeft(yScale));

    const colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain([d3.min(data, d => d.population), d3.max(data, d => d.population)]);

    

    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => xScale(d.aqi_value))
        .attr("cy", d => yScale(d.life_expectancy))
        .attr("r", d => populationScale(d.population))
        .attr("fill", d => colorScale(d.population))
        .attr("stroke", "black")
        .attr("opacity", 0.7);

    svg.selectAll("text")
        .data(data)
        .enter().append("text")
        .attr("x", d => xScale(d.aqi_value) + 5)
        .attr("y", d => yScale(d.life_expectancy))
        .text(d => d.country)
        .style("font-size", "10px")
        .style("fill", "black");
});