'use strict';

// eslint-disable-next-line no-unused-vars
const config = {
  accessToken:
    'pk.eyJ1IjoiYXJ0ZG95MyIsImEiOiJjbG96bnN4dGEwMmNnMmltajcybzBqYTRrIn0.ZbzBgIBqibfEWXo9j0mUgw',
  CSV: './Sample_Data.csv',
  title: 'Defence Diplomacy Interactive Map Tracker',
  description:
    'The Defence Diplomacy Interactive Map Tracker is a tool designed to provide a dynamic and interactive map experience for tracking defense diplomacy activities in the Pacific.',
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
      listItems: ['Arms control', 'Public Diplomacy', 'Cultural Diplomacy (Defence)', 'Defence Cooperation', 'Defence Infrastructure', 'HADR – Disaster Response', 'Maritime Security', 'Military Exercises', 'Military Medical Diplomacy', 'MIL-POL Engagement', 'Sports Diplomacy (Defence)', 'Training', 'Visit Diplomacy', ], // Case sensitive - must match spreadsheet entry; This will take up to six inputs but is best used with a maximum of three;
    },
  ],
};

