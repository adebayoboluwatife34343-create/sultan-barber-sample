export default function build({ THREE, scene, root, cam, RM }) {
  scene.add(new THREE.HemisphereLight(0xffffff, 0x6ec6ff, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 4, 7); scene.add(key);
  // stripe texture
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 256; const g = cv.getContext('2d');
  const cols = ['#ff6b57', '#ffffff', '#3b9be0', '#ffffff'];
  for (let i = -4; i < 8; i++) { g.fillStyle = cols[((i % 4) + 4) % 4]; g.beginPath(); const y = i * 64; g.moveTo(0, y); g.lineTo(256, y - 128); g.lineTo(256, y - 64); g.lineTo(0, y + 64); g.closePath(); g.fill(); }
  const tex = new THREE.CanvasTexture(cv); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1, 2); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const pole = new THREE.Group(); root.add(pole);
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(.85, .85, 5, 48, 1, true), new THREE.MeshStandardMaterial({ map: tex, roughness: .25, metalness: .05 })); pole.add(tube);
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(.92, .92, 5.05, 48, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: .16, roughness: .05, metalness: 0, clearcoat: 1 })); pole.add(glass);
  const chrome = new THREE.MeshStandardMaterial({ color: 0xdfe8ef, metalness: .9, roughness: .2 });
  [-2.65, 2.65].forEach(y => { const c = new THREE.Mesh(new THREE.CylinderGeometry(.98, .98, .3, 48), chrome); c.position.y = y; pole.add(c); const r = new THREE.Mesh(new THREE.TorusGeometry(.98, .05, 12, 48), chrome); r.rotation.x = Math.PI / 2; r.position.y = y + (y > 0 ? -.16 : .16); pole.add(r); });
  const top = new THREE.Mesh(new THREE.SphereGeometry(.7, 32, 24), new THREE.MeshStandardMaterial({ color: 0xfff2c4, emissive: 0xffcf40, emissiveIntensity: .6, roughness: .2 })); top.position.y = 3.45; pole.add(top);
  const topc = new THREE.Mesh(new THREE.CylinderGeometry(.35, .6, .3, 32), chrome); topc.position.y = 2.95; pole.add(topc);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(.26, .4, 24), chrome); cap.position.y = 4.1; pole.add(cap);
  const bot = new THREE.Mesh(new THREE.CylinderGeometry(.5, .75, .4, 32), chrome); bot.position.y = -3.0; pole.add(bot);
  // bracket
  const br = new THREE.Mesh(new THREE.BoxGeometry(.2, 6.8, .2), new THREE.MeshStandardMaterial({ color: 0x12304a, roughness: .5 })); br.position.set(0, .2, -1.1); pole.add(br);
  [-2.65, 2.65].forEach(y => { const a = new THREE.Mesh(new THREE.BoxGeometry(.18, .18, 1.2), new THREE.MeshStandardMaterial({ color: 0x12304a })); a.position.set(0, y, -.55); pole.add(a); });
  // floating combs / scissors accents
  const acc = new THREE.Group(); root.add(acc);
  const mk = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: .4 });
  for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(i % 3 ? new THREE.TorusGeometry(.14, .045, 10, 20) : new THREE.OctahedronGeometry(.16), mk([0xffcf40, 0xff6b57, 0x3b9be0][i % 3])); const a = i / 9 * 6.283; m.userData = { a, r: 2.3 + (i % 3) * .35, y: -2.5 + i * .6 }; acc.add(m); }
  let spinA = 0, spd = 0;
  return {
    update({ t, dt, p, px, py, rot, RM }) {
      const target = RM ? 0 : .4 + p * 6; spd += (target - spd) * Math.min(1, dt * 3);
      if (RM) tex.offset.y = p * 2; else tex.offset.y -= spd * dt * .25;
      pole.rotation.y = rot * .5 + px * .35; pole.rotation.x = py * .08; pole.rotation.z = -px * .04;
      acc.children.forEach(m => { const u = m.userData, a = u.a + (RM ? p * 3 : t * .5 * (1 + spd * .15)); m.position.set(Math.cos(a) * u.r, u.y + Math.sin(a * 2) * .15, Math.sin(a) * u.r * .55); m.rotation.x = a * 2; m.rotation.y = a; });
      top.material.emissiveIntensity = .5 + Math.sin(t * 3) * .12;
      cam.position.x = px * .5; cam.lookAt(0, .3, 0);
    }
  };
}
