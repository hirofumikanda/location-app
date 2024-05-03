import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import OpacityControl from "maplibre-gl-opacity";
import "maplibre-gl-opacity/dist/maplibre-gl-opacity.css";
import distance from "@turf/distance";
import { useGsiTerrainSource } from "maplibre-gl-gsi-terrain";

const map = new maplibregl.Map({
    container: "map",
    zoom: 5,
    center: [138, 37],
    minZoom: 5,
    maxZoom: 18,
    maxBounds: [122, 20, 154, 50],
    style: {
        version: 8,
        sources: {
            osm: {
                type: "raster",
                tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                maxzoom: 19,
                tileSize: 256,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> cotributors',
            },
            gsi_std: {
                type: "raster",
                tiles: [
                    "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
                ],
                maxzoom: 18,
                tileSize: 256,
                attribution:
                    '<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>',
            },
            hazard_flood: {
                type: "raster",
                tiles: [
                    "https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png",
                ],
                minzoom: 2,
                maxzoom: 17,
                tileSize: 256,
                attribution:
                    '<a href="https://disaportaldata.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
            },
            hazard_hightide: {
                type: "raster",
                tiles: [
                    "https://disaportaldata.gsi.go.jp/raster/03_hightide_l2_shinsuishin_data/{z}/{x}/{y}.png",
                ],
                minzoom: 2,
                maxzoom: 17,
                tileSize: 256,
                attribution:
                    '<a href="https://disaportaldata.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
            },
            hazard_tsunami: {
                type: "raster",
                tiles: [
                    "https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/{z}/{x}/{y}.png",
                ],
                minzoom: 2,
                maxzoom: 17,
                tileSize: 256,
                attribution:
                    '<a href="https://disaportaldata.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
            },
            hazard_doseki: {
                type: "raster",
                tiles: [
                    "https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png",
                ],
                minzoom: 2,
                maxzoom: 17,
                tileSize: 256,
                attribution:
                    '<a href="https://disaportaldata.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
            },
            hazard_kyukeisha: {
                type: "raster",
                tiles: [
                    "https://disaportaldata.gsi.go.jp/raster/05_kyukeishakeikaikuiki/{z}/{x}/{y}.png",
                ],
                minzoom: 2,
                maxzoom: 17,
                tileSize: 256,
                attribution:
                    '<a href="https://disaportaldata.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
            },
            hazard_jisuberi: {
                type: "raster",
                tiles: [
                    "https://disaportaldata.gsi.go.jp/raster/05_jisuberikeikaikuiki/{z}/{x}/{y}.png",
                ],
                minzoom: 2,
                maxzoom: 17,
                tileSize: 256,
                attribution:
                    '<a href="https://disaportaldata.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
            },
            skhb: {
                type: "vector",
                tiles: [
                    `${location.href.replace(
                        "/index.html",
                        ""
                    )}/skhb/{z}/{x}/{y}.pbf`,
                ],
                minzoom: 5,
                maxzoom: 8,
                attribution:
                    '<a href="https://www.gsi.go.jp/bousaichiri/hinanbasho.html" target="_blank">国土地理院：指定緊急避難場所データ</a>',
            },
            route: {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [],
                },
            },
        },
        layers: [
            {
                id: "osm-layer",
                source: "osm",
                type: "raster",
            },
            {
                id: "gsi-std-layer",
                source: "gsi_std",
                type: "raster",
                layout: { visibility: "none" },
            },
            {
                id: "hazard_flood-layer",
                source: "hazard_flood",
                type: "raster",
                paint: { "raster-opacity": 0.7 },
                layout: { visibility: "none" },
            },
            {
                id: "hazard_hightide-layer",
                source: "hazard_hightide",
                type: "raster",
                paint: { "raster-opacity": 0.7 },
                layout: { visibility: "none" },
            },
            {
                id: "hazard_tsunami-layer",
                source: "hazard_tsunami",
                type: "raster",
                paint: { "raster-opacity": 0.7 },
                layout: { visibility: "none" },
            },
            {
                id: "hazard_doseki-layer",
                source: "hazard_doseki",
                type: "raster",
                paint: { "raster-opacity": 0.7 },
                layout: { visibility: "none" },
            },
            {
                id: "hazard_kyukeisha-layer",
                source: "hazard_kyukeisha",
                type: "raster",
                paint: { "raster-opacity": 0.7 },
                layout: { visibility: "none" },
            },
            {
                id: "hazard_jisuberi-layer",
                source: "hazard_jisuberi",
                type: "raster",
                paint: { "raster-opacity": 0.7 },
                layout: { visibility: "none" },
            },
            {
                id: "skhb-1-layer",
                source: "skhb",
                "source-layer": "skhb",
                type: "circle",
                paint: {
                    "circle-color": "#6666cc",
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        5,
                        2,
                        14,
                        6,
                    ],
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#ffffff",
                },
                filter: ["get", "disaster1"],
                layout: { visibility: "none" },
            },
            {
                id: "skhb-2-layer",
                source: "skhb",
                "source-layer": "skhb",
                type: "circle",
                paint: {
                    "circle-color": "#6666cc",
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        5,
                        2,
                        14,
                        6,
                    ],
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#ffffff",
                },
                filter: ["get", "disaster2"],
                layout: { visibility: "none" },
            },
            {
                id: "skhb-3-layer",
                source: "skhb",
                "source-layer": "skhb",
                type: "circle",
                paint: {
                    "circle-color": "#6666cc",
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        5,
                        2,
                        14,
                        6,
                    ],
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#ffffff",
                },
                filter: ["get", "disaster3"],
                layout: { visibility: "none" },
            },
            {
                id: "skhb-4-layer",
                source: "skhb",
                "source-layer": "skhb",
                type: "circle",
                paint: {
                    "circle-color": "#6666cc",
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        5,
                        2,
                        14,
                        6,
                    ],
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#ffffff",
                },
                filter: ["get", "disaster4"],
                layout: { visibility: "none" },
            },
            {
                id: "skhb-5-layer",
                source: "skhb",
                "source-layer": "skhb",
                type: "circle",
                paint: {
                    "circle-color": "#6666cc",
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        5,
                        2,
                        14,
                        6,
                    ],
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#ffffff",
                },
                filter: ["get", "disaster5"],
                layout: { visibility: "none" },
            },
            {
                id: "skhb-6-layer",
                source: "skhb",
                "source-layer": "skhb",
                type: "circle",
                paint: {
                    "circle-color": "#6666cc",
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        5,
                        2,
                        14,
                        6,
                    ],
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#ffffff",
                },
                filter: ["get", "disaster6"],
                layout: { visibility: "none" },
            },
            {
                id: "skhb-7-layer",
                source: "skhb",
                "source-layer": "skhb",
                type: "circle",
                paint: {
                    "circle-color": "#6666cc",
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        5,
                        2,
                        14,
                        6,
                    ],
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#ffffff",
                },
                filter: ["get", "disaster7"],
                layout: { visibility: "none" },
            },
            {
                id: "skhb-8-layer",
                source: "skhb",
                "source-layer": "skhb",
                type: "circle",
                paint: {
                    "circle-color": "#6666cc",
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        5,
                        2,
                        14,
                        6,
                    ],
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#ffffff",
                },
                filter: ["get", "disaster8"],
                layout: { visibility: "none" },
            },
            {
                id: "route-layer",
                source: "route",
                type: "line",
                paint: {
                    "line-color": "#33aaff",
                    "line-width": 4,
                },
            },
        ],
    },
});

