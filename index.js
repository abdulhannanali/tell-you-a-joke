$(document).ready(function () {
    if (!("Notification" in window)) {
        return alert("Notifications are not available in this browser! Please upgrade to the latest browser!")
    }
    
    var permission = Notification.permission
    var requestPermissionBtn = $("#requestPermission")
    
    if (permission == "granted") {
        startJokesRoutine(permission)
    }
    
    
    requestPermissionBtn.click(function (event) {
        if (permission == "granted") {
            return console.log("Permission's already granted!")
        }
        
        Notification.requestPermission(function (perm) {
            permission = perm
            
            if (permission == "granted") {
                alert("Now you'll receive some really funny jokes from us!")
                startJokesRoutine(permission)
            }
        })
    })
    
    
    function startJokesRoutine (permission) {
        if (permission == "granted") {
            var timeout = 5000
            
            setInterval(function () {
                spawnJoke()
            }, timeout)
        }
        else {
            return;
        }
        
    }

    function spawnJoke () {
        requestJoke()
            .then(function (payload) {
                if (payload && payload.query && payload.query.results && payload.query.results.joke) {
                    spawnNotification(payload.query.results.joke)
                }
            })
    }
    
    
    function spawnNotification (body) {
        if (!body) {
            return
        }
        
        var options = {
            icon: "http://i.imgur.com/nnPsUdy.png",
            body: body 
        }
        
        return new Notification("Joke Ahoy joke!", options)
    }

    function requestJoke () {
        var randomEndpoint = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url=%22https://tambal.azurewebsites.net/joke/random%22&format=json"
        return $.get(randomEndpoint)
    }

})
