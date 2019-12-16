fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
	.then(response => response.json())
	.then(data => {
		let dataset=data.monthlyVariance;

		const container=d3.select("#container");
		const w=1200;
		const h=530;

		const margin={top:15, left: 70, bottom: 90, right: 15};
		const graphHeight=h-margin.top-margin.bottom;
		const graphWidth=w-margin.left-margin.right;

		const months=[ "Month", "January", "February", "March", "April", "May", "June", "July", "August", "September","October", "November", "December"]
//		const color=["#3BC4B2", "#6F5ED3", "#CE3664", "#508264", "#3896E3", "#DB61DB", "#929A9B"];
	//	const color=["silver", "grey", "orange", "pink", "black", "#008b8b", "purple","green", "blue", "red"];
		const color=["#3C99B2", "#56A6BB", "#70B2C2", "#9EBF92", "#D1C74B", "#E8C520", "#E4B80F","#E29E00", "#EA5C00", "#F22300"];

		const svg=container.append("svg").attr("width", w).attr("height", h);

		const graph=svg.append("g").attr("width", graphWidth).attr("height", graphHeight).attr('transform', `translate(${margin.left}, ${margin.top})`);

		const xScale=d3.scaleLinear()
			.domain([d3.min(dataset, d=> d.year), d3.max(dataset, d=> d.year)])
			.range([0, graphWidth])

        const yScale=d3.scaleBand()
			.domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
			.range([0, graphHeight]);
 
  		// const colorScale= d3.scaleSequential()
  		// 	.domain([d3.min(dataset, d=> d.variance), d3.max(dataset, d=> d.variance)])
  		// 	.interpolator(d3.interpolateViridis);

  		var colorScale = function(temp) {
  if (temp >= 0 && temp < 3) { return color[0]; }
  else if (temp >= 3 && temp < 5.5) { return color[1]; }
  else if (temp >= 5.5 && temp < 6) { return color[2]; }
  else if (temp >= 6 && temp < 6.5) { return color[3]; }
  else if (temp >= 6.5 && temp < 7) { return color[4]; }
  else if (temp >= 7 && temp < 8.5) { return color[5]; }
  else if (temp >= 8.5 && temp < 9) { return color[6]; }
  else if (temp >= 9 && temp < 9.5) { return color[7]; }
  else if (temp >= 9.5 && temp < 10) { return color[8]; }
  else if (temp >= 10 && temp < 15) { return color[9]; }
}

		const xAxisGroup=graph.append("g").attr("id", "x-axis").attr('transform', `translate(0, ${graphHeight})`);        
        const yAxisGroup=graph.append("g").attr("id", "y-axis");

        var div = d3.select("body").append("div")   
            .attr("id", "tooltip")              
            .style("opacity", 0);

		const circle=graph.selectAll("rect")
			.data(dataset)
			.enter()
			.append("rect")
				.attr("class", "cell")
				.attr("x", (d) => xScale(d.year))
				.attr("y", (d) => yScale(d.month))
				.attr("width", 2)
				.attr("height", graphHeight/12)
				.attr("data-month", (d) => d.month-1)
				.attr("data-year", (d) => d.year)
				.attr("data-temp", (d) => d.variance)
				.attr("fill", (d) => colorScale(8.66+d.variance))
			.on("mouseover", function(d, i){       
                div.transition()        
                    .duration(200)      
                    .style("opacity", .9)       
                div.html(`${d.year} - ${months[d.month]} <br/> ${Math.round((8.66+d.variance)*10)/10} <br/> ${Math.round(d.variance*10)/10}`)
                     .style('left', (d3.event.pageX) + "px")
                    .style('top', (d3.event.pageY) + "px")
                    .style('transform', 'translateX(60px)')
                    .attr("data-year", d.year)
                })                  
            .on("mouseout", function(d) {       
                div.transition()        
                    .duration(500)      
                    .style("opacity", 0)    
            });

		const xAxis=d3.axisBottom(xScale)
			.tickFormat(d3.format("d"));
        const yAxis=d3.axisLeft(yScale)
        	.tickFormat(index => months[index]);
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        const legend=graph.append("g")
        	.attr("id", "legend")
        
        const rects=legend.selectAll("rect")
        	.data(color)
        	.enter()
        	.append("rect")
	        	.attr("x", (d, i) => 40*i)
				.attr("y", graphHeight+20)
				.attr("width", 40)
				.attr("height", graphHeight/12)
				.attr("fill", (d, i) => color[i])
		
		const legendDomain= ["0", "3", "5.5", "6", "6.5", "7", "8.5", "9", "9.5", "10"];
		const legnedScale=d3.scaleLinear()
			.domain([0, 10])
			.range([0, 400])
		const legendAxisGroup=graph.append("g").attr('transform', `translate(0, ${graphHeight+60})`);        
		const legendAxis=d3.axisBottom(legnedScale)
			.tickValues(legendDomain)
			.tickSize(10, 0)
        legendAxisGroup.call(legendAxis);
	});