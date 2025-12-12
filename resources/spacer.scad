$fs = 0.2;
$fa = 8;

module screw_head (h) {
    // M2 screw head (based on kbd lib by @foostan, MIT)
    import("./m2_head.stl");
    translate([0, 0, -h]) cylinder(h = h, d = 2);
}

module spacer (h) {
  $fn = 6;
  cylinder(d = 4.62, h = h);
}

module nut () {
  difference () {
      translate([0, 0, -1.2]) spacer(1.2);
      translate([0, 0, -1.2]) cylinder(h = 0.4, d = 2);
  }
}

module single_spacer_preview (h, d1, d2) {
  translate([0, 0, h + d1]) screw_head(d1);
  translate([0, 0, - d2]) rotate([180, 0, 0]) screw_head(d2);
  spacer(h);
}

module single_nut_preview (h) {
    screw_head(h);
    translate([0, 0, -h]) nut();
}

single_spacer_preview(12, 1.6, 1.6);
//single_nut_preview(20);