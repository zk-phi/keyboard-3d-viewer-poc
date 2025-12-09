// reference: https://bebebe.hatenablog.jp/entry/2019/06/04/232501

$fs = 0.1;
$fa = 2;

module rounded_cube(size, r) {
  h = 0.0001;
  minkowski() {
    cube([size[0] - r * 2, size[1] - r * 2, size[2] - h], center = true);
    cylinder(r = r, h = h);
  }
}

module keycap_round_base(key_bottom_size, key_top_size, key_top_height, round_r, unit = 1) {
  n = 20;

  b = key_bottom_size;
  t = key_top_size;
  h = key_top_height;
  extraX = (unit - 1) * 19.05;

  r = h * h / (b - t) + (b - t)  / 4;
  theta_max = asin(h / r);

  hull() {
    for (i = [0 : n]) {
      translate([0, 0, r * sin(theta_max * i / n) ]) {
        x = b - 2 * r * (1 - cos(theta_max * i / n));
        rounded_cube([x + extraX, x, 0.01], round_r * i / n);
      }
    }
  }
}

module keycap_inner_hole (bottom, top, height, r, unit) {
  extraX = (unit - 1) * 19.05;
  hull() {
    translate([0, 0, height - 1.5])
      rounded_cube([top - 3 + extraX, top - 3, 0.01], r * (height - 1.5) / height);
    rounded_cube([bottom - 3 + extraX, bottom - 3, 0.01], 0);
  }
}

module stem (r, height) {
  cylinder(height, r, r);
}

key_bottom_size = 18;
key_top_size = 14;
key_top_height = 7.5;

difference () {
  keycap_round_base(key_bottom_size, key_top_size, key_top_height, 3, 1.75);
  keycap_inner_hole(key_bottom_size, key_top_size, key_top_height, 3, 1.75);
}
stem(2.75, key_top_height);
