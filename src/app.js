// Copyright 2021 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Loader } from '@googlemaps/js-api-loader';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

// function parse() {
//   // Requiring the module
//   const reader = require('xlsx')

//   // Reading our test file
//   const file = reader.readFile('./data.xlsx')

//   let data = []

//   const sheets = file.SheetNames

//   for(let i = 0; i < sheets.length; i++)
//   {
//     const temp = reader.utils.sheet_to_json(
//           file.Sheets[file.SheetNames[i]])
//     let temp_data = []
//     temp.forEach((res) => {
//         temp_data.push(res)
//     })
//     data.push(temp_data)
//   //    if(dat1 => dat1.Activity === "walking"){
//   //     console.log("Walking" + file.SheetNames[i]);
//   // }
//   }

//   for (let i = 0; i < data.length; i++) {
//       console.log("Dev: " + (i + 1));
//       for (let j = 0; j < data[i].length; j++) {
//           console.log(data[i][j]['Latitude'] + " " + data[i][j]['Longitude'] + " " + data[i][j]['Altitude'])
//       }
//       console.log("\n");
//   }

//   x = data[0][0]['Latitude'];
//   console.log(x);

//   // Printing data
//   // console.log(data);
// }

let data =[[52.3719074577595,  4.90526689003245,  -1.39819542712897, 78
],[52.3714335866613,  4.90409851493971,  -1.3085335092803,5781
],[52.3713044566592,  4.9038118290386,  -0.0113110065885346,12785
],[52.3711005552152,  4.90411241094314,  -0.435420847930456,17636
],[52.3708876449937,  4.90427729624819,  0.847999421928209,23971
], [52.3706592709929,  4.90416842424938,  0.737749414369133,29769
],[52.3703643529528,  4.90450047223958,  0.666605798597992,34521
],[52.3705929507105,  4.90573079854871,  0.692590480530808,40818
]]

const apiOptions = {
  apiKey: 'AIzaSyDmC0GSgGe30WaE3gb0ZFBOx5fASU_Fsgg',
  version: "beta"
};

const mapOptions = {
  "tilt": 0,
  "heading": 0,
  "zoom": 18,
  "center": { lat: 52.37190746, lng: 4.90526689, altitude: -1.398195427 },
  "mapId": "ff209e7685a5fefa"    
}

async function initMap() {    
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();
  return new google.maps.Map(mapDiv, mapOptions);
}

function initWebGLOverlayView(map) {  
  let scene, renderer, camera, loader;

  //parse();

  const webGLOverlayView = new google.maps.WebGLOverlayView();
  
  webGLOverlayView.onAdd = () => {   
    // set up the scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 ); // soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0.5, -1, 0.5);
    scene.add(directionalLight);
  
    // load the model    
    loader = new GLTFLoader();               
    const source = "test.gltf";
    loader.load(
      source,
      gltf => {      
        gltf.scene.scale.set(15,15,15);
        gltf.scene.rotation.x = 90 * Math.PI/180; // rotations are in radians
        scene.add(gltf.scene);   
        const model = gltf.scene;

        for (let i = 0; i < data.length - 1; i++) {
            let fromlat = data[i][0];
            let fromlng = data[i][1];
            let fromalt = data[i][2]; 
            let fromTime = data[i][3];
            let tolat = data[i + 1][0];
            let tolng = data[i + 1][1];
            let toalt = data[i + 1][2];
            let toTime = data[i + 1][3];
            mapOptions.center.lat = fromlat;
            mapOptions.center.lng = fromlng;
            mapOptions.center.altitude = fromalt;
            let dlat = (tolat - mapOptions.center.lat) / 100;
            let dlng = (tolng - mapOptions.center.lng) / 100;
            let dalt = (toalt - mapOptions.center.altitude) / 100;
            let dt = (toTime - fromTime) / 100;
            for(let count = fromTime; count <= toTime; count += dt){
              setTimeout(() => {
                //scene.add(gltf.scene);
                mapOptions.center.lat += dlat;
                mapOptions.center.lng += dlng;
                mapOptions.center.altitude += dalt;
              }, count);
            }
        }

        //let lat2 = 52.3714335866613, lon2 = 4.90409851493971, altitude2 = -1.398195427;
        
        

      }

    );


  }
  
  webGLOverlayView.onContextRestored = ({gl}) => {    
    // create the three.js renderer, using the
    // maps's WebGL rendering context.
    renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes()
    });
    renderer.autoClear = false;

    // wait to move the camera until the 3D model loads    
    // loader.manager.onLoad = () => {     
    //   renderer.setAnimationLoop(() => {
    //     map.moveCamera({
    //       "tilt": mapOptions.tilt,
    //       "heading": mapOptions.heading,
    //       "zoom": mapOptions.zoom
    //     });    
        
    //     // rotate the map 360 degrees 
    //     if (mapOptions.tilt < 67.5) {
    //       mapOptions.tilt += 0.5
    //     } else if (mapOptions.heading <= 360) {
    //       mapOptions.heading += 0.2;
    //     } else {
    //       renderer.setAnimationLoop(null)
    //     }
    //   }); 

      

    // }
  }

  webGLOverlayView.onDraw = ({gl, transformer}) => {
    // update camera matrix to ensure the model is georeferenced correctly on the map
    const latLngAltitudeLiteral = {
        lat: mapOptions.center.lat,
        lng: mapOptions.center.lng,
        altitude: mapOptions.center.altitude
    }

    const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);
  
    webGLOverlayView.requestRedraw();  

    

    renderer.render(scene, camera); 

    // always reset the GL state
    renderer.resetState();
  }
  webGLOverlayView.setMap(map);
}

(async () => {        
  const map = await initMap();
  initWebGLOverlayView(map);    
})();