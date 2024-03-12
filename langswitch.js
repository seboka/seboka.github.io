// get the button element by its ID
const languageButton = document.getElementById('butt');

//console.log(document.getElementById('eychteeemel'))
let currentLanguage = document.documentElement.getAttribute("lang");

// fetch the JSON file that contains the language data
let jsons;
let pagejson = document.getElementById("langtext").getAttribute("href")
let globaljson = "global.json"
jsons = [globaljson, pagejson]

for (let i in jsons){
fetch(jsons[i])
    .then(response => response.json())
    .then(data => {
        // update the text on the page with the initial language
        //console.log(data)
        updateText(data[currentLanguage]);
        jsons[i]=data

        // add a click event listener to the button
    });
}


languageButton.addEventListener('click', () => {
    // toggle the language between English and Esperanto
    currentLanguage = currentLanguage === 'en' ? 'eo' : 'en';
    flag = document.getElementById("langimg")
    flag.src = `flag_${currentLanguage}.png`
    document.documentElement.setAttribute("lang", currentLanguage)
    // update the text on the page with the new language

    for (let j in jsons) {
        //console.log("now trying to switch using", jsons[j])
        updateText(jsons[j][currentLanguage]);
    }
});


function updateText(data) {
    //console.log(data)
    const elements = document.querySelectorAll("[data-translate]");
    //console.log("elements:", elements);
    elements.forEach((element) => {
        const key = element.getAttribute("data-translate");
        //console.log("key:", key);
        if (data.hasOwnProperty(key)){
            const textData = data[key];
            //console.log("textData:", textData);
            if (Array.isArray(textData)) {
                element.innerHTML = "";
                textData.forEach((segment) => {
                    if (typeof segment === "string") {
                        element.appendChild(document.createTextNode(segment));
                    } else if (typeof segment === "object") {
                        //console.log("segment:",segment)
                        const modElement = document.createElement(segment.type);
                        modElement.textContent = segment.text;
                        var count = Object.keys(segment).length;
                        for (let i in segment){
                            //console.log("i:",i)
                            //console.log("segment[i]:",segment[i])
                            if (segment[i] != segment.type && segment[i] != segment.text){
                                modElement.setAttribute(i, segment[i])
                            }
                        }
                        element.appendChild(modElement);
                    }
                });
            } else {
                element.textContent = textData;
            }
        }
    });
}