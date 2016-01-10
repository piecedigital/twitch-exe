# Handle Data

This module is here to handle file operations. It contains 3 methods:

* loadConcurrentData - This loads data from a JSON file. This data contains data for the last logged in user such as username and whether they've seen the popup tutorials
* saveConcurrentData - The opposite of the previous method
* saveFile - This is a general file saving method. It differs from the previous method in that the previous method is made to handle JSON data. Rather than uproot everything that I've built up currently I decided to create a separate method so that nothing broke. This method is only handling the application updating