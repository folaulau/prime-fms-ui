var apiDomain = 'http://localhost:8092/api';

function getTableHeadersFromApi() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: apiDomain+'/a1-wad/get-table-headers',
            type: 'GET',
            contentType: 'application/json',
            success: function(data) {
                console.log('data');
                console.log(data);
                resolve(data); // Resolve the promise with the data
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                reject(error); // Reject the promise with the error
            }
        });
    });
}

function getEmployeesWithHoursFromApi(supervisorUid, period) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: apiDomain+'/a1-wad/get-per-period?period='+period+'&supervisorUid='+supervisorUid,
            type: 'GET',
            contentType: 'application/json',
            success: function(data) {
                resolve(data); // Resolve the promise with the data
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                reject(error); // Reject the promise with the error
            }
        });
    });
}


function updateEmployeeHoursFromApi(payload) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: apiDomain+'/a1-wad/update-employee-tps-hours',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function(data) {
                resolve(data); // Resolve the promise with the data
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                reject(error); // Reject the promise with the error
            }
        });
    });
}