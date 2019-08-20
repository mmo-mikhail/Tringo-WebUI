import React, { Component } from 'react'

export default class budgetFilter extends Component {


  render() {
    return (
      <div>
      <div id="depart-arrive-filter" className="alt-content center range-slider-group">
<div data-toggle="buttons" className="btn-group" data-selection="depart">
   <label className="btn active">
   <input type="radio"  value="depart-filter" name="slider-selector"/>Depart
   </label>
   <label className="btn">
   <input type="radio" value="arrive-filter" name="slider-selector" />Arrive
   </label>
</div>
<div className="range-slider">
   <div className="slider" data-values="[120,1200]" data-range="[120,1200]" data-step="15" data-type="depart-filter">              
   </div>
   <div className="text">
      <div className="from">#</div>
      <div className="to">#</div>
   </div>
</div>
<div className="range-slider hide">
   <div className="slider" data-values="[120,1200]" data-range="[120,1200]" data-step="15" data-type="arrive-filter"></div>
   <div className="text">
      <div className="from">#</div>
      <div className="to">#</div>
   </div>
</div>

</div>


<script>
   

    var setSliderDisplayValues = function(slider, selectedValues) {
        var displayedValues = slider.next(".text");

        var minValue = displayedTimeString(selectedValues[0]);
        displayedValues.find(".from").text(minValue);

        var maxValue = displayedTimeString(selectedValues[1]);
        displayedValues.find(".to").text(maxValue);
    }

    var updateButtonGroupState = function(slider, isFiltered) {
        var type = slider.data("type");
        var btnGroup = slider.closest(".range-slider-group").find(".btn-group");
        btnGroup.find("label").has("input[value='"+type+"']").toggleClass("filtered", isFiltered);
    }

    $("#depart-arrive-filter .slider").wjSlider({
        range: true,
        create: function() {
            var slider = $(this);
            setSliderDisplayValues(slider, slider.data("values"));
        },
        slide: function(event, ui) {
            var slider = $(this);

            // highlight slider and button group
            var minValueFiltered = ui.values[0] != slider.data("range")[0];
            var maxValueFiltered = ui.values[1] != slider.data("range")[1];
            slider.parents(".range-slider").toggleClass("min-filtered", minValueFiltered);
            slider.parents(".range-slider").toggleClass("max-filtered", maxValueFiltered);
            updateButtonGroupState(slider, minValueFiltered || maxValueFiltered);

            // display value below slider
            setSliderDisplayValues(slider, ui.values);
        }
    });

    $(".range-slider-group").on("click", ".btn-group", function () {
        var btnGroup = $(this);

        setTimeout(function () {
            var filterValue = btnGroup.find("input[type=radio]:checked").val();
            if (btnGroup.data("selection") != filterValue) {
                btnGroup.nextAll(".range-slider").toggleClass("hide");
                btnGroup.data("selection", filterValue);
            }
        }, 0);
    });
</script>

</div>
    )
  }
}
