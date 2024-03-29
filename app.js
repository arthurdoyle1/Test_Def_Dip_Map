/* global config csv2geojson turf Assembly $ */
'use strict';

mapboxgl.accessToken = config.accessToken;
const columnHeaders = config.sideBarInfo;

let geojsonData = {};
const filteredGeojson = {
  type: 'FeatureCollection',
  features: [],
};

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/bright-v8',
    center: [ 179.414413, -16.578193],
    zoom: 4.2,
    pitch: 50, // pitch in degrees
    bearing: 0, // bearing in degrees
  
  transformRequest: transformRequest,
});

function flyToLocation(currentFeature) {
  map.flyTo({
    center: currentFeature,
    zoom: 11.5,
  });
}

function createPopup(currentFeature) {
  const popups = document.getElementsByClassName('mapboxgl-popup');
  if (popups[0] && popups[0] !== activePopup) popups[0].remove();

  const popupContent = document.createElement('div');

  // Heading line
  const headingBox = document.createElement('div');
  const popupHeading = currentFeature.properties['Diplomacy_category']; // Replace 'heading' with the actual property name
  headingBox.innerHTML = '<h2 style="font-weight: bold;">' + (popupHeading || 'Default Heading') + '</h2>';
  headingBox.style.borderBottom = '1px solid #ccc'; // Adding a bottom border
  headingBox.style.paddingBottom = '10px'; // Adding padding
  popupContent.appendChild(headingBox);

  // Description line
  const descriptionBox = document.createElement('div');
  const popupDescription = currentFeature.properties['Comments']; // Replace 'description' with the actual property name
  descriptionBox.innerHTML = '<p>' + (popupDescription || 'Default Description') + '</p>';
  descriptionBox.style.borderBottom = '1px solid #ccc'; // Adding a bottom border
  descriptionBox.style.paddingBottom = '10px'; // Adding padding
  popupContent.appendChild(descriptionBox);

  // Three sets of two boxes on a line
  const categoryBox1 = document.createElement('div');
  const category1 = currentFeature.properties['Delivering_Country']; // Replace 'category1' with the actual property name
  categoryBox1.innerHTML = '<p><strong>Delivering Country</strong> ' + category1 + '</p>';
  categoryBox1.style.borderBottom = '1px solid #ccc'; // Adding a bottom border
  popupContent.appendChild(categoryBox1);

  const categoryBox2 = document.createElement('div');
  const category2 = currentFeature.properties['Receiving_Countries']; // Replace 'category2' with the actual property name
  categoryBox2.innerHTML = '<p><strong>Receiving Country</strong> ' + category2 + '</p>';
  categoryBox2.style.borderBottom = '1px solid #ccc'; // Adding a bottom border
  popupContent.appendChild(categoryBox2);

// Final description box as a hyperlink
const finalDescriptionBox = document.createElement('div');
const finalDescription = currentFeature.properties['Source']; // Replace 'finalDescription' with the actual property name
const finalDescriptionLink = currentFeature.properties['Source']; // Replace 'finalDescriptionLink' with the actual property name

if (finalDescriptionLink !== undefined && finalDescriptionLink !== null) {
  // Create a button instead of a hyperlink
  const sourceButton = document.createElement('button');
  sourceButton.innerText = 'Source';
  sourceButton.onclick = function() {
    window.open(finalDescriptionLink, '_blank');
  };
  sourceButton.style.textDecoration = 'underline';
  sourceButton.style.color = 'blue';
  sourceButton.style.backgroundColor = 'transparent';
  sourceButton.style.border = 'none';
  sourceButton.style.cursor = 'pointer';
  sourceButton.style.padding = '0';
  sourceButton.style.margin = '0';

  finalDescriptionBox.appendChild(sourceButton);
  finalDescriptionBox.style.borderBottom = '1px solid #ccc'; // Adding a bottom border
  finalDescriptionBox.style.paddingBottom = '10px'; // Adding padding
  popupContent.appendChild(finalDescriptionBox);
}

// Styling for the popup content
popupContent.style.border = '1px solid #ccc'; // Adding an overall border
popupContent.style.padding = '10px'; // Adding padding
popupContent.style.width = 'auto'; // Adjust the width as needed
popupContent.style.height = 'auto'; // Adjust the height as needed

new mapboxgl.Popup({ closeOnClick: true })
  .setLngLat(currentFeature.geometry.coordinates)
  .setDOMContent(popupContent)
  .addTo(map);

}





