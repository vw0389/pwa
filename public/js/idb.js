let db;

const request = indexedDB.open('PWA', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    // save a reference to the database 
    const db = event.target.result;
    // create an object store (table) called `transactions`, set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('transactions', { autoIncrement: true });
  };