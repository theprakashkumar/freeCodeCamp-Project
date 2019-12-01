fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
	.then(response => response.json())
	.then(data => {
		let dataset=data;

		const container=d3.select("#container");
		const w=900;
		const h=530;

		const margin={top:15, left: 70, bottom: 50, right: 15};
		const graphHeight=h-margin.top-margin.bottom;
		const graphWidth=w-margin.left-margin.right;

		const svg=container.append("svg").attr("width", w).attr("height", h);

		const graph=svg.append("g").attr("width", graphWidth).attr("height", graphHeight).attr('transform', `translate(${margin.left}, ${margin.top})`);

		//Formate for minute.
		function timeConversion(){
			dataset.forEach((d) => {
				var parsedTime = d.Time.split(':');
    			d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
			})
		}
		timeConversion();

		const formatTime=d3.timeFormat("%M:%S");

		const xScale=d3.scaleLinear()
			.domain([d3.min(dataset, (d) => d.Year)-1, d3.max(dataset, (d) => d.Year)+1])
			.range([0, graphWidth])

        const yScale=d3.scaleTime()
			.domain(d3.extent(dataset, (d) => d.Time))
			.range([0, graphHeight]);

		//Group where axes will be in.
        const xAxisGroup=graph.append("g").attr("id", "x-axis").attr('transform', `translate(0, ${graphHeight})`);        
        const yAxisGroup=graph.append("g").attr("id", "y-axis");

        var div = d3.select("body").append("div")   
                    .attr("id", "tooltip")              
                    .style("opacity", 0);

        //Create dots.
		const circle=graph.selectAll("circle")
			.data(dataset)
			.enter()
			.append("circle")
				.attr("class", "dot")
				.attr("cx", (d) => xScale(d.Year))
				.attr("cy", (d) => yScale(d.Time))
				.attr("data-xvalue", (d) => d.Year)
				.attr("data-yvalue", (d) => d.Time)
				.attr("r", "0")
				.attr("fill", (d) => {
					if(d.Doping ===""){
						return "red"
					} return "black"
				})
				.on("mouseover", function(d, i) {       
                    div.transition()        
                        .duration(200)      
                        .style("opacity", .9)       
                    div.html(`${d.Name}: ${d.Nationality} <br/> Year: ${d.Year}, Time: ${formatTime(d.Time)} <br/> ${d.Doping}`)
                         .style('left', (d3.event.pageX) + "px")
                        .style('top', (d3.event.pageY) + "px")
                        .style('transform', 'translateX(60px)')
                        .attr("data-year", d.Year)
                    })                  
                .on("mouseout", function(d) {       
                    div.transition()        
                        .duration(500)      
                        .style("opacity", 0)    
                });

        circle.transition().duration(900).attr("r", "7");

		const xAxis=d3.axisBottom(xScale).tickFormat(d3.format("d"));
        const yAxis=d3.axisLeft(yScale).tickFormat(formatTime);
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -330)
            .attr("y", 15)
            .text("Time in Minutes")
            .attr("class", "axes-text");

        graph.append("text")
	        .attr("x", w/2-35)
	        .attr("y", h-25)
	        .text("Year")
	        .attr("class", "axes-text");

	  	// Create the legend
	  	const legend = graph.append("g").attr("id", "legend");
	  	
	  	legend.append("rect")
          .attr("x", w-275)
          .attr("y", h/2-200)
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", "black");
	  
	  	legend.append("rect")
          .attr("x", w-275)
          .attr("y", h/2-170)
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", "red")   
	  
	  	legend.append("text")
	      .attr("x", w-250)
	      .attr("y", h/2 -186)
	      .text("Doping alegations")

	  	legend.append("text")
	      .attr("x", w-250)
	      .attr("y", h/2-156 )
	      .text("No doping alegations")
	});