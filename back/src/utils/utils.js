export function distanceMeters(lat1, lon1, lat2, lon2) {
    const DEG_TO_RAD = Math.PI / 180;
    const latAvgRad = ((lat1 + lat2) / 2.0) * DEG_TO_RAD;

    const metersPerDegLat = 110574.0;
    const metersPerDegLon = 111320.0 * Math.cos(latAvgRad);

    const dy = (lat2 - lat1) * metersPerDegLat;
    const dx = (lon2 - lon1) * metersPerDegLon;

    return Math.sqrt(dx * dx + dy * dy);
}