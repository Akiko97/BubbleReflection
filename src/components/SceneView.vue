<template>
  <div class="view" ref="view">
    <!--  create a ThreeJS renderer (TroisJS)  -->
    <Renderer ref="renderer" resize="true">
      <!--  create a ThreeJS camera (TroisJS)  -->
      <Camera
        ref="camera"
        :position="{ z: 10 }"
        :fov="60"
        :aspect="aspect"
        :near="0.1"
        :far="1000"
      />
      <!--  create a ThreeJS scene (TroisJS)  -->
      <Scene ref="scene">
        <!--  create a ThreeJS light (TroisJS)  -->
        <DirectionalLight color="#ffffff" :position="{ z: 3 }" />
        <!--  create a ThreeJS plane mesh (TroisJS)  -->
        <Plane ref="plane" :width="22" :height="20"></Plane>
        <!--  create a ThreeJS sphere mesh (TroisJS)  -->
        <Sphere
          v-for="i in sphereProps"
          :key="i.index"
          :ref="spheresRef"
          :radius="i.radius"
          :widthSegments="256"
          :heightSegments="256"
          :rotation="i.rotation"
          :position="i.position"
        >
          <ShaderMaterial :props="props" />
        </Sphere>
      </Scene>
    </Renderer>
  </div>
</template>

<script setup>
// import
import { onMounted, ref } from "vue";
import * as three from "three";
import * as dat from "dat.gui";
import { shaders } from "@/shaders/bubble.shaders";
import park from "@/images/park.jpg";

const view = ref(null); // Get element view
const renderer = ref(null); // Get ThreeJS render
const scene = ref(null); // Get ThreeJS scene
const camera = ref(null); // Get ThreeJS camera
// Get ThreeJS sphere
const sphereN = 6;
const sphereProps = ref([]);
const distance = (sphereA, sphereB) => {
  return Math.sqrt(
    Math.pow(sphereA.x - sphereB.x, 2) + Math.pow(sphereA.y - sphereB.y, 2)
  );
};
for (let i = 0; i < sphereN; i++) {
  const prop = {
    index: i,
    radius: (Math.random() + 1.0) / 2.0,
    position: {
      x: (Math.random() - 0.9) * 10,
      y: (Math.random() - 0.5) * 10,
      z: 0,
    },
    rotation: { x: 0, y: 0, z: 0 },
    positiveDirection: Math.random() > 0.5 ? 1 : 0,
  };
  // Avoid bubble overlapping
  for (let j = 0; j < i; j++) {
    while (
      distance(prop.position, sphereProps.value[j].position) <
      prop.radius * 2 + sphereProps.value[j].radius * 2 + 0.3
    ) {
      prop.position = {
        x: (Math.random() - 0.9) * 10,
        y: (Math.random() - 0.5) * 10,
        z: 0,
      };
    }
  }
  // setup init rotation value
  prop.rotation.y = prop.position.x / 25.0 + 0.001;
  sphereProps.value.push(prop);
}
const spheres = ref([]);
const spheresRef = (el) => {
  if (el) {
    spheres.value.push(el);
  }
};
const plane = ref(null); // Get ThreeJS plane
let aspect = 1; // Camera aspect
// image texture
const loader = new three.TextureLoader();
const imageTexture = loader.load(park, () => {
  console.log("texture loaded");
});
// Material Props
let props = {
  uniforms: {
    u_directionalLightPos: {
      type: "v3",
      value: new three.Vector3(0.0, 5.0, 5.0),
    },
    u_directionalLightColor: {
      type: "v3",
      value: new three.Vector3(1.0, 1.0, 1.0),
    },
    u_ambientLightColor: {
      type: "v3",
      value: new three.Vector3(0.1, 0.1, 0.1),
    },
    u_materialColor: { type: "v3", value: new three.Vector3(1.0, 1.0, 1.0) },
    u_backgroundColor: {
      type: "v3",
      value: new three.Vector3(0.4, 0.45, 0.4),
    },
    u_surfaceThickness: { type: "f", value: 600.0 },
    u_refractiveIndex: { type: "f", value: 1.33 },
    u_texture: { type: "t", value: imageTexture },
    u_alpha: { value: 0.8 },
  },
  vertexShader: shaders.vert,
  fragmentShader: shaders.frag,
  wireframe: false,
  transparent: true,
  side: three.DoubleSide,
};
// Animation
const animation = { speed: 300 };
// Setup DatGUI
const gui = new dat.GUI();
const bubbleFolder = gui.addFolder("Bubble");
bubbleFolder
  .add(props.uniforms.u_surfaceThickness, "value", 0.0, 1000.0, 1.0)
  .name("Thickness");
