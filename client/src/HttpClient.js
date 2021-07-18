import React from "react";

export const fetchSections =(parent, fn) => {
    console.log("fetch sections");
    const url = "http://localhost:4000/sections";
    fetch(url)
        .then(response => response.json())
        .then(data => fn(parent, data));
}
