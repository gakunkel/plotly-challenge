// Function to build panel (info for selected sample)
function buildMetaData(sample) {
    d3.json("samples.json").then(function(data) {
        var metadata = data.metadata;
        var resultsArr = metadata.filter(function(data) {
            return data.id == sample;
        })
        var result = resultsArr[0];
        var panel = d3.select("#sample-metadata");

        // Reset data to empty
        panel.html("");

        Object.entries(result).forEach(function([key, value]) {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        })
        
        console.log(result.wfreq);

        // For bonus
        buildGauge(result.wfreq);
    })
}


// Function for building charts
function buildChart(sample){
    d3.json("samples.json").then(function(data){
        var samples = data.samples;
        var resultsArray = samples.filter(function(data){
            return data.id === sample;
        })
        var result = resultsArray[0];
        
        // Grabbing the bacterial species id number, name, and quantity
        var otu_ids = result["otu_ids"];
        var otu_labels = result["otu_labels"];
        var sample_values = result["sample_values"];

        console.log(otu_ids);
        console.log(otu_labels);
        console.log(sample_values);

        // Building the bubble chart
        var bubbleLayout = {
            title: "Bacterial Cultures Per Sample",
            hovermode: "closest",
            xaxis: { title: "OTU ID"},
            margin: {t: 30}
        }
        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "thermal"
                }
            }
        ];

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        
        // First 10 OTU IDs for Horizontal Bar Chart
        var yticks = otu_ids.slice(0,10)
            .map(function(otuID) {
                return `OTU ${otuID}`;
            }).reverse();
            
            var barData = [
                {
                    y: yticks,
                    x: sample_values.slice(0,10).reverse(),
                    text: otu_labels.slice(0,10).reverse(),
                    type: "bar",
                    orientation: "h"
                }
            ];

            var barLayout = {
                title: "Top 10 Most Common Bacteria",
                margin: {t: 30, l: 150}
            };

            Plotly.newPlot("bar", barData, barLayout);

    })
}

// Function for initializing the page
function init(){
    console.log("Hello World!");
    // Selector for sample ID name
    var selector = d3.select("#selDataset");
    // Append a selector option for each sample name
    d3.json("samples.json").then(function(data) {
        console.log(data);
        var sampleNames = data.names;

        sampleNames.forEach(function(name) {
            selector.append("option")
            .text(name)
            .property("value", name);
        })

        var firstSample = sampleNames[0];

        buildChart(firstSample);
        buildMetaData(firstSample);

    })
}

function optionChanged(newSample) {
    buildChart(newSample);
    buildMetaData(newSample);
}

// Initializes the page
init()