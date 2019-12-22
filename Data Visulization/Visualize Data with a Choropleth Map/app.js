Promise.all([
		fetch("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json").then(value => value.json()),
		fetch("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json").then(value => value.json())
	]).then(allRes => {
		let map=allRes[0];
		let edu=allRes[1];

		const container=d3.select("#container");

		const w=1100;
		const h=650;
		const margin={top:5, left: 130, bottom: 120, right: 130};
		const graphHeight=h-margin.top-margin.bottom;
		const graphWidth=w-margin.left-margin.right;
		
		const svg=container.append("svg").attr("width", w).attr("height", h);

		const graph=svg.append("g").attr("width", graphWidth).attr("height", graphHeight).attr('transform', `translate(${margin.left}, ${margin.top})`);

		let color=["#D62728", "#F87F0F", "#E377C2", "#39BECE", "#8DFF00", "#95C3E4", "#2177B3" ,"#9367BD","#2EA02B"];

  		function colorScale(percent){
			if (percent>=0 && percent<3){
				return color[0]; 
			}
			else if(percent>=3 && percent<12){
				return color[1]; 
			}
			else if(percent>=12 && percent< 21){
				return color[2]; 
			}
			else if(percent>=21 && percent<30){
				return color[3]; 
			}
			else if(percent>=30 && percent<39){
				return color[4];
			}
			else if(percent>=39 && percent<48){
				return color[5];
			}
			else if(percent>=48 && percent< 57){
				return color[6];
			}
			else if(percent>=57 && percent<66){
				return color[7];
			}
			else if(percent>=66 && percent<76){ 
			 return color[8];
			}
		};

		//Tooldip
        let div = d3.select("body").append("div")   
            .attr("id", "tooltip")              
            .style("opacity", 0);

        let topojsonMap=topojson.feature(map, map.objects.counties).features;
    	for(let i=0; i<topojsonMap.length; i++){
    		for(let j=0; i<edu.length; j++){
    			if(topojsonMap[i].id==edu[j].fips){
      				topojsonMap[i].eduInfo=edu[j].bachelorsOrHigher;
      				topojsonMap[i].area=edu[j].area_name;
      				topojsonMap[i].state=edu[j].state;
      				break;
      			};
    		};	
      	};

	    const country=graph.selectAll("path")
	          .data(topojsonMap)
	          .enter()
	          .append("path")
	          .attr("d", d3.geoPath())
	          .style("fill", (d) => colorScale(d.eduInfo))
	          .attr("class", "county")
	          .attr("data-fips", (d) => d.id)
	          .attr("data-education", (d) => d.eduInfo)
	          .on("mouseover", (d, i) => {       
	                div.transition()        
	                    .duration(200)      
	                    .style("opacity", .9)       
	                div.html(` ${d.area}, ${d.state} <br/> ${d.eduInfo}%`)
	                     .style('left', (d3.event.pageX) + "px")
	                    .style('top', (d3.event.pageY) + "px")
	                    .style('transform', 'translateX(60px)')
	                    .attr("data-education", d.eduInfo)
	                })                  
	            .on("mouseout", (d) => {       
	                div.transition()        
	                    .duration(500)      
	                    .style("opacity", 0)    
	            });

        //Legend
        const legend=graph.append("g")
        	.attr("id", "legend");
        
        const legendRects=legend.selectAll("rect")
        	.data(color)
        	.enter()
        	.append("rect")
	        	.attr("x", (d, i) => 40*i+260)
				.attr("y", graphHeight+77)
				.attr("width", 40)
				.attr("height", 23)
				.attr("fill", (d, i) => color[i]);
		
		const legendDomain=["2.6", "3", "12", "21", "30", "39", "48", "57", "66", "75.1"];
		const legnedScale=d3.scalePoint()
			.domain(legendDomain)
			.range([0, 360]);
		const legendAxisGroup=graph.append("g").attr('transform', `translate(260, ${graphHeight+100})`);        
		const legendAxis=d3.axisBottom(legnedScale);
        legendAxisGroup.call(legendAxis).attr("class", "legend-axis");
	});