map.on("load", () => {
    // 地理院標高タイル（terrainRGB形式）のソース追加
    const gsiTerrainSource = useGsiTerrainSource(maplibregl.addProtocol);
    map.addSource("terrain", gsiTerrainSource);

    // 陰影図レイヤ追加
    map.addLayer(
        {
            id: "hillshade",
            source: "terrain",
            type: "hillshade",
            paint: {
                "hillshade-illumination-anchor": "map",
                "hillshade-exaggeration": 0.2,
            },
            layout: { visibility: "none" },
        },
        "hazard_jisuberi-layer"
    );

    // 3D地形
    map.addControl(
        new maplibregl.TerrainControl({
            source: "terrain",
            exaggeration: 1,
        }),
        "bottom-right"
    );

    const opacity = new OpacityControl({
        baseLayers: {
            "osm-layer": "OpenStreetMap",
            "gsi-std-layer": "地理院タイル標準",
        },
        overLayers: {
            hillshade: "陰影図",
            "hazard_flood-layer": "洪水浸水想定区域",
            "hazard_hightide-layer": "高潮浸水想定区域",
            "hazard_tsunami-layer": "津波浸水想定区域",
            "hazard_doseki-layer": "土石流警戒区域",
            "hazard_kyukeisha-layer": "急傾斜警戒区域",
            "hazard_jisuberi-layer": "地滑り警戒区域",
        },
    });
    map.addControl(opacity, "top-left");

    // 指定緊急避難場所のレイヤコントロール追加
    const opacitySkhb = new OpacityControl({
        overLayers: {
            "skhb-1-layer": "洪水",
            "skhb-2-layer": "崖崩れ/土石流/地滑り",
            "skhb-3-layer": "高潮",
            "skhb-4-layer": "地震",
            "skhb-5-layer": "津波",
            "skhb-6-layer": "大規模な火事",
            "skhb-7-layer": "内水氾濫",
            "skhb-8-layer": "火山現象",
        },
    });
    map.addControl(opacitySkhb, "top-right");

    // 指定緊急避難場所のポップアップ表示
    map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: [
                "skhb-1-layer",
                "skhb-2-layer",
                "skhb-3-layer",
                "skhb-4-layer",
                "skhb-5-layer",
                "skhb-6-layer",
                "skhb-7-layer",
                "skhb-8-layer",
            ],
        });
        if (features.length === 0) return;

        const feature = features[0];
        const popup = new maplibregl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML(
                `\
                    <div style="font-weight:900; font-size: 1rem;">${
                        feature.properties.name
                    }</div>\
                    <div>${feature.properties.address}</div>\
                    <div>${feature.properties.remarks ?? ""}</div>\
                    <div>\
                        <span ${
                            feature.properties.disaster1
                                ? ""
                                : ' style="color:#ccc;"'
                        }>洪水</span>\
                        <span ${
                            feature.properties.disaster2
                                ? ""
                                : ' style="color:#ccc;"'
                        }> 崖崩れ/土石流/地滑り</span>\
                        <span ${
                            feature.properties.disaster3
                                ? ""
                                : ' style="color:#ccc;"'
                        }> 高潮</span>\
                        <span ${
                            feature.properties.disaster4
                                ? ""
                                : ' style="color:#ccc;"'
                        }> 地震</span>\
                        <span ${
                            feature.properties.disaster5
                                ? ""
                                : ' style="color:#ccc;"'
                        }> 津波</span>\
                        <span ${
                            feature.properties.disaster6
                                ? ""
                                : ' style="color:#ccc;"'
                        }> 大規模な火事</span>\
                        <span ${
                            feature.properties.disaster7
                                ? ""
                                : ' style="color:#ccc;"'
                        }> 内水氾濫</span>\
                        <span ${
                            feature.properties.disaster8
                                ? ""
                                : ' style="color:#ccc;"'
                        }> 火山現象</span>\
                        </div>,

                `
            )
            .addTo(map);
    });

    // 指定緊急避難場所をマウスオーバーしたときにカーソルの形状を変更
    map.on("mousemove", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: [
                "skhb-1-layer",
                "skhb-2-layer",
                "skhb-3-layer",
                "skhb-4-layer",
                "skhb-5-layer",
                "skhb-6-layer",
                "skhb-7-layer",
                "skhb-8-layer",
            ],
        });
        if (features.length > 0) {
            map.getCanvas().style.cursor = "pointer";
        } else {
            map.getCanvas().style.cursor = "";
        }
    });

    // 現在地を表示
    let userlocation = null;
    const geolocationControl = new maplibregl.GeolocateControl({
        trackUserLocation: true,
    });
    map.addControl(geolocationControl, "bottom-right");
    geolocationControl.on("geolocate", (e) => {
        userlocation = [e.coords.longitude, e.coords.latitude];
    });

    // 最寄りの指定緊急避難場所と現在地のラインを表示
    map.on("render", () => {
        if (geolocationControl._watchState === "OFF") userlocation = null;
        if (map.getZoom() < 7 || userlocation === null) {
            map.getSource("route").setData({
                type: "FeatureCollection",
                features: [],
            });
            return;
        }
        const nearestFeature = getNearestFeature(
            userlocation[0],
            userlocation[1]
        );
        const routeFeature = {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: [
                    userlocation,
                    nearestFeature._geometry.coordinates,
                ],
            },
        };
        map.getSource("route").setData({
            type: "FeatureCollection",
            features: [routeFeature],
        });
    });
});

