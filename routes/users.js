function getdata(){
    var url = 'http://localhost:3000/users'
    fetch(url, {
            method: 'GET',
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
        })
}

getdata()