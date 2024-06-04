

var map = null;
var overlay = null;
var closer = null;
var mode_creation = false;

document.addEventListener('DOMContentLoaded', function() {   
  init();
  if (document.querySelector('#nav_item_create') !== null)
     document.querySelector('#nav_item_create').addEventListener('click', () => create_complaint()); 
});

function init()
{
  var attribution = new ol.control.Attribution({
    collapsible: false
  });

  // start map
  map = new ol.Map({
    controls: ol.control.defaults({ attribution: false }).extend([attribution]),
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    target: document.getElementById('map'),
    loadTilesWhileAnimating: true,
    view: new ol.View({
        center: ol.proj.fromLonLat([-71.1165755310875, 42.37701265008309]),
        maxZoom: 18,
        zoom: 12
    })
  });


  var container = document.getElementById('popup');
  var content = document.getElementById('popup-content');
  closer = document.getElementById('popup-closer');

  overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
  });
  map.addOverlay(overlay);

  closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

  map.on('click', function(event) {
    map.forEachFeatureAtPixel(event.pixel, async function(feature, layer) {
      if (map.hasFeatureAtPixel(event.pixel) === true) {
        
        var coordinate = event.coordinate;
        html = await load_complaints_info(feature.values_.id);
        content.innerHTML = html;
        overlay.setPosition(coordinate);
       
        document.querySelectorAll('#btn_resolved').forEach(button => {
          button.onclick = function() {        
            id = this.dataset.id_complaint;  
            resolv_complaint(id);
          }});  

        document.querySelectorAll('#btn_delete').forEach(button => {
            button.onclick = function() {        
              id = this.dataset.id_complaint;  
              delete_complaint(id);
            }});   

        document.querySelectorAll('#btn_edit').forEach(button => {
              button.onclick = function() {        
                id = this.dataset.id_complaint;  
                window.open("/edit/"+id, "_self");
            }}); 
            
      }
      else
      {
        overlay.setPosition(undefined);
        closer.blur();
      }
    });
  });

  map.on('singleclick', function (event) {    
    if (mode_creation)
    {
      coordinate = ol.proj.transform(event.coordinate, 'EPSG:3857', 'EPSG:4326')
      window.open("/add/"+coordinate, "_self");
    }
    /*else
    {
      if (map.hasFeatureAtPixel(event.pixel) !== true) {
        add_marker_init(event.coordinate);
      }
    }*/
  });

  load_complaints();
}

function clean_map()
{
  overlay.setPosition(undefined);
  closer.blur();

  layers = map.getLayers();
  
  var arr = [];
  layers.forEach((layer) => {
    if (layer.hasOwnProperty('type'))
    {  
      if (layer.type == "VECTOR")
      {
        arr.push(layer);
      }    
    }
  });

  
  for(var i=0; i<arr.length; i++) {
     map.removeLayer(arr[i]);
  }
}

function load_complaints()
{
  fetch("/complaint")
    .then(response => response.json())
    .then(json_result => {
        if (json_result.length <= 0)
        {
          Swal.fire("No complaint found!");
          return;
        }
        else
        {     
          user_auth = json_result.user_auth;
          json_result.complaint.forEach(add_marker);
        }
    });

}

async function load_complaints_info(id)
{
  html = "";
  await fetch("/complaint/"+id)
    .then(response => response.json())
    .then(json_result => {
        if (json_result.length <= 0)
        {
          Swal.fire("No information complaint found!");
          return "";
        }
        else
        {     
          user_auth = json_result.user_auth;    
          html = 
          '<img style="width:200px;heigh:20px;" src="'+json_result.complaint[0].photo+'" alt="Italian Trulli"></img>'+
          "<h4>"+json_result.complaint[0].description+"</h4>"+
          "<h6>Level Danger:"+json_result.complaint[0].danger+"</h6>"+
          "<p>By "+json_result.complaint[0].username +"<p>"+
          "<p>"+json_result.complaint[0].created +"<p>";

          if(json_result.complaint[0].username == user_auth){
            html +=' <button style="margin:2px;" class="btn-primary" style="padding: 0px; margin:0px;" id="btn_edit" data-id_complaint="'+json_result.complaint[0].id+'" >Edit</button>';        
            html +=' <button style="margin:2px;" class="btn-primary" style="padding: 0px; margin:0px;" id="btn_delete" data-id_complaint="'+json_result.complaint[0].id+'" >Delete</button>';        
            html +=' <button style="margin:2px;" class="btn-primary" style="padding: 0px; margin:0px;" id="btn_resolved" data-id_complaint="'+json_result.complaint[0].id+'" >Resolved</button>';                    
          }          
        }
    });

    return html;
  
}

/*function add_marker_init(coordinate)
{
    var layer_init = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [
            new ol.Feature({
                geometry: new ol.geom.Point(coordinate)
            })
        ]
    }),
    id: 0
  });
  map.addLayer(layer_init);
}*/

function add_marker(complaint)
{
  var lat            = complaint.latitude;
  var lon            = complaint.longitude;

  let feature_style;
  
  if (complaint.danger <= 2)
  {
    feature_style = new ol.style.Style({
      image: new ol.style.Icon({
        src: "/static/complaints/icon_alert_green.png",
        scale: 0.25
      })});
  }
  else if ((complaint.danger > 2) && (complaint.danger <=3 ))
  {
    feature_style = new ol.style.Style({
      image: new ol.style.Icon({
        src: "/static/complaints/icon_alert_yellow.png",
        scale: 0.25
      })});
  }
  else
  {
    feature_style = new ol.style.Style({
      image: new ol.style.Icon({
        src: "/static/complaints/icon_alert_red.png",
        scale: 0.25
      })});
  }

  var layer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [
            new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
                id: complaint.id,
                name: complaint.description
            })
        ]
    }), 
    style: feature_style
  });
  map.addLayer(layer);
 
}

function create_complaint()
{
  clean_map();
  Swal.fire("Now tap on the map to choose a location, or click on Home to go back!");  
  mode_creation = true;

}

function resolv_complaint(id)
{
  fetch('/complaint/'+id, {
    method: 'PUT',
    body: JSON.stringify({
        enabled: false,
        delete: false
    })
  })
  .then(response => {
    Swal.fire("Complaint Resolved!");  
    clean_map();
    load_complaints();  
  });
}

function delete_complaint(id)
{
  fetch('/complaint/'+id, {
    method: 'PUT',
    body: JSON.stringify({
        delete: true,
        enabled: true
    })
  })
  .then(response => {
    Swal.fire("Complaint Removed!");  
    clean_map();
    load_complaints();  
  });
}