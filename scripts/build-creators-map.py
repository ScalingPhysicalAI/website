"""Build the dotted world map used on /buildo-creators.

Reads Natural Earth land outlines as TopoJSON (world-atlas land-110m.json,
https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json) and writes a
dot-matrix SVG: one dot per grid cell whose centre falls on land.

The projection is plain equirectangular, cropped to LAT_TOP..LAT_BOTTOM so
Antarctica and the empty Arctic don't eat the frame. The page positions its
markers with the same formula, so keep MAP_* in the Svelte page in step with
the constants here.

Usage: python3 scripts/build-creators-map.py land-110m.json static/assets/creators-world-dots.svg
"""

import json
import sys

STEP = 2.0  # degrees per dot
LAT_TOP = 80.0
LAT_BOTTOM = -58.0
DOT_COLOR = '#141210'
DOT_OPACITY = 0.2


def decode_arcs(topo):
    sx, sy = topo['transform']['scale']
    tx, ty = topo['transform']['translate']
    arcs = []
    for arc in topo['arcs']:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            pts.append((x * sx + tx, y * sy + ty))
        arcs.append(pts)
    return arcs


def ring_coords(ring, arcs):
    pts = []
    for idx in ring:
        arc = arcs[idx] if idx >= 0 else list(reversed(arcs[~idx]))
        # Consecutive arcs share their joining point.
        pts.extend(arc if not pts else arc[1:])
    # Eurasia (and a couple of Arctic islands) close through the antimeridian,
    # running out to +180 and back in from -180. Taken literally that ring
    # wraps the whole globe and the even-odd test floods the Arctic, so unwrap
    # the far-east tip onto 180..190 and let main() test lon + 360 as well.
    xs = [x for x, _ in pts]
    if max(xs) - min(xs) > 180:
        pts = [(x + 360 if x < -100 else x, y) for x, y in pts]
    return pts


def inside(lon, lat, ring):
    hit = False
    j = len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i]
        xj, yj = ring[j]
        if (yi > lat) != (yj > lat) and lon < (xj - xi) * (lat - yi) / (yj - yi) + xi:
            hit = not hit
        j = i
    return hit


def on_land(lon, lat, polygons):
    for (x0, x1, y0, y1), rings in polygons:
        if not (x0 <= lon <= x1 and y0 <= lat <= y1):
            continue
        # Even-odd across every ring, so lakes cut out as holes.
        if sum(inside(lon, lat, ring) for ring in rings) % 2:
            return True
    return False


def main(src, dest):
    with open(src) as f:
        topo = json.load(f)
    arcs = decode_arcs(topo)

    polygons = []
    for geom in topo['objects']['land']['geometries']:
        polys = geom['arcs'] if geom['type'] == 'MultiPolygon' else [geom['arcs']]
        for poly in polys:
            rings = [ring_coords(r, arcs) for r in poly]
            xs = [p[0] for p in rings[0]]
            ys = [p[1] for p in rings[0]]
            polygons.append(((min(xs), max(xs), min(ys), max(ys)), rings))

    cols = int(360 / STEP)
    rows = int((LAT_TOP - LAT_BOTTOM) / STEP)
    dots = []
    for r in range(rows):
        lat = LAT_TOP - (r + 0.5) * STEP
        for c in range(cols):
            lon = -180 + (c + 0.5) * STEP
            if any(on_land(x, lat, polygons) for x in (lon, lon + 360)):
                dots.append((c + 0.5, r + 0.5))

    # Zero-length round-capped segments draw as dots in a fraction of the bytes
    # a <circle> per cell would cost.
    d = ''.join(f'M{x:g} {y:g}h0' for x, y in dots)
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {cols} {rows}">'
        f'<path d="{d}" stroke="{DOT_COLOR}" stroke-opacity="{DOT_OPACITY}" '
        f'stroke-width="1.05" stroke-linecap="round" fill="none"/></svg>\n'
    )
    with open(dest, 'w') as f:
        f.write(svg)
    print(f'{len(dots)} dots, {cols}x{rows} grid, {len(svg)} bytes -> {dest}')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
