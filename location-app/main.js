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
            gsi_pale: {
                type: "raster",
                tiles: [
                    "https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png",
                ],
                maxzoom: 18,
                tileSize: 256,
                attribution:
                    '<a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a>',
            },
            gsi_blank: {
                type: "raster",
                tiles: [
                    "https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png",
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
            population: {
                type: "vector",
                tiles: [
                    `${location.href.replace(
                        "/index.html",
                        ""
                    )}/population/{z}/{x}/{y}.pbf`,
                ],
                minzoom: 5,
                maxzoom: 8,
                attribution:
                    '<a href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A16-v2_3.html" target="_blank">国土数値情報（平成27年人口集中地区データ）（国土交通省）</a>',
            },
            admin: {
                type: "vector",
                tiles: [
                    `${location.href.replace(
                        "/index.html",
                        ""
                    )}/adminarea/{z}/{x}/{y}.pbf`,
                ],
                minzoom: 0,
                maxzoom: 8,
                attribution:
                    '<a href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_0.html" target="_blank">国土数値情報（令和3年行政区域データ）（国土交通省）</a>',
            },
            rail: {
                type: "vector",
                tiles: [
                    `${location.href.replace(
                        "/index.html",
                        ""
                    )}/rail/{z}/{x}/{y}.pbf`,
                ],
                minzoom: 0,
                maxzoom: 8,
                attribution:
                    '<a href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-v3_1.html" target="_blank">国土数値情報（令和4年鉄道データ）（国土交通省）</a>',
            },
            station: {
                type: "vector",
                tiles: [
                    `${location.href.replace(
                        "/index.html",
                        ""
                    )}/station/{z}/{x}/{y}.pbf`,
                ],
                minzoom: 0,
                maxzoom: 8,
                attribution:
                    '<a href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-v3_1.html" target="_blank">国土数値情報（令和4年鉄道データ）（国土交通省）</a>',
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
                id: "gsi-pale-layer",
                source: "gsi_pale",
                type: "raster",
                layout: { visibility: "none" },
            },
            {
                id: "gsi-blank-layer",
                source: "gsi_blank",
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
                id: "population-layer",
                source: "population",
                "source-layer": "population",
                type: "fill",
                paint: {
                    "fill-color": [
                        "rgba",
                        255,
                        0,
                        0,
                        [
                            "min",
                            1,
                            [
                                "/",
                                ["/", ["get", "人口"], ["get", "面積"]],
                                40000,
                            ],
                        ],
                    ],
                },
                layout: { visibility: "none" },
            },
            {
                id: "admin-layer",
                source: "admin",
                "source-layer": "admin",
                type: "fill",
                paint: {
                    "fill-color": "#6a3",
                    "fill-opacity": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        0.5,
                        14,
                        0.2,
                    ],
                },
                layout: { visibility: "none" },
            },
            {
                id: "admin-outline-layer",
                source: "admin",
                "source-layer": "admin",
                type: "line",
                paint: {
                    "line-color": "#373",
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        1,
                        14,
                        4,
                    ],
                },
                layout: { visibility: "none" },
            },
            {
                id: "station-circle-layer",
                source: "station",
                "source-layer": "station",
                type: "circle",
                paint: {
                    "circle-color": "orange",
                    "circle-stroke-width": 1,
                    "circle-radius": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        1,
                        15,
                        6,
                    ],
                },
                layout: { visibility: "none" },
            },
            {
                id: "rail-1-layer", // 新幹線
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "green",
                },
                filter: ["==", "N02_002", "1"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-2-layer", // JR在来線
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "blue",
                },
                filter: ["==", "N02_002", "2"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-3-layer", // 公営鉄道
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "red",
                },
                filter: ["==", "N02_002", "3"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-3-1-layer", // 都営浅草線
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "#ef463c",
                },
                filter: ["==", "N02_003", "1号線浅草線"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-3-6-layer", // 都営三田線
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "#0072bc",
                },
                filter: ["==", "N02_003", "6号線三田線"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-3-10-layer", // 都営新宿線
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "#abba41",
                },
                filter: ["==", "N02_003", "10号線新宿線"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-3-12-layer", // 都営大江戸線
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "#ce1c64",
                },
                filter: ["==", "N02_003", "12号線大江戸線"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-4-layer", // 民営鉄道
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "orange",
                },
                filter: ["==", "N02_002", "4"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-4-2-layer", // 東京メトロ日比谷線
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "#b5b5ac",
                },
                filter: ["==", "N02_003", "2号線日比谷線"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-4-3-layer", // 東京メトロ銀座線
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "#ff9500",
                },
                filter: ["==", "N02_003", "3号線銀座線"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-4-4-layer", // 東京メトロ丸ノ内線
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "#f52e36",
                },
                filter: ["==", "N02_003", "4号線丸ノ内線"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-4-5-layer", // 東京メトロ東西線
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "#009bbf",
                },
                filter: ["==", "N02_003", "5号線東西線"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-4-7-layer", // 東京メトロ南北線
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "#00ac9b",
                },
                filter: ["==", "N02_003", "7号線南北線"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-4-8-layer", // 東京メトロ有楽町線
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "#c1a470",
                },
                filter: ["==", "N02_003", "8号線有楽町線"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-4-9-layer", // 東京メトロ千代田線
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "#00bb85",
                },
                filter: ["==", "N02_003", "9号線千代田線"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-4-11-layer", // 東京メトロ半蔵門線
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "#867fdf",
                },
                filter: ["==", "N02_003", "11号線半蔵門線"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-4-13-layer", // 東京メトロ副都心線
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "#9c5e31",
                },
                filter: ["==", "N02_003", "13号線副都心線"],
                layout: { visibility: "none" },
            },
            {
                id: "rail-5-layer", // 第3セクター
                source: "rail",
                "source-layer": "rail",
                type: "line",
                paint: {
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        10,
                        3,
                        14,
                        7,
                    ],
                    "line-color": "purple",
                },
                filter: ["==", "N02_002", "5"],
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

    // レイヤコントロール
    const opacity = new OpacityControl({
        baseLayers: {
            "osm-layer": "OpenStreetMap",
            "gsi-std-layer": "地理院タイル標準",
            "gsi-pale-layer": "地理院タイル淡色",
            "gsi-blank-layer": "地理院タイル白地図",
        },
    });
    map.addControl(opacity, "top-left");

    // レイヤコントロール
    const opacityOverlay = new OpacityControl({
        overLayers: {
            hillshade: "陰影図",
            // "admin-layer": "行政区域ポリゴン",
            // "admin-outline-layer": "行政区域ライン",
            "population-layer": "人口集中地区",
            "station-circle-layer": "駅",
            "rail-1-layer": "新幹線",
            "rail-2-layer": "JR在来線",
            "rail-3-layer": "公営鉄道",
            // "rail-3-1-layer": "都営浅草線",
            // "rail-3-6-layer": "都営三田線",
            // "rail-3-10-layer": "都営新宿線",
            // "rail-3-12-layer": "都営大江戸線",
            "rail-4-layer": "民営鉄道",
            // "rail-4-2-layer": "東京メトロ日比谷線",
            // "rail-4-3-layer": "東京メトロ銀座線",
            // "rail-4-4-layer": "東京メトロ丸ノ内線",
            // "rail-4-5-layer": "東京メトロ東西線",
            // "rail-4-7-layer": "東京メトロ南北線",
            // "rail-4-8-layer": "東京メトロ有楽町線",
            // "rail-4-9-layer": "東京メトロ千代田線",
            // "rail-4-11-layer": "東京メトロ半蔵門線",
            // "rail-4-13-layer": "東京メトロ副都心線",
            "rail-5-layer": "第3セクター",
        },
    });
    map.addControl(opacityOverlay, "top-right");

    // 指定緊急避難場所のレイヤコントロール追加
    // const opacitySkhb = new OpacityControl({
    //     overLayers: {
    //         "hazard_flood-layer": "洪水浸水想定区域",
    //         "hazard_hightide-layer": "高潮浸水想定区域",
    //         "hazard_tsunami-layer": "津波浸水想定区域",
    //         "hazard_doseki-layer": "土石流警戒区域",
    //         "hazard_kyukeisha-layer": "急傾斜警戒区域",
    //         "hazard_jisuberi-layer": "地滑り警戒区域",
    //         "skhb-1-layer": "洪水",
    //         "skhb-2-layer": "崖崩れ/土石流/地滑り",
    //         "skhb-3-layer": "高潮",
    //         "skhb-4-layer": "地震",
    //         "skhb-5-layer": "津波",
    //         "skhb-6-layer": "大規模な火事",
    //         "skhb-7-layer": "内水氾濫",
    //         "skhb-8-layer": "火山現象",
    //     },
    // });
    // map.addControl(opacitySkhb, "top-right");

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

    // 行政名のポップアップ表示
    map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ["admin-layer"],
        });
        if (features.length === 0) return;

        const feature = features[0];
        const popup = new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
                `\
                    <div>${feature.properties.N03_007}: ${feature.properties.N03_001}${feature.properties.N03_004}</div>
                `
            )
            .addTo(map);
    });

    // 鉄道の路線名ポップアップ表示
    map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: [
                "rail-1-layer",
                "rail-2-layer",
                "rail-3-layer",
                "rail-3-1-layer",
                "rail-3-6-layer",
                "rail-3-10-layer",
                "rail-3-12-layer",
                "rail-4-layer",
                "rail-4-2-layer",
                "rail-4-3-layer",
                "rail-4-4-layer",
                "rail-4-5-layer",
                "rail-4-7-layer",
                "rail-4-8-layer",
                "rail-4-9-layer",
                "rail-4-11-layer",
                "rail-4-13-layer",
                "rail-5-layer",
            ],
        });
        if (features.length === 0) return;

        const feature = features[0];
        const popup = new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
                `\
                    <div>${feature.properties.N02_004}: ${feature.properties.N02_003}</div>
                `
            )
            .addTo(map);
    });

    // 駅名ポップアップ表示
    map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
            layers: ["station-circle-layer"],
        });
        if (features.length === 0) return;

        const feature = features[0];
        const popup = new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
                `\
                    <div>${feature.properties.N02_005}駅</div>
                `
            )
            .addTo(map);
    });

    // レイヤ地物にマウスオーバーしたときにカーソルの形状を変更
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
                "admin-layer",
                "station-circle-layer",
                "rail-1-layer",
                "rail-2-layer",
                "rail-3-layer",
                "rail-3-1-layer",
                "rail-3-6-layer",
                "rail-3-10-layer",
                "rail-3-12-layer",
                "rail-4-layer",
                "rail-4-2-layer",
                "rail-4-3-layer",
                "rail-4-4-layer",
                "rail-4-5-layer",
                "rail-4-7-layer",
                "rail-4-8-layer",
                "rail-4-9-layer",
                "rail-4-11-layer",
                "rail-4-13-layer",
                "rail-5-layer",
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
