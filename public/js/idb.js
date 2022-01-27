const VERSION = require('../service-worker');
let db;

const request = indexedDB.open('PWA', VERSION);

request.onupgradeneeded = function (event) {
    const db = event.target.result;

    db.createObjectStore('transaction', { autoIncrement: true });
};

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        uploadTransaction();
    }
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};


function saveRecord(record) {
    const transaction = db.transaction(['transaction'], 'readwrite');

    const transactionObjectStore = transaction.objectStore('transaction');

    transactionObjectStore.add(record);
}

function uploadTransaction() {
    const transaction = db.transaction(['transaction'], 'readwrite');

    const transactionObjectStore = transaction.objectStore('transaction');

    const getAll = transactionObjectStore.getAll();

    getAll.onsuccess = function () {
       
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }

                    const transaction = db.transaction(['transaction'], 'readwrite');

                    const transactionObjectStore = transaction.objectStore('transaction');

                    transactionObjectStore.clear();

                })
                .catch(err => {console.log(err);
                });
        }
    };
}

window.addEventListener('online', uploadTransaction);