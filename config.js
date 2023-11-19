'use strict';

// eslint-disable-next-line no-unused-vars
const config = {
  style: 'mapbox://styles/mapbox/light-v10',
  accessToken:
    'pk.eyJ1IjoiYXJ0ZG95MyIsImEiOiJjbG96bnN4dGEwMmNnMmltajcybzBqYTRrIn0.ZbzBgIBqibfEWXo9j0mUgw',
  CSV: './Sample_Data.csv',
  center: [ 174.4068, -14.9244],
  zoom: 6,
  title: 'Defence Diplomacy Interactive Map Tracker',
  description:
    'Replace with information about your application. Ex. You can search by address to sort the list below by distance. You can also filter the list by language support options, which days a location is open, and whether they have devices to use to complete the survey by phone or online.',
  sideBarInfo: ['Diplomacy_category', 'Comments', 'Delivering_Country', 'Receiving_Countries'],
  popupInfo: ['Location_Name'],
  filters: [
    {
      type: 'dropdown',
      title: 'Delivering Countries: ',
      columnHeader: 'Delivering_Country',
      listItems: [
        'Australia',
        'Canada',
        'China',
        'France',
        'India',
        'Indonesia',
        'Japan',
        'Nepal',
        'New Zealand',
        'Papua New Guinea',
        'United Kingdom',
        'United States of America',      
      ],
    },
    {
      type: 'checkbox',
      title: 'Diplomacy Categories: ',
      columnHeader: 'Diplomacy_category', // Case sensitive - must match spreadsheet entry
      listItems: ['Arms control', 'Cultural Diplomacy (Defence)', 'Defence Cooperation', 'Defence Infrastructure', 'HADR – Disaster Response', 'Maritime Security', 'Military Exercises', 'Military Medical Diplomacy', 'MIL-POL Engagement', 'Sports Diplomacy (Defence)', 'Training', 'Visit Diplomacy', ], // Case sensitive - must match spreadsheet entry; This will take up to six inputs but is best used with a maximum of three;
    },
    {
      type: 'checkbox',
      title: 'Recieving Countries: ',
      columnHeader: 'Receiving_Countries',
      listItems: [
        'Fiji',
        'Papua New Guinea',
        'Samoa',
        'Solomon Islands',
        'Tonga',
        'Vanuatu',
      ],
    },
  ],
};