function buildLocationList(locationData) {
  /* Add a new listing section to the sidebar. */
  const listings = document.getElementById('listings');
  listings.innerHTML = '';
  locationData.features.forEach((location, i) => {
    const prop = location.properties;

    const listing = listings.appendChild(document.createElement('div'));
    /* Assign a unique `id` to the listing. */
    listing.id = 'listing-' + prop.id;

    /* Assign the `item` class to each listing for styling. */
    listing.className = 'item';

    /* Add the link to the individual listing created above. */
    const link = listing.appendChild(document.createElement('button'));
    link.className = 'title';
    link.id = 'link-' + prop.id;
    link.innerHTML =
      '<p style="line-height: 1.25">' + prop[columnHeaders[0]] + '</p>';

    /* Add details to the individual listing. */
    const details = listing.appendChild(document.createElement('div'));
    details.className = 'content';

    for (let i = 1; i < columnHeaders.length; i++) {
      const div = document.createElement('div');
      div.innerText += prop[columnHeaders[i]];
      div.className;
      details.appendChild(div);
    }

    link.addEventListener('click', function () {
      const clickedListing = location.geometry.coordinates;
      flyToLocation(clickedListing);
      createPopup(location);

      const activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      this.parentNode.classList.add('active');

      const divList = document.querySelectorAll('.content');
      const divCount = divList.length;
      for (i = 0; i < divCount; i++) {
        divList[i].style.maxHeight = null;
      }

      for (let i = 0; i < geojsonData.features.length; i++) {
        this.parentNode.classList.remove('active');
        this.classList.toggle('active');
        const content = this.nextElementSibling;
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      }
    });
  });
}

// Build dropdown list function
// title - the name or 'category' of the selection e.g. 'Languages: '
// defaultValue - the default option for the dropdown list
// listItems - the array of filter items

function buildDropDownList(title, listItems) {
  const filtersDiv = document.getElementById('filters');
  const mainDiv = document.createElement('div');
  const filterTitle = document.createElement('h3');
  filterTitle.innerText = title;
  filterTitle.classList.add('py12', 'txt-bold');
  mainDiv.appendChild(filterTitle);

  const selectContainer = document.createElement('div');
  selectContainer.classList.add('select-container', 'center');

  const dropDown = document.createElement('select');
  dropDown.classList.add('select', 'filter-option');

  const selectArrow = document.createElement('div');
  selectArrow.classList.add('select-arrow');

  const firstOption = document.createElement('option');

  dropDown.appendChild(firstOption);
  selectContainer.appendChild(dropDown);
  selectContainer.appendChild(selectArrow);
  mainDiv.appendChild(selectContainer);

  for (let i = 0; i < listItems.length; i++) {
    const opt = listItems[i];
    const el1 = document.createElement('option');
    el1.textContent = opt;
    el1.value = opt;
    dropDown.appendChild(el1);
  }
  filtersDiv.appendChild(mainDiv);
}

// Build checkbox function
// title - the name or 'category' of the selection e.g. 'Languages: '
// listItems - the array of filter items
// To DO: Clean up code - for every third checkbox, create a div and append new checkboxes to it

function buildCheckbox(title, listItems) {
  const filtersDiv = document.getElementById('filters');
  const mainDiv = document.createElement('div');
  const filterTitle = document.createElement('div');
  const formatcontainer = document.createElement('div');
  filterTitle.classList.add('center', 'flex-parent', 'py12', 'txt-bold');
  formatcontainer.classList.add(
    'center',
    'flex-parent',
    'flex-parent--column',
    'px3',
    'flex-parent--space-between-main',
  );
  const secondLine = document.createElement('div');
  secondLine.classList.add(
    'center',
    'flex-parent',
    'py12',
    'px3',
    'flex-parent--space-between-main',
  );
  filterTitle.innerText = title;
  mainDiv.appendChild(filterTitle);
  mainDiv.appendChild(formatcontainer);

  for (let i = 0; i < listItems.length; i++) {
    const container = document.createElement('label');

    container.classList.add('checkbox-container');

    const input = document.createElement('input');
    input.classList.add('px12', 'filter-option');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', listItems[i]);
    input.setAttribute('value', listItems[i]);

    const checkboxDiv = document.createElement('div');
    const inputValue = document.createElement('p');
    inputValue.innerText = listItems[i];
    checkboxDiv.classList.add('checkbox', 'mr6');
    checkboxDiv.appendChild(Assembly.createIcon('check'));

    container.appendChild(input);
    container.appendChild(checkboxDiv);
    container.appendChild(inputValue);

    formatcontainer.appendChild(container);
  }
  filtersDiv.appendChild(mainDiv);
}