/**
 * 現在選択されている指定緊急避難場所レイヤー（skhb）を特定しそのfilter条件を返す
 */
const getCurrentSkhbLayerFilter = () => {
    const style = map.getStyle();
    const skhbLayers = style.layers.filter((layer) =>
        layer.id.startsWith("skhb")
    );
    const visibleSkhbLayers = skhbLayers.filter(
        (layer) => layer.layout.visibility === "visible"
    );
    return visibleSkhbLayers[0].filter;
};

/**
 * 経緯度を渡すと最寄りの指定緊急避難場所を返す
 */
const getNearestFeature = (longitude, latitude) => {
    const currentSkhbLayerFilter = getCurrentSkhbLayerFilter();
    const features = map.querySourceFeatures("skhb", {
        sourceLayer: "skhb",
        filter: currentSkhbLayerFilter,
    });

    // 現在地に最も近い地物
    const nearestFeature = features.reduce((minDistFeature, feature) => {
        const dist = distance(
            [longitude, latitude],
            feature.geometry.coordinates
        );
        if (minDistFeature === null || minDistFeature.properties.dist > dist) {
            return {
                ...feature,
                properties: {
                    ...feature.properties,
                    dist,
                },
            };
        }

        return minDistFeature;
    }, null);

    return nearestFeature;
};
