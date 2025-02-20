const width = 1000;
const height = 900;

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
        .range([height - 100, 50]);


    const colorScale = d3.scaleThreshold()
        .domain([1e6, 1e7, 5e7, 1e8, 5e8, 1e9])
        .range(["#008F8C", "#00C2CB", "#5EF38C", "#FFD23F", "#FF7D00", "#D72638", "#F20089"]);

    svg.append("g")
        .attr("transform", `translate(0,${height - 100})`)
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

const legendWidth = 600;
const legendHeight = 20;
const legendMargin = { top: 20, right: 20, bottom: 50, left: 50 };


const legend = svg.append("g")
    .attr("transform", `translate(${legendMargin.left},${height - 70})`);

legend.selectAll("rect")
    .data(colorScale.range())
    .enter().append("rect")
    .attr("x", (d, i) => i * (legendWidth / colorScale.range().length))
    .attr("width", legendWidth / colorScale.range().length)
    .attr("height", legendHeight)
    .attr("fill", d => d);

legend.selectAll("text")
    .data(colorScale.domain())
    .enter().append("text")
    .attr("x", (d, i) => i * (legendWidth / colorScale.range().length) + (legendWidth / colorScale.range().length) / 2)
    .attr("y", legendHeight + 10)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text(d => {
        if (d === 1e6) return "1M";
        if (d === 1e7) return "10M";
        if (d === 5e7) return "50M";
        if (d === 1e8) return "100M";
        if (d === 5e8) return "500M";
        if (d === 1e9) return "1B";
    });
