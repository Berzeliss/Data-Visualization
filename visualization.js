const width = window.innerWidth * 0.8;
const height = 900;

const svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("data/merged_data.csv").then(function(data) {

    data.forEach(d => {
        d.aqi_value = +d.aqi_value;
        d.life_expectancy = +d['Life expectancy'];
        d.population = +d['2022 Population'];
        d.country = d['Country'];
    });

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.aqi_value)])
        .range([50, width - 50]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.life_expectancy), d3.max(data, d => d.life_expectancy)])
        .range([height - 100, 50]);

    function getColor(value) {
        if (value > 0 && value < 1000000) {
            return "#008F8C";
        } else if (value >= 1000000 && value < 10000000) {
            return "#00C2CB";
        } else if (value >= 10000000 && value < 50000000) {
            return "#5EF38C";
        } else if (value >= 50000000 && value < 100000000) {
            return "#FFD23F";
        } else if (value >= 100000000 && value < 500000000) {
            return "#FF7D00";
        } else if (value >= 500000000 && value < 1000000000) {
            return "#D72638";
        } else {
            return "#F20089";
        }
    }

    svg.append("g")
        .attr("transform", `translate(0,${height - 100})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(50,0)`)
        .call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height - 30) 
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Air Quality Index (AQI)");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", -height / 2) 
        .attr("y", 20) 
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .attr("transform", "rotate(-90)")
        .text("Life Expectancy in years");

    svg.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => xScale(d.aqi_value))
        .attr("cy", d => yScale(d.life_expectancy))
        .attr("r", 8) 
        .attr("fill", d => getColor(d.population))
        .attr("stroke", "black")
        .attr("opacity", 0.7)
        .on("mouseover", function(event, d) {
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`
                <strong>${d.country}</strong><br>
                Life Expectancy: ${d.life_expectancy.toFixed(1)} years<br>
                AQI: ${d.aqi_value.toFixed(1)}<br>
                Population: ${d.population.toLocaleString()}
            `)
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition().duration(500).style("opacity", 0);
        });
});
