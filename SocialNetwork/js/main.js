var marge = { top: 60, bottom: 60, left: 60, right: 60 };
var svg = d3.select("svg");
var width = svg.attr("width");
var height = svg.attr("height");
var g = svg.append("g").attr("transform", "translate(" + marge.top + "," + marge.left + ")");

console.log(width, height);

var adjTable = {};                             //Create an array recording the connection

var nodes = [];                         // store vertexs

// var node = {
//     "name": ,                        // name
//     "target": ,                      // name
//     "school1": ,                     // name
//     "school2": ,                     // name
//     "school3": ,                     // name
//     "workplace":                     // name
// }

var edges = [];                         // store edges

// var edge = {
//     "source": nodes.length - 1,      // edge start
//     "target": i,                     // edge end
//     "relation": "",                  // edges relationship
//     "value": 3                       // edge value for the distance between two nodes
// };

//设置一个color的颜色比例尺
var colorScale = d3.scaleOrdinal()
    .domain(d3.range(50))
    .range(d3.schemeCategory10);

var button1 = document.getElementById("button1");

button1.addEventListener("click", function () {

    AddNode();
    AddEdge();

    console.log(nodes);
    console.log(edges);

    d3.select('svg').html(null);                        // delete svg


    var g = svg.append("g").attr("transform", "translate(" + marge.top + "," + marge.left + ")");

    let simulation = d3.forceSimulation()               // force graph
        .force('link', d3.forceLink().id(function (d, i) { return i; })
            .distance(function (d) { return d.value * 100; }))
        // the length of the line according to the similarity of node
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    let link = g.append("g")                            // draw the line
        .attr("class", "links")
        .selectAll("line")
        .data(edges)
        .enter().append("line")
        .style('stroke-width', '1px')
        .style('stroke', '#ddd');

    let linkText = g.append("g")                        // draw related text on the line
        .attr("class", "link-text")
        .selectAll("text")
        .data(edges)
        .enter().append("text")
        .text(function (d) {
            return d.relation;
        })
        .style("fill-opacity", 0);

    let node = g.append("g")                            // draw circle and text
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .enter().append("g")
        .on("mouseover", function (d, i) {
            // display the text on the line
            linkText.style("fill-opacity", function (edge) {
                if (edge.source === d || edge.target === d)
                    return 1;
                else
                    return 0;
            });
            // bold the line
            link.style('stroke-width', function (edge) {
                if (edge.source === d || edge.target === d)
                    return '2px';
                else
                    return '1px';
            }).style('stroke', function (edge) {
                if (edge.source === d || edge.target === d)
                    return '#000';
                else
                    return '#ddd';
            });
        })
        .on("mouseout", function (d, i) {
            // delete the text
            linkText.style("fill-opacity", function (edge) {
                if (edge.source === d || edge.target === d)
                    return 0;
                else
                    return 0;
            });
            // slim the line
            link.style('stroke-width', function (edge) {
                if (edge.source === d || edge.target === d)
                    return '1px';
                else
                    return '1px';
            }).style('stroke', function (edge) {
                if (edge.source === d || edge.target === d)
                    return '#ddd';
                else
                    return '#ddd';
            });
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on('dblclick', connectedNodes);

    node.append('circle')
        .attr("r", 5)
        .attr('fill', function (d, i) { return colorScale(i); });

    node.append("text")
        .attr('fill', function (d, i) { return colorScale(i); })
        .attr("x", -10)//123
        .attr("y", -20)
        .attr("dy", ".71em")
        .text(function (d) { return d.name; });


    var toggle = 0;                                     //The toggle stores the highlighting state on or off.



    for (i = 0; i < nodes.length; i++)
        adjTable[i + "," + i] = 1;

    edges.forEach(function (d) {
        adjTable[d.source.index + "," + d.target.index] = 1;
        adjTable[d.target.index + "," + d.source.index] = 1;

        // console.log(adjTable[d.source.index + "," + d.target.index]);
    });
    //This function shows whether the pair is neighbour
    function neighboring(a, b) {
        console.log(a, b);
        console.log(adjTable[a.index + "," + b.index]);
        return adjTable[a.index + "," + b.index];
    }

    function connectedNodes() {
        edges.forEach(function (d) {
            adjTable[d.source.index + "," + d.target.index] = 1;
            adjTable[d.target.index + "," + d.source.index] = 1;

            console.log(adjTable[d.source.index + "," + d.target.index]);
        });
        if (toggle === 0) {
            //Reduce the opacity of all but the neighbouring nodes
            d = d3.select(this).node().__data__;
            node.style("opacity", function (o) {
                return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
            });
            link.style("opacity", function (o) {
                return d.index === o.source.index | d.index === o.target.index ? 1 : 0.1;
            });
            //Reduce the op
            toggle = 1;
        } else {
            //Put them back to opacity=1
            node.style("opacity", 1);
            link.style("opacity", 1);
            toggle = 0;
        }
    }


    simulation.nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(edges);

    function ticked() {                                 // the function for updating the force graph
        nodes.forEach(function (d, i) {
            d.x = d.x < 0 ? 0 : d.x;
            d.x = d.x > width - 65 ? width - 65 : d.x;
            d.y = d.y < 0 ? 0 : d.y;
            d.y = d.y > height - 65 ? height - 65 : d.y;
        });

        link.attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        linkText.attr("x", function (d) { return (d.source.x + d.target.x) / 2; })
            .attr("y", function (d) { return (d.source.y + d.target.y) / 2; });

        node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    function dragstarted(d) {
        if (!d3.event.active)
            simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active)
            simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;

    }
});

function sortNumber(a, b) {
    return a - b;
}

function sortCorrelation(a, b) {
    return a.correlation - b.correlation;
}

var button2 = document.getElementById("button2");

button2.addEventListener("click", function () {
    //查询可能认识的人
    d3.select("#output").html(null);
    var Sname = document.getElementById("input7").value;
    document.getElementById("input7").value = '';
    var flag = false;
    var loc;
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].name === Sname) {
            flag = true;
            loc = i;
            break;
        }
    }

    var Adj = [];
    for (let i = 0; i < nodes.length; i++) {
        var Adj_son = [];
        for (let j = 0; j < edges.length; j++) {
            if (edges[j].source.index === i && Adj_son.indexOf(edges[j].target.index) === -1) {
                Adj_son.push(edges[j].target.index);
            }
            if (edges[j].target.index === i && Adj_son.indexOf(edges[j].source.index) === -1) {
                Adj_son.push(edges[j].source.index);
            }
        }
        console.log(Adj_son);
        Adj_son.sort(sortNumber);
        console.log(Adj_son);
        Adj.push(Adj_son);
    }

    console.log(Adj);

    if (!flag) {
        $("#output").append("<br><span><strong>%data%不在社会关系网络中</strong></span>".replace("%data%", Sname));
    }
    else {
        var may_know_people = [];
        for (var i = 0; i < Adj.length; i++) {
            if (i !== loc) {
                if (Adj[i].indexOf(loc) === -1) {
                    var num = 0;
                    for (var j = 0; j < Adj[i].length; j++) {
                        if (Adj[loc].indexOf(Adj[i][j]) != -1) {
                            num++;
                        }
                    }
                    if (num !== 0) {
                        var people = {
                            "name": nodes[i].name,
                            "correlation": num
                        };
                        may_know_people.push(people);
                    }
                }
            }
        }
        console.log(may_know_people);
        if (may_know_people.length === 0) {
            $("#output").append("<br><span><strong>%data%没有可能认识的人（非好友）</strong></span>".replace("%data%", Sname));
        }
        else {
            may_know_people.sort(sortCorrelation);
            console.log(may_know_people);
            $("#output").append("<br><span><strong>%data%的可能认识的人（非好友）如下（按关联度排序）：</strong></span><br>".replace("%data%", Sname));
            $("#output").append('<ul id="sortlist"></ul>');
            for (var i = 0; i < may_know_people.length; i++) {
                $("#sortlist").append("<li>" + may_know_people[i].name + "，关联度：" + may_know_people[i].correlation + "</li>");
            }
        }
    }

})