'use strict';

// eslint-disable-next-line no-unused-vars
const config = {
  style: 'mapbox://styles/mapbox/light-v10',
  accessToken:
    'pk.eyJ1IjoiYXJ0ZG95MyIsImEiOiJjbG96bnN4dGEwMmNnMmltajcybzBqYTRrIn0.ZbzBgIBqibfEWXo9j0mUgw',
  CSV: './Sample_Data.csv',
  center: [ 170.4068, -14.9244],
  zoom: 5.5,
  title: 'Defence Diplomacy Interactive Map Tracker',
  description:
    'The Defence Diplomacy Interactive Map Tracker is a beta version web tool designed to provide a dynamic and interactive map experience for tracking defense diplomacy activities in the Pacific.',
  sideBarInfo: ['Diplomacy_category', 'Comments', 'Delivering_Country', 'Receiving_Countries'],
  popupInfo: ['Location_Name'],
  filters: [
    {
      type: 'dropdown',
      title: 'Year: ',
      columnHeader: 'Year', // This should match the exact name of the column in your CSV
      listItems: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'], // List years as strings if they are stored as text in your CSV
    },
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
    },
  ],
};

