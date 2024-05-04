import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import OpacityControl from "maplibre-gl-opacity";
import "maplibre-gl-opacity/dist/maplibre-gl-opacity.css";
import distance from "@turf/distance";
import { useGsiTerrainSource } from "maplibre-gl-gsi-terrain";

const map = new maplibregl.Map({
    container: "map",
    zoom: 10,
    center: [139.753304, 35.682468],
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
            mierune_mono: {
                type: "raster",
                tiles: [
                    "https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png",
                ],
                maxzoom: 18,
                tileSize: 256,
                attribution:
                    "Maptiles by <a href='http://mierune.co.jp/' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL.",
            },
            mierune_color: {
                type: "raster",
                tiles: ["https://tile.mierune.co.jp/mierune/{z}/{x}/{y}.png"],
                maxzoom: 18,
                tileSize: 256,
                attribution:
                    "Maptiles by <a href='http://mierune.co.jp/' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL.",
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
                id: "mierune-mono-layer",
                source: "mierune_mono",
                type: "raster",
                layout: { visibility: "none" },
            },
            {
                id: "mierune-color-layer",
                source: "mierune_color",
                type: "raster",
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
                layout: { visibility: "visible" },
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
                layout: { visibility: "visible" },
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
                layout: { visibility: "visible" },
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
                layout: { visibility: "visible" },
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
                layout: { visibility: "visible" },
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
                layout: { visibility: "visible" },
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
                layout: { visibility: "visible" },
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
                layout: { visibility: "visible" },
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
                layout: { visibility: "visible" },
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
                layout: { visibility: "visible" },
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
                layout: { visibility: "visible" },
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
                layout: { visibility: "visible" },
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
                layout: { visibility: "visible" },
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
                layout: { visibility: "visible" },
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
        ],
    },
});

map.on("load", () => {
    // 地理院標高タイル（terrainRGB形式）のソース追加
    const gsiTerrainSource = useGsiTerrainSource(maplibregl.addProtocol);
    map.addSource("terrain", gsiTerrainSource);

    // 陰影図レイヤ追加
    map.addLayer({
        id: "hillshade",
        source: "terrain",
        type: "hillshade",
        paint: {
            "hillshade-illumination-anchor": "map",
            "hillshade-exaggeration": 0.5,
        },
        layout: { visibility: "visible" },
    });

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
            "mierune-mono-layer": "MIERUNEモノ",
            "mierune-color-layer": "MIERUNEカラー",
        },
        overLayers: {
            "rail-1-layer": "新幹線",
            "rail-2-layer": "JR在来線",
            "rail-3-layer": "公営鉄道",
            "rail-4-layer": "民営鉄道",
            "rail-5-layer": "第3セクター",
        },
    });
    map.addControl(opacity, "top-right");

    // ナビゲーションコントロール
    let nc = new maplibregl.NavigationControl();
    map.addControl(nc, "top-left");

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
});
