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

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params

// open csv
d3.csv("assets/data/data.csv")
  .then(arrState=>{

    // 1) cast data
    arrState.forEach(obj=>{
      obj.income = +obj.income;
      obj.obesity = +obj.obesity;
    });

    // 2) create scale functions
    var fnXScale = d3.scaleLinear()
      .domain([d3.min(arrState, d => d.income), d3.max(arrState, d => d.income)])
      .range([0, width]);

    var fnYScale = d3.scaleLinear()
      .domain([d3.min(arrState, d => d.obesity), d3.max(arrState, d => d.obesity)])
      .range([height, 0]);

    // 3) create axis functions
    var fnXAxis = d3.axisBottom(fnXScale);
    var fnYAxis = d3.axisLeft(fnYScale);

    // 4) append axis functions to G tag
    g.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(fnXAxis);
    g.append("g")
      .call(fnYAxis);

    // 5) create circles
    var objCir = g.selectAll("circle")
			.data(arrState)
			.enter()
			.append("circle")
			.attr("cx", obj=>fnXScale(obj.income))
			.attr("cy", obj=>fnYScale(obj.obesity))
			.attr("r", "10")
			.attr("fill", "lightblue")
			.attr("opacity", "1")
		
		// 6) create text labels. Note: instead of selecting all text tags, I select
		// only those tags with the "circlelabel" class
    var objTxt = g.selectAll(".circlelabel")
			.data(arrState)
			.enter()
			.append("text")
			.attr("class", "circlelabel")
			.attr("dx", obj=>fnXScale(obj.income) - 7)
			.attr("dy", obj=>fnYScale(obj.obesity) + 4)
			.text(obj=>obj.abbr)
      .attr("fill", "white")
      .attr("font-size", 10);
	
    // 7) create tooltip function
    var fnToolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(obj=>{
        return (`<strong>${obj.state}</strong><br>Income: $${obj.income.toLocaleString()}<br>Obesity: ${obj.obesity}%`);
      });

    // 8) bind tooltip function to chart
    g.call(fnToolTip);

    // 9) create listeners to show & hide tooltip
    objCir.on("click", function(obj) {				// circle: on click
      fnToolTip.style("display", "block");
      fnToolTip.show(obj, this);
    })
      .on("mouseout", function(obj, index) {	// circle: on mouseout
        fnToolTip.hide(obj);
      });

    objTxt.on("click", function(obj) {				// text: on click
      fnToolTip.style("display", "block");
			fnToolTip.show(obj, this);
    })
      .on("mouseout", function(obj, index) {  // text: on mouseout
        fnToolTip.hide(obj);
      });

    // 10) label axes
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Obesity");

    g.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Income");
  });