bubbleFolder
  .add(props.uniforms.u_refractiveIndex, "value", 1.0, 10.0, 0.01)
  .name("Refractive Index");
bubbleFolder.add(props.uniforms.u_alpha, "value", 0.0, 1.0, 0.01).name("Alpha");
bubbleFolder.open();
const lightFolder = gui.addFolder("Light");
lightFolder
  .add(props.uniforms.u_directionalLightPos.value, "x", -10.0, 10.0, 0.1)
  .name("X");
lightFolder
  .add(props.uniforms.u_directionalLightPos.value, "y", 0.0, 10.0, 0.1)
  .name("Y");
lightFolder
  .add(props.uniforms.u_directionalLightPos.value, "z", 0.0, 10.0, 0.1)
  .name("Z");
lightFolder
  .add(props.uniforms.u_directionalLightColor.value, "x", 0.0, 1.0, 0.01)
  .name("R");
lightFolder
  .add(props.uniforms.u_directionalLightColor.value, "y", 0.0, 1.0, 0.01)
  .name("G");
lightFolder
  .add(props.uniforms.u_directionalLightColor.value, "z", 0.0, 1.0, 0.01)
  .name("B");
lightFolder.open();
const bgFolder = gui.addFolder("Background");
bgFolder
  .add(props.uniforms.u_backgroundColor.value, "x", 0.0, 1.0, 0.01)
  .name("R");
bgFolder
  .add(props.uniforms.u_backgroundColor.value, "y", 0.0, 1.0, 0.01)
  .name("G");
bgFolder
  .add(props.uniforms.u_backgroundColor.value, "z", 0.0, 1.0, 0.01)
  .name("B");
bgFolder.open();
const animationFolder = gui.addFolder("Animation");
animationFolder.add(animation, "speed", 100, 400, 1).name("Speed");
animationFolder.open();
// Page Mounted
onMounted(() => {
  // Update camera aspect with width&height of view
  aspect =
    window.getComputedStyle(view.value).width /
    window.getComputedStyle(view.value).height;
  // setup plane
  plane.value.mesh.material = new three.MeshStandardMaterial({
    map: imageTexture,
  });
  // animation
  renderer.value.onBeforeRender(() => {
    for (let i = 0; i < sphereN; i++) {
      // adjust the center of bubble
      spheres.value[i].mesh.rotation.y =
        -spheres.value[i].mesh.position.x / 12.0;
      spheres.value[i].mesh.rotation.x =
        spheres.value[i].mesh.position.y / 10.0;
      // move the bubble
      if (sphereProps.value[i].positiveDirection) {
        spheres.value[i].mesh.position.x +=
          Math.random() / (500.0 - animation.speed);
      } else {
        spheres.value[i].mesh.position.x -=
          Math.random() / (500.0 - animation.speed);
      }
      spheres.value[i].mesh.position.y +=
        Math.random() / (500.0 - animation.speed);
      // if bubble run out of view, let bubble back to view
      if (spheres.value[i].mesh.position.x < -13) {
        spheres.value[i].mesh.position.x = 13;
      } else if (spheres.value[i].mesh.position.x > 13) {
        spheres.value[i].mesh.position.x = -13;
      }
      if (spheres.value[i].mesh.position.y > 7) {
        spheres.value[i].mesh.position.y = -7;
      }
    }
  });
});
</script>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}
.view {
  height: 100%;
}
</style>
