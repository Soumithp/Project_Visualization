var radial = d3.select("#stackbars").attr("width", 400).attr("height", 400),
    width5 = 400,//+radial.attr("width"),
    height5 = 400,//+radial.attr("height"),
    innerRadius5 = 120,
    outerRadius5 = Math.min(width5, height5) / 2,
    g5 = radial.append("g").attr("transform", "translate(" + width5 / 2 + "," + height5 / 2 + ")");

var x5 = d3.scaleBand()
    .range([0, 2 * Math.PI])
    .align(0);

var y5 = d3.scaleRadial()
    .range([innerRadius5, outerRadius5]);

var z5 = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

d3.csv("data/deaths_age_sex.csv", function (error, rawData) {
    let labels = ['0-10', '11-20', '21-40', '41-60', '61-80', '>80'];
    let total = 0;
    let data = [];
    labels.forEach((lab, index) => {
        let filterMale = rawData.filter((d) => { return +d.age == index && d.gender == 0; })
        let filterFemale = rawData.filter((d) => { return +d.age == index && d.gender == 1; })
        let obj = {};
        obj["group"] = lab;
        obj["Male"] = +filterMale.length;
        obj["Female"] = +filterFemale.length;
        obj["total"] = +filterFemale.length + filterMale.length;
        data.push(obj);
        total = total + (+filterMale.length) + (+filterFemale.length);
    })
    if (error) throw error;


    var subgroups = ["Male", "Female"]
    var subgroups1 = ["Male", "Female"]

    x5.domain(labels.map(function (d) { return d; }));
    y5.domain([0, d3.max(data, function (d) { return d.total; })]);
    z5.domain(subgroups);

    g5.append("g")
        .selectAll("g")
        .data(d3.stack().keys(subgroups1)(data))
        .enter().append("g")
        .attr("fill", function (d) { return z5(d.key); })
        .selectAll("path")
        .data(function (d) { return d; })
        .enter().append("path").attr("class", "bar").attr('id', function (d) {
            let grp = d.data.group;
            if (grp == '>80') {
                grp = '80';
            }
            return d[1] == d.data.Male ? "agesMale" + grp : "agesFemale" + grp;
        })
        .attr("d", d3.arc()
            .innerRadius(function (d) { return y5(d[0]); })
            .outerRadius(function (d) { return y5(d[1]); })
            .startAngle(function (d) { return x5(d.data.group); })
            .endAngle(function (d) { return x5(d.data.group) + x5.bandwidth(); })
            .padAngle(0.01)
            .padRadius(innerRadius5))
        .on("mouseover", function (d) {
            d3.selectAll('text#all').style('opacity', 0);
            d3.selectAll('.allOthers').style('opacity', 1);
            d3.selectAll('.bar').style('opacity', 0.1);
            d3.select(this).style("opacity", 1);
            let age = d.data.group == '0-10' ? 0 : d.data.group == '11-20' ? 1 : d.data.group == '21-40' ? 2 : d.data.group == '41-60' ? 3 : d.data.group == '61-80' ? 4 : 5;
            if (d[1] == d.data.Male) {
                let percentage = (+d.data.Male / total) * 100;
                percentage = percentage.toFixed(2);
                document.getElementById("grp").innerHTML = "Age: " + d.data.group;
                document.getElementById("gen").innerHTML = "Gender: Male";
                d3.selectAll('.c' + age + '0').style('opacity', 1);
            }
            else {
                let percentage = (+d.data.Female / total) * 100;
                percentage = percentage.toFixed(2);
                d3.selectAll('.c' + age + '1').style('opacity', 1);
                document.getElementById("grp").innerHTML = "Age: " + d.data.group;
                document.getElementById("gen").innerHTML = "Gender: Female";

            }
        }).on("mouseout", function (d) {
            d3.selectAll('.bar').style('opacity', 1);
            d3.selectAll('text#all').style('opacity', 1);
            document.getElementById("grp").innerHTML = "";
            document.getElementById("gen").innerHTML = "";
        })

    var label = g5.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("text-anchor", "middle")
        .attr("transform", function (d) { return "rotate(" + ((x5(d.group) + x5.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius5 + ",0)"; });

    label.append("line")
        .attr("x2", -5)
        .attr("stroke", "#000");

    label.append("text")
        .attr("transform", function (d) { return (x5(d.group) + x5.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
        .text(function (d) { return d.group; });

    var yAxis = g5.append("g")
        .attr("text-anchor", "middle");

    var yTick = yAxis
        .selectAll("g")
        .data(y5.ticks(5).slice(1))
        .enter().append("g");

    yTick.append("text")
        .attr("y", function (d) { return -y5(d); })
        .attr("dy", "0.35em")
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-width", 5)
        .text(function (d) { return d; });

    yTick.append("text")
        .attr("y", function (d) { return -y5(d); })
        .attr("dy", "0.35em")
        .text(y5.tickFormat(5, "s"));

    var legend = g5.append("g")
        .selectAll("g")
        .data(subgroups)
        .enter().append("g")
        .attr("transform", function (d, i) { return "translate(-40," + (i - (subgroups.length - 1) / 2) * 20 + ")"; });

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", z5);

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", "0.35em")
        .text(function (d) { return d; });
});
