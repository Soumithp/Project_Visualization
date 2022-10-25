var margin = { top: 10, right: 60, bottom: 40, left: 60 },
    width = 560 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;


var svg = d3.select("#timeline")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


d3.csv("data/deathdays.csv",

    function (d) {
        return { date: d3.timeParse("%e-%b")(d.date), value: d.deaths }
    },

    function (data) {

        let format = d3.timeFormat("%e-%b");

        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return d.date; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%e-%b")));

        var y = d3.scaleLinear()
            .domain([d3.min(data, function (d) { return +d.value; }), d3.max(data, function (d) { return +d.value; })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("path")
            .datum(data)
            .attr("fill", "red")
            .style("fill-opacity", 0.5)
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d.date) })
                .y(function (d) { return y(+d.value) })
            )

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .attr("x", width)
            .attr("y", height + 20)
            .text("Days");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .style("font-size", "12px")
            .attr("y", -30)
            .attr("x", -4)
            .attr("transform", "rotate(-90)")
            .text("Deaths");

        svg.append("text")
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .attr("x", width / 2)
            .attr("y", height + 35)
            .text("Daily Deaths");
    })