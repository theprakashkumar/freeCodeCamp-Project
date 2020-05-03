fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
	.then(response => response.json())
	.then(data => {
		let dataset=data.monthlyVariance;

		const container=d3.select("#container");

		const w=1450;
		const h=580;
		const margin={top:15, left: 100, bottom: 120, right: 15};
		const graphHeight=h-margin.top-margin.bottom;
		const graphWidth=w-margin.left-margin.right;
		const months=["Month", "January", "February", "March", "April", "May", "June", "July", "August", "September","October", "November", "December"]
		const color=["#3C99B2", "#56A6BB", "#70B2C2", "#9EBF92", "#D1C74B", "#E8C520", "#E4B80F","#E29E00", "#EA5C00", "#F22300"];

		const svg=container.append("svg").attr("width", w).attr("height", h);

		const graph=svg.append("g").attr("width", graphWidth).attr("height", graphHeight).attr('transform', `translate(${margin.left}, ${margin.top})`);

		//Scales
		const xScale=d3.scaleLinear()
			.domain([d3.min(dataset, d=> d.year), d3.max(dataset, d=> d.year)])
			.range([0, graphWidth])

        const yScale=d3.scaleBand()
			.domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
			.range([0, graphHeight]);
 
  		function colorScale(temp){
			if (temp>=0 && temp<3){
				return color[0]; 
			}
			else if(temp>=3 && temp<5.5){
				return color[1]; 
			}
			else if(temp>=5.5 && temp< 6){
				return color[2]; 
			}
			else if(temp>=6 && temp<6.5){
				return color[3]; 
			}
			else if(temp>=6.5 && temp<7){
				return color[4];
			}
			else if(temp>=7 && temp<8.5){
				return color[5];
			}
			else if(temp>=8.5 && temp< 9){
				return color[6];
			}
			else if(temp>=9 && temp<9.5){
				return color[7];
			}
			else if(temp>=9.5 && temp<10){ 
			 return color[8];
			}
			else if(temp>=10 && temp<15){
				return color[9];
			}
		};

		//Tooldip
        var div = d3.select("body").append("div")   
            .attr("id", "tooltip")              
            .style("opacity", 0);

		const rects=graph.selectAll("rect")
			.data(dataset)
			.enter()
			.append("rect")
				.attr("class", "cell")
				.attr("x", (d) => xScale(d.year))
				.attr("y", (d) => yScale(d.month))
				.attr("width", 3.8)
				.attr("height", 0)
				.attr("data-month", (d) => d.month-1)
				.attr("data-year", (d) => d.year)
				.attr("data-temp", (d) => d.variance)
				.attr("fill", (d) => colorScale(8.66+d.variance))
			.on("mouseover", function(d, i){       
                div.transition()        
                    .duration(200)      
                    .style("opacity", .9)       
                div.html(` ${months[d.month]} ${d.year} <br/> Temperature: ${Math.round((8.66+d.variance)*10)/10} <br/> Variance: ${Math.round(d.variance*10)/10}`)
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
        rects.transition().duration(800).attr("height", graphHeight/12);

       	//Axes
        const xAxisGroup=graph.append("g").attr("id", "x-axis").attr('transform', `translate(0, ${graphHeight})`);        
        const yAxisGroup=graph.append("g").attr("id", "y-axis"); 

		const xAxis=d3.axisBottom(xScale)
			.tickFormat(d3.format("d"));
        const yAxis=d3.axisLeft(yScale)
        	.tickFormat(index => months[index]);
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -255)
            .attr("y", 15)
            .text("Month")
            .attr("class", "axes-text");

        graph.append("text")
	        .attr("x", graphWidth/2-35)
	        .attr("y", graphHeight+40)
	        .text("Year")
	        .attr("class", "axes-text");

        //Legend
        const legend=graph.append("g")
        	.attr("id", "legend");
        
        const legendRects=legend.selectAll("rect")
        	.data(color)
        	.enter()
        	.append("rect")
	        	.attr("x", (d, i) => 50*i)
				.attr("y", graphHeight+50)
				.attr("width", 50)
				.attr("height", 0)
				.attr("fill", (d, i) => color[i]);

		legendRects.transition().duration(800).attr("height", 35);
		
		const legendDomain=["0", "3", "5.5", "6", "6.5", "7", "8.5", "9", "9.5", "10", "10+"];
		const legnedScale=d3.scalePoint()
			.domain(legendDomain)
			.range([0, 500]);
		const legendAxisGroup=graph.append("g").attr('transform', `translate(0, ${graphHeight+85})`);        
		const legendAxis=d3.axisBottom(legnedScale);
        legendAxisGroup.call(legendAxis);
	});