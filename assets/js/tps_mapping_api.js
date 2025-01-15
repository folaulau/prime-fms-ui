var apiDomain = 'http://localhost:8092/api';

function getSlins(requestPayload) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: apiDomain+'/slin-current/search',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestPayload),
            success: function(data) {
                // console.log(data);
                resolve(data); // Resolve the promise with the data
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                reject(error); // Reject the promise with the error
            }
        });
    });
}

function updateSlinTpsMapping(requestPayload) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: apiDomain+'/slin-current/add-update',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestPayload),
            success: function(data) {
                // console.log(data);
                resolve(data); // Resolve the promise with the data
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                reject(error); // Reject the promise with the error
            }
        });
    });
}