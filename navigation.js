let buttonhome = document.getElementById("linkhome")
let buttonabout = document.getElementById("linkabout")

buttonhome.addEventListener("mousedown", () => {
    window.location.href = 'index.html'
})

buttonabout.addEventListener("mousedown", () => {
    window.location.href = 'about.html'
})