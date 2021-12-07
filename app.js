function buildMetadata(sample) {
 d3.json("samples.json").then((data) => {
   var metadata = data.metadata;
   var the_array = metadata.filter(sampleObj => sampleObj.id == sample);
   var outcome_of_array = the_array[0];
   var JSon_panel = d3.select("#sample-metadata");
   JSon_panel.html("");
   Object.entries(outcome_of_array).forEach(([key, value]) => {
    JSon_panel.append("h6").text(`${key.toUpperCase()}: ${value}`);

   });
 });
}
function buildCharts(sample) {
 d3.json("samples.json").then((data) => {
   var samples = data.samples;
   var the_array = samples.filter(sampleObj => sampleObj.id == sample);
   var outcome_of_array = the_array[0];
   var otu_ids = outcome_of_array.otu_ids;
   var otu_labels = outcome_of_array.otu_labels;
   var sample_values = outcome_of_array.sample_values;
   var bubble_chart_layout = {
     title: "The Bacteria That Was Found in Each Sample",
     margin: { t: 0 },
     hovermode: "closest",
     xaxis: { title: "OTU ID" },
     margin: { t: 30}
   };
   var bubble_chart_data = [
     {
       x: otu_ids,
       y: sample_values,
       text: otu_labels,
       mode: "markers",
       marker: {
         size: sample_values,
         color: otu_ids,
         colorscale: "Earth"
       }
     }
   ];
   Plotly.newPlot("bubble", bubble_chart_data, bubble_chart_layout);
   var the_tiny_marks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
   var bar_chart_data = [
     {
       y: the_tiny_marks,
       x: sample_values.slice(0, 10).reverse(),
       text: otu_labels.slice(0, 10).reverse(),
       type: "bar",
       orientation: "h",
     }
   ];
   var bar_chart_layout = {
     title: "Ten of the Most Bacteria Cultures That was Discovered in This Study",
     margin: { t: 30, l: 150 }
   };
   Plotly.newPlot("bar", bar_chart_data, bar_chart_layout);
 });
}
function init() {
 var selector = d3.select("#selDataset");
 d3.json("samples.json").then((data) => {
   var sampleNames = data.names;
   sampleNames.forEach((sample) => {
     selector
       .append("option")
       .text(sample)
       .property("value", sample);
   });
   var firstSample = sampleNames[0];
   buildCharts(firstSample);
   buildMetadata(firstSample);
 });
}
function optionChanged(newSample) {
 buildCharts(newSample);
 buildMetadata(newSample);
}
init();