const selectFilters = [];
const checkboxFilters = [];

function createFilterObject(filterSettings) {
  filterSettings.forEach((filter) => {
    if (filter.type === 'checkbox') {
      const keyValues = {};
      Object.assign(keyValues, {
        header: filter.columnHeader,
        value: filter.listItems,
      });
      checkboxFilters.push(keyValues);
    }
    if (filter.type === 'dropdown') {
      const keyValues = {};
      Object.assign(keyValues, {
        header: filter.columnHeader,
        value: filter.listItems,
      });
      selectFilters.push(keyValues);
    }
  });
}

function applyFilters() {
  const filterForm = document.getElementById('filters');

  filterForm.addEventListener('change', function () {
    const filterOptionHTML = this.getElementsByClassName('filter-option');
    const filterOption = [].slice.call(filterOptionHTML);

    const geojSelectFilters = [];
    const geojCheckboxFilters = [];

    filteredGeojson.features = [];
    // const filteredFeatures = [];
    // filteredGeojson.features = [];

    filterOption.forEach((filter) => {
      if (filter.type === 'checkbox' && filter.checked) {
        checkboxFilters.forEach((objs) => {
          Object.entries(objs).forEach(([, value]) => {
            if (value.includes(filter.value)) {
              const geojFilter = [objs.header, filter.value];
              geojCheckboxFilters.push(geojFilter);
              if (filter.id === 'Broad' && !filter.checked) {
                // Filter out data with 'Broad' category when the checkbox is unchecked
                filteredGeojson.features = filteredGeojson.features.filter(feature => 
                  feature.properties.Colour !== 'Broad'
                );
              }}
          
          });
        });
      }
      if (filter.type === 'select-one' && filter.value) {
        selectFilters.forEach((objs) => {
          Object.entries(objs).forEach(([, value]) => {
            if (value.includes(filter.value)) {
              const geojFilter = [objs.header, filter.value];
              geojSelectFilters.push(geojFilter);
            }
          });
        });
      }
    });

    if (geojCheckboxFilters.length === 0 && geojSelectFilters.length === 0) {
      geojsonData.features.forEach((feature) => {
        filteredGeojson.features.push(feature);
      });
    } else if (geojCheckboxFilters.length > 0) {
      geojCheckboxFilters.forEach((filter) => {
        geojsonData.features.forEach((feature) => {
          if (feature.properties[filter[0]].includes(filter[1])) {
            if (
              filteredGeojson.features.filter(
                (f) => f.properties.id === feature.properties.id,
              ).length === 0
            ) {
              filteredGeojson.features.push(feature);
            }
          }
        });
      });
      if (geojSelectFilters.length > 0) {
        const removeIds = [];
        filteredGeojson.features.forEach((feature) => {
          let selected = true;
          geojSelectFilters.forEach((filter) => {
            if (
              feature.properties[filter[0]].indexOf(filter[1]) < 0 &&
              selected === true
            ) {
              selected = false;
              removeIds.push(feature.properties.id);
            } else if (selected === false) {
              removeIds.push(feature.properties.id);
            }
          });
        });
        let uniqueRemoveIds = [...new Set(removeIds)];
        uniqueRemoveIds.forEach(function (id) {
          const idx = filteredGeojson.features.findIndex(
            (f) => f.properties.id === id,
          );
          filteredGeojson.features.splice(idx, 1);
        });
      }
    } else {
      geojsonData.features.forEach((feature) => {
        let selected = true;
        geojSelectFilters.forEach((filter) => {
          if (
            !feature.properties[filter[0]].includes(filter[1]) &&
            selected === true
          ) {
            selected = false;
          }
        });
        if (
          selected === true &&
          filteredGeojson.features.filter(
            (f) => f.properties.id === feature.properties.id,
          ).length === 0
        ) {
          filteredGeojson.features.push(feature);
        }
      });
    }

    map.getSource('locationData').setData(filteredGeojson);
    buildLocationList(filteredGeojson);
  });
}

