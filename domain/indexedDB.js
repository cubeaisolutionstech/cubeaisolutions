// Open or create a database
var dbName = 'formDataDB';
var dbVersion = 1;
var db;

var request = indexedDB.open(dbName, dbVersion);

request.onerror = function(event) {
    console.log("Database error: " + event.target.errorCode);
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("Database opened successfully");

    // Add event listener for form submission
    document.getElementById('enquiryForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Collect the form data
        var formData = {
            domain: document.getElementById('domain').value,
            fullName: document.getElementById('fullName').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Save the form data to IndexedDB
        saveFormData(formData);
    });
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    console.log("Upgrading database...");

    // Create an object store (like a table in SQL databases)
    var objectStore = db.createObjectStore("formData", { keyPath: "id", autoIncrement: true });

    // Define the schema of the data to be stored
    objectStore.createIndex("domain", "domain", { unique: false });
    objectStore.createIndex("fullName", "fullName", { unique: false });
    objectStore.createIndex("phoneNumber", "phoneNumber", { unique: false });
    objectStore.createIndex("email", "email", { unique: false });
    objectStore.createIndex("message", "message", { unique: false });
};

// Function to save form data to IndexedDB
function saveFormData(formData) {
    var transaction = db.transaction(["formData"], "readwrite");
    var objectStore = transaction.objectStore("formData");

    var request = objectStore.add(formData);

    request.onsuccess = function(event) {
        console.log("Form data saved successfully");
    };

    request.onerror = function(event) {
        console.log("Error saving form data: " + event.target.errorCode);
    };
}
