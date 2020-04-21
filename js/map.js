mapboxgl.accessToken = 'pk.eyJ1IjoicHV1YiIsImEiOiJjazk0bmljZ3gwMWtmM21xcDFoZnBndGVzIn0.z8bgLwWqLseyyFYQifQmVQ';

const animationTime = 10000
const defaultMap = Object.freeze({
  container: 'map',
  style: 'mapbox://styles/puub/ck967v1p41jg71irxyshr8ynu',
  renderWorldCopies: true,
  zoom: 1.5,
  center: [1.5, 14],
  pitch: 20,
})
let untouched = true
let cameraFrame = 0
let maskFrame = 0
let sites = []
let selectedSite = null
let map = new mapboxgl.Map(defaultMap);

function preventCamera() {
  untouched = false
  window.cancelAnimationFrame(cameraFrame)
  map.stop();
}

// CSS is not able to handle gradient animations so here JS will do it instead
function drawMask(timestamp) {
  const mask = document.getElementById("location--mask")
  if (!maskFrame) maskFrame = timestamp;
  let filled = !selectedSite ? 60 + (timestamp - maskFrame) / 10 : 100 - (timestamp - maskFrame) / 10
  mask.style.background = `radial-gradient(circle at center, transparent ${filled}%, black 65%, #171e25 10%)`
  if ((selectedSite && filled >= 60) || !selectedSite && filled <= 100) requestAnimationFrame(drawMask);
  else {
    maskFrame = 0
  }
}
function toggleDetails(value) {
  if (value) document.body.classList.add("details")
  else {
    document.body.classList.remove("details");
    selectedSite = null
    setTimeout(() => {
      rotateCamera(0)
    }, 1500)
  }
  drawMask(0)
  map.resize()

}
function goTo(index) {
  preventCamera();
  const site = sites[index]
  toggleDetails(true)
  setTimeout(() => {
    map.resize()
    map.flyTo({
      zoom: 13,
      pitch: 45,
      center: site.coordinates
    })
  }, 1500)
  selectedSite = index
  fillTab(index)

}

// Slowly move the earth around
function rotateCamera(timestamp) {
  const [x, y] = [(timestamp / 200) % 360, 14]
  map.flyTo({ ...defaultMap, center: [x, y], speed: 3 });
  cameraFrame = requestAnimationFrame(rotateCamera);
}

// Fetch site specs from coordinates
function fetchSiteLocation(site) {
  const [long, lat] = site.coordinates
  return new Promise((resolve) => {
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${mapboxgl.accessToken}`)
      .then(d => (d.json()))
      .then(resolve)
  })
}

function fetchFeatures() {
  fetch("api/sites.json")
    .then(d => (d.json()))
    .then(placeFeatures)
}

function updateDOM(site) {
  const keys = Object.keys(site)
  for (var i in keys) {
    const key = keys[i]
    const el = document.querySelector(`[data-site='${key}']`)
    if (el) el.innerHTML = site[key]
  }
}

// Place markers on map
function placeFeatures(features) {
  sites = features
  for (let i in features) {
    const site = features[i]
    const { coordinates } = site
    const m = document.createElement('div');
    const ring = document.createElement('div');
    const dot = document.createElement('div');
    m.className = 'marker';
    dot.className = 'marker--dot';
    ring.className = 'marker--ring'
    m.appendChild(ring)
    m.appendChild(dot)
    m.addEventListener("click", e => { e.preventDefault(); goTo(i) })
    new mapboxgl.Marker(m)
      .setLngLat(coordinates)
      .addTo(map);
  }
}

// Assign site specs from coordinates
function fillTab(index) {
  const site = sites[index]
  // Check if location data is fetched already
  if (site._fetched) updateDOM(site)
  else {
    fetchSiteLocation(site)
      .then(({ features }) => {
        let inSite = {}
        for (var i in features || {}) {
          const f = features[i]
          if (f) {
            const prop = f["place_type"][0]
            // Assign specs to site
            inSite[prop] = f.text
          }
        }

        // Update values in DOM
        const updatedSite = { ...site, ...inSite, _fetched: true }
        sites[index] = updatedSite
        updateDOM(updatedSite)
      })
  }
}

const zoomIn = document.getElementById("zoom-in")
const zoomOut = document.getElementById("zoom-out")
const goBack = document.getElementById("go-back")

goBack.addEventListener("click", () => toggleDetails(false))
zoomOut.addEventListener("click", () => {
  map.flyTo({ zoom: map.getZoom() - 1 })
})
zoomIn.addEventListener("click", () => {
  map.flyTo({ zoom: map.getZoom() + 1 })
})

// Stop moving animation when user interacts with map
map.on('touchstart', preventCamera)
map.on('mousedown', preventCamera)
map.on('scoll', preventCamera)

map.on('load', function () {
  // Start the animation.
  rotateCamera(0);
  // Get sites after map is loaded
  fetchFeatures()
})