function filters(filterSettings) {
  filterSettings.forEach((filter) => {
    if (filter.type === 'checkbox') {
      buildCheckbox(filter.title, filter.listItems);
    } else if (filter.type === 'dropdown') {
      buildDropDownList(filter.title, filter.listItems);
    }
  });
}

function removeFilters() {
  const input = document.getElementsByTagName('input');
  const select = document.getElementsByTagName('select');
  const selectOption = [].slice.call(select);
  const checkboxOption = [].slice.call(input);
  filteredGeojson.features = [];
  checkboxOption.forEach((checkbox) => {
    if (checkbox.type === 'checkbox' && checkbox.checked === true) {
      checkbox.checked = false;
    }
  });

  selectOption.forEach((option) => {
    option.selectedIndex = 0;
  });

  map.getSource('locationData').setData(geojsonData);
  buildLocationList(geojsonData);
}

function removeFiltersButton() {
  const removeFilter = document.getElementById('removeFilters');
  removeFilter.addEventListener('click', () => {
    removeFilters();
  });
}

createFilterObject(config.filters);
applyFilters();
filters(config.filters);
removeFiltersButton();

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: true, // Use the geocoder's default marker style
  zoom: 11,
});

function sortByDistance(selectedPoint) {
  const options = { units: 'miles' };
  let data;
  if (filteredGeojson.features.length > 0) {
    data = filteredGeojson;
  } else {
    data = geojsonData;
  }
  data.features.forEach((data) => {
    Object.defineProperty(data.properties, 'distance', {
      value: turf.distance(selectedPoint, data.geometry, options),
      writable: true,
      enumerable: true,
      configurable: true,
    });
  });

  data.features.sort((a, b) => {
    if (a.properties.distance > b.properties.distance) {
      return 1;
    }
    if (a.properties.distance < b.properties.distance) {
      return -1;
    }
    return 0; // a must be equal to b
  });
  const listings = document.getElementById('listings');
  while (listings.firstChild) {
    listings.removeChild(listings.firstChild);
  }
  buildLocationList(data);
}


const iconMapping = {
  'Visit Diplomacy (Defence)': 'Icons/VISIT.PNG',
  'Military Medical Diplomacy': 'Icons/MILITARYMEDICAL.PNG',
  'Training': 'Icons/TRAINING.PNG',
  'Cultural Diplomacy (Defence)': 'Icons/CULTURAL.png',
  'Sports Diplomacy (Defence)': 'Icons/SPORTS.PNG',
  'HADR – Disaster Response': 'Icons/HUMANITARIAN.PNG',
  'Defence Cooperation': 'Icons/DEFENCECOOP.PNG',
  'Military Exercises': 'Icons/MILITARY.PNG',
  'MIL-POL Engagement': 'Icons/MILPOL.PNG',
  'Arms control': 'Icons/ARMS.png',
  'Public Diplomacy': 'Icons/PUBLIC.png',
  'Maritime Security': 'Icons/MARITIME.png',
  'Defence Infrastructure': 'Icons/DEFENCEINFRASTRUCTURE.PNG'
  
  

};

function loadIcons() {
  Object.keys(iconMapping).forEach(function(category) {
    map.loadImage(iconMapping[category], function(error, image) {
      if (error) throw error;
      map.addImage(category, image);
    });
  });
} 

