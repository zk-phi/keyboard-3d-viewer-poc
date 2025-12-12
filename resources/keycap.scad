// reference: https://bebebe.hatenablog.jp/entry/2019/06/04/232501

$fs = 0.2;
$fa = 8;

function lerp (l, r, x) = (r - l) * x + l;

module rounded_cube (size, r) {
  h = 0.0001;
  minkowski () {
    cube([size[0] - r * 2, size[1] - r * 2, size[2] - h], center = true);
    cylinder(r = r, h = h);
  }
}

module rounded_outer (bottom_size, top_size, height, bot_r, top_r, angle, unit = 1) {
  n = 20;
  size_diff = bottom_size - top_size;
  extraX = (unit - 1) * 19.05;

  r = height * height / size_diff + size_diff / 4;
  theta_max = asin(height / r);

  hull () {
    for (i = [0 : n]) {
      translate ([0, 0, r * sin(theta_max * i / n)]) {
        x = bottom_size - 2 * r * (1 - cos(theta_max * i / n));
        rr = lerp(bot_r, top_r, i / n);
        aa = lerp(0, angle, i / n);
        rotate ([aa, 0, 0]) rounded_cube([x + extraX, x, 0.01], rr);
      }
    }
  }
}

module straight_outer (bottom_size, top_size, height, bot_r, top_r, angle, unit = 1) {
  n = 20;
  extraX = (unit - 1) * 19.05;

  hull () {
    for (i = [0 : n]) {
      translate ([0, 0, height * i / n]) {
        ss = lerp(bottom_size, top_size, i / n);
        rr = lerp(bot_r, top_r, i / n);
        aa = lerp(0, angle, i / n);
        rotate ([aa, 0, 0]) rounded_cube([ss + extraX, ss, 0.01], rr);
      }
    }
  }
}

module inner (bottom, top, height, r, angle, unit) {
  extraX = (unit - 1) * 19.05;
  hull () {
    translate ([0, 0, height - 1.5]) {
      rotate ([angle, 0, 0])
        rounded_cube([top - 3 + extraX, top - 3, 0.01], r);
    }
    rounded_cube([bottom - 3 + extraX, bottom - 3, 0.01], r);
  }
}

module stem (height, angle) {
  hull () {
    translate ([0, 0, height]) rotate([angle, 0, 0]) cylinder(0.01, 2.75, 2.75);
    cylinder(0.01, 2.75, 2.75);
  }
}

module rounded_keycap (bottom, top, height, bot_r, top_r, angle, unit) {
  difference () {
    rounded_outer(bottom, top, height, bot_r, top_r, angle, unit);
    inner(bottom, top, height, 0, angle, unit);
  }
  stem(height, angle);
}

module straight_keycap (bottom, top, height, bot_r, top_r, angle, unit) {
  difference () {
    straight_outer(bottom, top, height, bot_r, top_r, angle, unit);
    inner(bottom, top, height, 0, angle, unit);
  }
  stem(height, angle);
}

module xda_ish (unit) {
  rounded_keycap(18, 14, 7.5, 0.5, 3.0, 0.0, unit);
}

module cherry_ish (unit) {
  straight_keycap(18, 14, 7.5, 0.5, 1.0, -5.0, unit);
}

xda_ish(1.75);
// cherry_ish(1.75);
