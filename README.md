# Overview

This repository is related to https://github.com/roataway/web-ui and it contains slightly
tweaked data extracted from OpenStreetMap.

## The process of obtaining the data

### Route segments

These are obtained via the Overpass API.

1. Go to `http://overpass-api.de/api/interpreter?data=[out:json];relation%20(xxxxxxx)%3B>>%3Bway._%3Bout%20geom%3B`
2. Replace `xxxxxxx` with the relation id, e.g. `8649765`
3. Save the resulting JSON to `data/route_<upstream_id>_segments.json`, replacing `upstream_id` with the route's internal identifier in the upstream GPS tracking system.

### Route stations

The process is similar to route segments, but the Overpass API query is different:

1. Go to `http://overpass-api.de/api/interpreter?data=[out:json];relation%20(xxxxxxx)%3B>>%3Bnode._%20[public_transport%3Dplatform]%3Bout%3B`
2. Replace `xxxxxxx` with the relation id, e.g. `8649765`
3. Save the resulting JSON to `data/route_<upstream_id>_stations.json`, replacing `upstream_id` with the route's internal identifier in the RTEC system.

## Helper tools

## `getRoute` - automatically retrieve routes metadata 

This tool retrieves information about a given route, by taking all routes from a CSV
file that was fed into it, or by explicitly retrieving one particular route specified
by its OpenStreetMap `relation id`.
The CSV is in https://github.com/roataway/web-ui/tree/master/src/data.

The data are stored in GeoJSON, in 2 files:
- `route_<upstream_id>_segments.json`
- `route_<upstream_id>_stations.json`

Installation:

- `virtualenv -p python3 venv-getRoute`
- `source venv-getRoute/bin/activate`
- `pip install osm2geojson`

Examples of use (activate the virtualenv via `source venv-getRoute/bin/activate` first):

- `python getRoute --csv ../src/data/routes.csv --dst out` - Get all the routes specified in
  `../src/data/routes.csv` and save the resulting files to `out/` in the current directory.
- `python getRoute -r 9478330` - Retrieve data about relation `9478330`; in this case the file
  name will use the `relation_id`, rather than the `upstream_id`.
- `python getRoute --help` - See what command line args are available

If all is well, you will see something like this:

```
 INFO - Processing all routes from ../src/data/routes.csv
 INFO - Processing route 30, `Aeroport - Piața Marii Adunări Naționale`
 INFO - Processing route 32, `str. 31 August 1989 - com. Stăuceni`
 ...
 INFO - Processing route 1, `or. Durlești - str. Sarmizegetusa`
 INFO - Done
```

And the metadata will be saved in the directory you've indicated.

Note that the Overpass API of OSM returns a JSON which does not conform to the GeoJSON
schema (though they look the same to the untrained eye)! Thus, the tool relies on a
third-party library, `osm2geojson` to do the conversion.

What happens in principle:

- retrieve XML data from Overpass
- use `osm2geojson` to convert that XML to GeoJSON
- save GeoJSON to file