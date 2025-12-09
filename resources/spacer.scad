$fs = 0.2;
$fa = 8;

module spherical_cap (r, h) {
    d = r * 2;
    rr = (d * d + 4 * h * h) / (8 * abs(h));
    c = h > 0 ? rr - h : - h - rr;
    difference() {
      translate([0, 0, -c]) sphere(r = rr);
      translate([0, 0, h > 0 ? -rr : rr]) cube(rr * 2, center = true);
    }
}

module hex_cylinder (d, h) {
  $fn = 6;
  cylinder(d = d, h = h);
}

module single_spacer_preview (h, d1, d2) {
  translate([0, 0, h + d1]) spherical_cap(1.75, 1.3);
  translate([0, 0, - d2]) rotate([180, 0, 0]) spherical_cap(1.75, 1.3);
  hex_cylinder(5, h);
}

single_spacer_preview(5, 1.6, 1.6);