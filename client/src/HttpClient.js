export const fetchTiles =(parent, fn) => {
    console.log("fetch tiles");
    const url = "http://localhost:4000/sections";
    fetch(url)
        .then(response => response.json())
        .then(data => fn(parent, data));
}
