export const fetchTiles =(parent, fn) => {
    let host = window.location.host.split(":")[0];
    let url = host;
    if (url === "localhost") {
        url = url + ":4000";
    }
    url = url + "/tiles";
    if (!url.startsWith("http")) {
        if (!url.startsWith("localhost")) {
            url = "https://" + url;
        } else {
            url = "http://" + url;
        }
    }
    fetch(url, {
        method: 'GET',
        headers: {
            'tile-check': 'check'
        }
    })
        .then(response => response.json())
        .then(data => fn(parent, data));
}

export const submitEmail = (emailStr, parent, fn) => {
    let host = window.location.host.split(":")[0];
    let url = host;
    if (url === "localhost") {
        url = url + ":4000";
    }
    if (!url.startsWith("http")) {
        if (!url.startsWith("localhost")) {
            url = "https://" + url;
        } else {
            url = "http://" + url;
        }
    }

    url = url + "/email";
    let data = JSON.stringify({email: emailStr});

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    })
        .then(response => fn(parent, response));

}