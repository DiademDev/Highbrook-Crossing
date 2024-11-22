// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4Zjk5N2RlYS0zMGY2LTQxNWQtYjAwMy1iYWUyODI4ODY5YTUiLCJpZCI6MTE3OTUzLCJpYXQiOjE2NzA3Mzk4MTl9.k3I9be0G6cm7S9-U3lYsvSaUZ6mKVf0Capzojy3RZAU";
Cesium.GoogleMaps.defaultApiKey = "AIzaSyA1au3L6n6ZZvFqojyNMfB27DiGHLAX7h8";

async function main() {

    const viewer = new Cesium.Viewer("cesiumContainer", {
  //-----------------------------------------------------  This can be turned off when using Google 3D tiles ----------------------------------------------------------//
      //terrain: Cesium.Terrain.fromWorldTerrain(),
  //----------------------------------------------------------------------------  *** ---------------------------------------------------------------------------------//
      timeline: false,
      geocoder: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      baseLayerPicker: false,
      animation: false,
      searchButton: false,
      homeButton: false,
      infoBox: false
    });

      // Add Photorealistic 3D Tiles
    try {
      const tileset = await Cesium.createGooglePhotorealistic3DTileset();
      viewer.scene.primitives.add(tileset);
    } catch (error) {
      console.log(`Error loading Photorealistic 3D Tiles tileset.\n${error}`);
    }

  //-----------------------------------------------------  Make false when using Google 3D tiles ----------------------------------------------------------//
    viewer.scene.globe.show = false;   
  //----------------------------------------------------------------------------  *** ---------------------------------------------------------------------------------//

  // Remove Cesium logo
  viewer._cesiumWidget._creditContainer.style.display = "none";

  // Import data source file
  const dataSourcePromise = Cesium.CzmlDataSource.load("data.czml");
  viewer.dataSources.add(dataSourcePromise);

  // Create a custom InfoBox in javascript
  const container = document.getElementById("cesiumContainer");
  const infoBox = document.createElement("div");
  const topDiv = document.createElement("div");
  const botDiv = document.createElement("div");
  const rightDiv = document.createElement("div");
  topDiv.classList.add("top-div");
  botDiv.classList.add("bot-div");
  rightDiv.classList.add("rightSide-div")
  infoBox.classList.add("custom-infobox");
  infoBox.appendChild(topDiv);
  infoBox.appendChild(botDiv);
  infoBox.appendChild(rightDiv);
  container.appendChild(infoBox);

  var introWindow = document.getElementById("introWindow");
  introWindow.style.display = "block";
  
  setTimeout(function() {
    introWindow.style.opacity = "0";
  }, 8000);
  
  setTimeout(function() {
    introWindow.parentNode.removeChild(introWindow);
  }, 9000);

  // Custom infoBox logic
  viewer.selectedEntityChanged.addEventListener((selectedEntity) => {

    if (selectedEntity === undefined || selectedEntity.name === "TamakiModel") {
      // No entity is currently selected or TamakiModel entity is selected
      if (infoBox.classList.contains("open")) {
        infoBox.classList.remove("open");
        infoBox.classList.add("close");
      }
    } else if (selectedEntity instanceof Cesium.Entity) {
      // An entity has been selected
      if (infoBox.classList.contains("close")) {
        infoBox.classList.remove("close");
        infoBox.classList.add("open");
      } else if (infoBox.classList.contains("open")) {
        // Close the infoBox first before reopening it with updated information
        infoBox.classList.remove("open");
        infoBox.classList.add("close");
        setTimeout(() => {
          infoBox.classList.remove("close");
          infoBox.classList.add("open");

          // Split Description into parts
          var description = selectedEntity.description.getValue();
          var parts = description.split("<hr>");
          topDiv.innerHTML = parts[0];
          botDiv.innerHTML = parts[1];
          rightDiv.innerHTML = parts[2];
        }, 300);
        return;
      } else {
        infoBox.classList.add("open");
      }
        var description = selectedEntity.description.getValue();
        var parts = description.split("<hr>");
        topDiv.innerHTML = parts[0];
        botDiv.innerHTML = parts[1];
        rightDiv.innerHTML = parts[2];
    }
  });

  infoBox.addEventListener('click', (event) => {

    if (event.target === infoBox) {
        console.log("YES")
    }
  });

  viewer.scene.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      174.87538832207514,
      -36.93991675301348,
      200
    ),
    orientation: {
      heading: 6.104934316525467,
      pitch: -0.5044789242504364,
      roll: 0.000006232633681158006
    }
  });

  async function createModel(id) {

    // Remove existing model tilesets
    
    addedTilesets.forEach((tileset) => {
      viewer.scene.primitives.remove(tileset);
    });
    addedTilesets.length = 0;

    try {
      const tileset = new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(id),
      });

      viewer.scene.primitives.add(tileset);
      addedTilesets.push(tileset);

    } catch (error) {
      console.log(error);
    }
  }

  createModel(2855330);

  // Console log out cameras coordinates as well as HeadingPitchRoll in radians
  // viewer.scene.postUpdate.addEventListener(function() {
  //   var camera = viewer.scene.camera;
  //   var headingPitchRoll = new Cesium.HeadingPitchRoll(camera.heading, camera.pitch, camera.roll);
  
  //   var ellipsoid = viewer.scene.globe.ellipsoid;
  
  //   var cartesian = camera.positionWC;
  //   var cartographic = ellipsoid.cartesianToCartographic(cartesian);
    
  //   var longitude = Cesium.Math.toDegrees(cartographic.longitude);
  //   var latitude = Cesium.Math.toDegrees(cartographic.latitude);
  
  //   console.log("Longitude: " + longitude + ", Latitude: " + latitude);
  //   console.log(headingPitchRoll);
  // });

}

main();




/* CODE SNIPPETS


// Console log out cameras coordinates as well as HeadingPitchRoll in radians
  viewer.scene.postUpdate.addEventListener(function() {
  var camera = viewer.scene.camera;
  var headingPitchRoll = new Cesium.HeadingPitchRoll(camera.heading, camera.pitch, camera.roll);

  var ellipsoid = viewer.scene.globe.ellipsoid;

  var cartesian = camera.positionWC;
  var cartographic = ellipsoid.cartesianToCartographic(cartesian);
  
  var longitude = Cesium.Math.toDegrees(cartographic.longitude);
  var latitude = Cesium.Math.toDegrees(cartographic.latitude);

  console.log("Longitude: " + longitude + ", Latitude: " + latitude);
  console.log(headingPitchRoll);
});




-36.89072172745562, 174.85554813871818

// Create a Viewer with terrain - remove widgets
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: Cesium.createWorldTerrain(),
  timeline: false,
  geocoder: false,
  sceneModePicker: false,
  navigationHelpButton: false,
  baseLayerPicker: false,
  animation: false,
  searchButton: false,
  homeButton: false,
  infoBox: false
});

// // Load building model
// (async () => {
//   "use strict";
//   try {
//     const resource = await Cesium.IonResource.fromAssetId(1599421);
//     const position = Cesium.Cartesian3.fromDegrees(174.85545, -36.890315, 59.4);
//     const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(-219.63, -0.05, -0.01));
//     const entity = viewer.entities.add({
//       name: "TamakiModel",
//       position: position,
//       orientation: orientation,
//       description: "Tamaki Business Estate",
//       model: {
//         uri: resource,
//         scale: 7.0
//       },
//     });

//   viewer.trackedEntity = entity;
//   } catch (error) {
//     console.log(error);
// }
  
// })();

*/

