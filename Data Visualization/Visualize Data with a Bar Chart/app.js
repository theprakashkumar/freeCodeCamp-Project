fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
    .then(data => {
       let dataset=data.data;

        const container=d3.select("#container");
        const w=900;
        const h=480;

        const margin={top: 15, left: 40, bottom: 50, right: 15};
        var graphWidth=w-margin.left-margin.right;
        var graphHeight=h-margin.top-margin.bottom;

        const svg=container.append("svg").attr("width", w).attr("height", h)

        const graph=svg.append("g").attr("width", graphWidth).attr("height", graphHeight).attr('transform', `translate(${margin.left}, ${margin.top})`);
       
        const xScale=d3.scaleTime()
            .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length-1][0])])
            .range([0, graphWidth]);

        const yScale=d3.scaleLinear()
            .domain([0, d3.max(dataset, (d) => d[1])])
            .range([graphHeight, 0])
            
        //Group where axes will be in.
        const xAxisGroup=graph.append("g").attr("id", "x-axis").attr('transform', `translate(0, ${graphHeight})`);        
        const yAxisGroup=graph.append("g").attr("id", "y-axis");

        function monthConvertor(date){
            var format = d3.timeFormat("%m");
            var formated=format(new Date(date))
            if(formated<4){
                return "Q1"
            } else if(formated<7){
                return "Q2"
            } else if(formated<10){
                return "Q3"
            } else{
                return "Q4"
            }
        };

        var div = d3.select("body").append("div")   
                    .attr("id", "tooltip")              
                    .style("opacity", 0);

        const react=graph.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
                .attr("class", "bar")
                .attr("height", 0)
                .attr("width", graphWidth/275)
                .attr("fill", "gray")
                .attr("x", (d, i) => xScale(new Date(d[0])))
                .attr("y", graphHeight)
                .attr("data-date", (d) => d[0])
                .attr("data-gdp", (d) => d[1])
                .on("mouseover", function(d, i) {       
                    div.transition()        
                        .duration(200)      
                        .style("opacity", .9)       
                    div.html(d[0].substring(0, 4)+" "+monthConvertor(d[0]) + "<br/>"  + "$"+d[1]+" Dollars")
                        .attr('data-date', dataset[i][0])
                        .style('left', (d3.event.pageX) + "px")
                        .style('top', (d3.event.pageY) + "px")
                        .style('transform', 'translateX(60px)');
                    })                  
                .on("mouseout", function(d) {       
                    div.transition()        
                        .duration(500)      
                        .style("opacity", 0)    
                });
                //Adding little transition.(Not in User Stories)
                react.transition().duration(750).attr("y", (d) => yScale(d[1])).attr("height", (d) => graphHeight-yScale(d[1]));
                
            graph.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -180)
            .attr("y", 40)
            .text("Gross Domestic Product");

            graph.append("text")
            .attr("x", w/2-100)
            .attr("y", h-20)
            .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf");

        const xAxis=d3.axisBottom(xScale);
        const yAxis=d3.axisLeft(yScale);
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);
    });