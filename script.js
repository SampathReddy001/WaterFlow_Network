const tooltip = d3.select("#tooltip");

Promise.all([
  d3.csv("\WW01_node.csv"),
  d3.csv("\WW01_pipe.csv")
]).then(([nodes, edges]) => {
  const svg = d3.select("#chart");
  const width = +svg.attr("width");
  const height = +svg.attr("height");

  // Scales for X and Y
  const xScale = d3.scaleLinear()
    .domain(d3.extent(nodes, d => +d["X-Coordinate"]))
    .range([50, width - 50]);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(nodes, d => +d["Y-Coordinate"]))
    .range([50, height - 50]);

  // Node lookup for positioning
  const nodeMap = {};
  nodes.forEach(d => {
    nodeMap[d["Node ID"]] = {
      x: xScale(+d["X-Coordinate"]),
      y: yScale(+d["Y-Coordinate"]),
      data: d
    };
  });

  // Define arrow marker
  svg.append("defs").append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 10)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "rgb(232,232,19)")
    .attr("stroke", "black");

  // Draw edges
  svg.selectAll("line.edge")
    .data(edges)
    .enter()
    .append("line")
    .attr("class", "edge")
    .attr("x1", d => nodeMap[d["Inlet Node"]]?.x || 0)
    .attr("y1", d => nodeMap[d["Inlet Node"]]?.y || 0)
    .attr("x2", d => nodeMap[d["Outlet Node"]]?.x || 0)
    .attr("y2", d => nodeMap[d["Outlet Node"]]?.y || 0)
    .on("mouseover", function(event, d) {
      d3.select(this).attr("stroke", "orange");
      let content = `<strong>Edge</strong><br>`;
      for (let key in d) {
        if (d[key] && d[key] !== "0") content += `${key}: ${d[key]}<br>`;
      }
      tooltip.html(content)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 20) + "px")
        .style("opacity", 1);
    })
    .on("mousemove", event => {
      tooltip.style("left", (event.pageX + 10) + "px")
             .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("stroke", "rgb(232,232,19)");
      tooltip.style("opacity", 0);
    });

  // Draw nodes
  svg.selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(+d["X-Coordinate"]))
    .attr("cy", d => yScale(+d["Y-Coordinate"]))
    .attr("r", 6)
    .on("mouseover", function(event, d) {
      d3.select(this).attr("fill", "orange");
      let content = `<strong>Node ID: ${d["Node ID"]}</strong><br>`;
      for (let key in d) {
        if (d[key] && d[key] !== "0") content += `${key}: ${d[key]}<br>`;
      }
      tooltip.html(content)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 20) + "px")
        .style("opacity", 1);
    })
    .on("mousemove", event => {
      tooltip.style("left", (event.pageX + 10) + "px")
             .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", function() {
      d3.select(this).attr("fill", "steelblue");
      tooltip.style("opacity", 0);
    });

  // Node labels
  svg.selectAll("text.label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", d => xScale(+d["X-Coordinate"]) + 8)
    .attr("y", d => yScale(+d["Y-Coordinate"]) - 8)
    .text(d => d["Node ID"]);
});
