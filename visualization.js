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

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.aqi_value)])
        .range([50, width - 50]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.life_expectancy), d3.max(data, d => d.life_expectancy)])
        .range([height - 50, 50]);


    const colorScale = d3.scaleThreshold()
        .domain([1e6, 1e7, 5e7, 1e8, 5e8, 1e9])
        .range(["#228B22", "#32CD32", "#9ACD32", "#FFFF00", "#FFA500", "#FF4500", "#DC143C"]);

    svg.append("g")
        .attr("transform", `translate(0,${height - 50})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(50,0)`)
        .call(d3.axisLeft(yScale));

    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => xScale(d.aqi_value))
        .attr("cy", d => yScale(d.life_expectancy))
        .attr("r", 8) 
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