map.on('load', function() {
  loadIcons();
  // csv2geojson - following the Sheet Mapper tutorial https://www.mapbox.com/impact-tools/sheet-mapper
  console.log('loaded');
  $(document).ready(() => {
    console.log('ready');
    $.ajax({
      type: 'GET',
      url: config.CSV,
      dataType: 'text',
      success: function (csvData) {
        makeGeoJSON(csvData);
      },
      error: function (request, status, error) {
        console.log(request);
        console.log(status);
        console.log(error);
      },
    });
  });
  
  
  function makeGeoJSON(csvData) {
  csv2geojson.csv2geojson(
    csvData,
    {
      latfield: 'Latitude',
      lonfield: 'Longitude',
      delimiter: ',',
    },
    (err, data) => {
      data.features.forEach((data, i) => {
        data.properties.id = i;
        // Add the "Year" property to each feature's properties
        data.properties.Year = parseInt(data.properties.Year);
      });

      geojsonData = data;
      // Add the layer to the map
      map.addLayer({
        id: 'locationData',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: geojsonData
        },
        layout: {
          'icon-image': ['match', ['get', 'Diplomacy_category'], 
          'Visit Diplomacy (Defence)', 'Visit Diplomacy (Defence)',
          'Military Medical Diplomacy', 'Military Medical Diplomacy',
          'Training', 'Training',
          'Cultural Diplomacy (Defence)', 'Cultural Diplomacy (Defence)',
          'Sports Diplomacy (Defence)', 'Sports Diplomacy (Defence)',
          'HADR – Disaster Response', 'HADR – Disaster Response',
          'Defence Cooperation', 'Defence Cooperation',
          'Military Exercises', 'Military Exercises',
          'MIL-POL Engagement', 'MIL-POL Engagement',
          'Arms control', 'Arms control',
          'Public Diplomacy', 'Public Diplomacy',
          'Maritime Security', 'Maritime Security',
          'Defence Infrastructure', 'Defence Infrastructure',
                         // ... add all categories here
                         'default-icon'], // Fallback icon
                         'icon-size': .4, // Adjust the size as needed
                         'icon-allow-overlap': true, // Allow icons to overlap
                         'icon-opacity': 0.9 // Adjust icon opacity (0 to 1)
        }
      });
    });

  let activePopup = null;

  map.on('click', () => {
    activePopup = null;
  });
  

  map.on('click', 'locationData', (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['locationData'] });
    if (!features.length) return;
    const clickedFeature = features[0];
    createPopup(clickedFeature);
    activePopup = document.getElementsByClassName('mapboxgl-popup')[0];
  });
  

    map.on('mouseenter', 'locationData', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['locationData'] });
      if (!features.length) return;
      const hoveredFeature = features[0];
      createPopup(hoveredFeature);
    });
    
   
    map.on('mouseleave', 'locationData', () => {
      if (!activePopup) {
        const popups = document.getElementsByClassName('mapboxgl-popup');
        if (popups[0]) popups[0].remove();
      }
    });
    
 
    map.on('mouseenter', 'locationData', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'locationData', () => {
      map.getCanvas().style.cursor = '';
    });
    buildLocationList(geojsonData);
  }
});

// Modal - popup for filtering results
const filterResults = document.getElementById('filterResults');
const exitButton = document.getElementById('removeFilters2');
const modal = document.getElementById('modal');

filterResults.addEventListener('click', () => {
  modal.classList.remove('hide-visually');
  modal.classList.add('z5');
});

exitButton.addEventListener('click', () => {
  modal.classList.add('hide-visually');
});

const title = document.getElementById('title');
title.innerText = config.title;
const description = document.getElementById('description');
description.innerText = config.description;

function transformRequest(url) {
  const isMapboxRequest =
    url.slice(8, 22) === 'api.mapbox.com' ||
    url.slice(10, 26) === 'tiles.mapbox.com';
  return {
    url: isMapboxRequest ? url.replace('?', '?pluginName=finder&') : url,
  };
}

document.getElementById('slider').addEventListener('input', (event) => {
  const year = parseInt(event.target.value);
  document.getElementById('active-year').innerText = year;
  map.setFilter('locationData', ['==', ['number', ['get', 'Year']], year]);
});

document.getElementById('show-all-years').addEventListener('change', (event) => {
  const year = parseInt(document.getElementById('slider').value);
  const showAllYears = event.target.checked;
  document.getElementById('active-year').innerText = showAllYears ? 'All Years' : year;
  map.setFilter('locationData', showAllYears ? null : ['==', ['number', ['get', 'Year']], year]);
});

document.getElementById('helpButton').addEventListener('click', function() {
  document.getElementById('helpManual').style.display = 'block';
});

document.getElementById('closeHelp').addEventListener('click', function() {
  document.getElementById('helpManual').style.display = 'none';
});

document.getElementById('legendButton').addEventListener('click', function() {
  document.getElementById('legendManual').style.display = 'block';
});

document.getElementById('closeLegend').addEventListener('click', function() {
  document.getElementById('legendManual').style.display = 'none';
});


const broadCheckbox = document.getElementById('Broad'); // Assuming the checkbox has an ID of 'Broad'

broadCheckbox.addEventListener('change', function () {
  applyFilters(); // Call the applyFilters function to filter the data
});
