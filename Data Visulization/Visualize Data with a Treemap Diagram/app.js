var kickstarter=document.getElementById("kickstarter");
var videoGames=document.getElementById("video-games");
var movies=document.getElementById("movies");
var title=document.getElementById("title");
var description=document.getElementById("description");

const main=d3.select("#main");
const container=d3.select("#container");

const w=1225;
const h=530;
const margin={top:15, left:40, right: 220};
const graphHeight=h-margin.top;
const graphWidth=w-margin.right;

const svg=container.append("svg").attr("width", w).attr("height", h);

const graph=svg.append("g")
			.attr("width", graphWidth)
			.attr("height", graphHeight)
			.attr("id", "graph");
			
var data={
   kickstarter:{
      url:"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json",
      title: 'Kickstarter Pledges',
      description: 'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category'
   },
   videoGames:{
      url:"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json",
      title: 'Video Game Sales',
      description: 'Top 100 Most Sold Video Games Grouped by Platform'
   },
   movies:{
      url:"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
      title: 'Movie Sales',
      description: 'Top 100 Highest Grossing Movies Grouped By Genre'
   }
};

//Tooldip
let div = d3.select("body").append("div")   
    .attr("id", "tooltip")              
    .style("opacity", 0);

function plot(dataSet){
	fetch(dataSet.url)
		.then(res => res.json())
		.then(data => {
			var dataset=data;

			title.innerHTML=dataSet.title;
			description.innerHTML=dataSet.description;

			graph.attr('transform', `translate(${margin.left}, ${margin.top})`);


			var root=d3.hierarchy(dataset).sum((d) => d.value).sort((a, b) => b.height-a.height || b.value-a.value); 

		    d3.treemap()
		    	.size([graphWidth, graphHeight])
		    	.padding(1)
		    	(root);

		    const category=new Set(root.leaves().map(d => d.data.category));

		    let colorpal=["#D62728", "#F87F0F", "#E377C2", "#39BECE", "#8DFF00", "#95C3E4", "#2177B3" ,"#9367BD","#2EA02B", "#3C99B2", "#ffd8b1", "#70B2C2", "#9EBF92", "#D1C74B", "#469990", "#aaffc3","#808000", "#469990", "#911eb4"];
		    
		    var color = d3.scaleOrdinal().domain(category)
  				.range(colorpal);

		    const sq=graph.selectAll("rect")
	          .data(root.leaves())
	          .enter();

	          sq.append("rect")
	          .style("fill",  d => color(d.data.category))
	          .attr("class", "tile")
	          .attr("x", (d) => d.x0)
		      .attr("y", (d) => d.y0)
		      .attr("width", (d) => d.x1-d.x0)
		      .attr("height", (d) => d.y1-d.y0)
		      .attr("data-name", (d) => d.data.name)
		      .attr("data-category", (d) => d.data.category)
		      .attr("data-value", (d) => d.value)
	          .on("mouseover", (d, i) => {       
	                div.transition()        
	                    .duration(200)      
	                    .style("opacity", .9)       
	                div.html(`Name: ${d.data.name} <br> Category: ${d.data.category} <br> Value: ${d.value}`)
	                    .style('left', (d3.event.pageX) + "px")
	                    .style('top', (d3.event.pageY) + "px")
	                    .style('transform', 'translateX(60px)')
	                    .attr("data-value", d.value)
	                })                  
	            .on("mouseout", (d) => {       
	                div.transition()        
	                    .duration(500)      
	                    .style("opacity", 0)    
	            });

	        const titles=sq.append("foreignObject")
			      .attr("x", (d) => d.x0)
			      .attr("y", (d) => d.y0)
			      .attr("width", d => d.x1-d.x0)
    			  .attr("height", d => d.y1-d.y0)
			      .attr("font-size", "10px")
			      .attr("fill", "black")
			      .attr("class", "titles")
			      .on("mouseover", (d, i) => {       
	                div.transition()        
	                    .duration(200)      
	                    .style("opacity", .9)       
	                div.html(`Name: ${d.data.name} <br> Category: ${d.data.category} <br> Value: ${d.value}`)
	                    .style('left', (d3.event.pageX) + "px")
	                    .style('top', (d3.event.pageY) + "px")
	                    .style('transform', 'translateX(60px)')
	                    .attr("data-value", d.value)
	                })                  
		            .on("mouseout", (d) => {       
		                div.transition()        
		                    .duration(500)      
		                    .style("opacity", 0)    
	            	});

		    titles.append("xhtml:div")
			  .html(d => d.data.name)
			  .attr("y", d => d.y1-d.y0)
			  .style("opacity", 1);
	  	          
			//Legend
        	const legend=graph.append("g")
        		.attr("id", "legend");
        
	        const legendRects=legend.selectAll("rect")
	        	.data(Array.from(category))
	        	.enter()
	        	.append("rect")
		        	.attr("x", graphWidth+25)
					.attr("y", (d, i) => 25*i)
					.attr("width", 20)
					.attr("height", 20)
					.attr("fill", (d) => color(d))
					.attr("class", "legend-item");

			const legendText=legend.selectAll("text")
	        	.data(Array.from(category))
	        	.enter()
	        	.append("text")
		        	.attr("x", graphWidth+60)
					.attr("y", (d, i) => 25*i+15)
					.text((d) => d)
					.attr("fill", "black");
		});
};

plot(data.movies)
movies.className="button-selected";

var graphGroup=document.getElementById("graph");

kickstarter.onclick=kickstarterChart;
videoGames.onclick=videoGameChart;
movies.onclick=moviesChart;

function kickstarterChart(){
	margin.left=10;
	graphGroup.innerHTML=plot(data.kickstarter);
	kickstarter.className="button-selected";
	videoGames.className="button-normal";
	movies.className="button-normal";
};

function videoGameChart(){
	margin.left=65;
	graphGroup.innerHTML=plot(data.videoGames);
	videoGames.className="button-selected";
	movies.className="button-normal";
	kickstarter.className="button-normal";
};

function moviesChart(){
	margin.left=40;
	graphGroup.innerHTML=plot(data.movies);
	movies.className="button-selected";
	videoGames.className="button-normal";
	kickstarter.className="button-normal";
};