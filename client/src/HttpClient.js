export const fetchTiles =(parent, fn) => {
    let host = window.location.host.split(":")[0];
    let url = host;
    if (url === "localhost") {
        url = url + ":4000";
    }
    url = url + "/api/tiles";
    if (!url.startsWith("http")) {
        url = "http://" + url;
    }
    fetch(url)
        .then(response => response.json())
        .then(data => fn(parent, data));
}
