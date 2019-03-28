// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold my chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function(povertyData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    povertyData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(povertyData, d => d.poverty) * 0.8,
      d3.max(povertyData, d => d.poverty) * 1.2])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(povertyData, d => d.healthcare) * 0.6,
      d3.max(povertyData, d => d.healthcare) * 1.2])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale).ticks(8);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(8);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .style('stroke', '#000')
      .call(bottomAxis);

    chartGroup.append("g")
      .style('stroke', '#000')
      .call(leftAxis);
    
      // yAxisNodes.selectAll('text').style({ 'stroke-width': '1px'});
    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(povertyData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "12")
    .attr("fill", "lightblue")
    .attr("opacity", ".9")
    .attr("stroke-width", 1)
    .attr("stroke", "white");
    // appending a text label to each circle
    chartGroup.selectAll("g circles")
    .data(povertyData)
    .enter()
    .append("text")
    .style("text-anchor","middle")
    .style("font-size", "8px")
    .style("alignment-baseline", "central")
    .attr("dx", d => xLinearScale(d.poverty))
    .attr("dy", d => yLinearScale(d.healthcare))
    .text(d => d.abbr)
    .attr("fill","white")

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`<strong>${d.state}<strong><br>Poverty: ${d.poverty}% <br>Lacks Healthcare: ${d.healthcare}%`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height/ 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .style("text-anchor", "middle")
      .style("font-family","sans-serif")
      .style('stroke', '#000')
      .style("font-size","20px")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width/ 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .style("text-anchor", "middle")
      .style("font-family","sans-serif")
      .style("font-size","20px")
      .style('stroke', '#000')
      .text("In Poverty (%)");
  });