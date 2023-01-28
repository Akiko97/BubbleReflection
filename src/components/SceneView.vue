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
          :ref="sphere"
          :radius="sphereProps.radius"
          :widthSegments="256"
          :heightSegments="256"
          :rotation="sphereProps.rotation"
          :position="sphereProps.position"
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
const sphereProps = {
  radius: 3.0,
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
  rotation: { x: 0, y: 0, z: 0 },
};
const sphere = ref();
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
    u_texture: { type: "t", value: imageTexture },
    u_alpha: { value: 0.8 },
  },
  vertexShader: shaders.vert,
  fragmentShader: shaders.frag,
  wireframe: false,
  transparent: true,
  side: three.DoubleSide,
};
// Setup DatGUI
const gui = new dat.GUI();
const bubbleFolder = gui.addFolder("Bubble");
bubbleFolder.add(props.uniforms.u_alpha, "value", 0.0, 1.0, 0.01).name("Alpha");
bubbleFolder.open();
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
