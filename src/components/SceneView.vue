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
        <PointLight :position="{ z: 3 }" />
        <!--  create a ThreeJS sphere (TroisJS)  -->
        <Sphere
          ref="sphere"
          :radius="2"
          :widthSegments="40"
          :heightSegments="40"
          :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }"
        >
          <ShaderMaterial :props="props" />
        </Sphere>
      </Scene>
    </Renderer>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as three from "three";
import * as dat from "dat.gui";
import { shaders } from "@/shaders/bubble.shaders";
const view = ref(null); // Get element view
const renderer = ref(null); // Get ThreeJS render
const scene = ref(null); // Get ThreeJS scene
const camera = ref(null); // Get ThreeJS camera
const sphere = ref(null); // Get ThreeJS sphere
let aspect = 1; // Camera aspect
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
      value: new three.Vector3(0, 0, 0),
    },
    u_surfaceThickness: { type: "f", value: 600.0 },
    u_refractiveIndex: { type: "f", value: 1.33 },
  },
  vertexShader: shaders.vert,
  fragmentShader: shaders.frag,
  wireframe: false,
};
// Setup DatGUI
const gui = new dat.GUI();
const bubbleFolder = gui.addFolder("Bubble");
bubbleFolder
  .add(props.uniforms.u_surfaceThickness, "value", 0.0, 1000.0, 1.0)
  .name("Thickness");
bubbleFolder
  .add(props.uniforms.u_refractiveIndex, "value", 1.0, 10.0, 0.01)
  .name("Refractive Index");
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
// Page Mounted
onMounted(() => {
  // Update camera aspect with width&height of view
  aspect =
    window.getComputedStyle(view.value).width /
    window.getComputedStyle(view.value).height;
  // animation
  renderer.value.onBeforeRender(() => {
    const mesh = sphere.value.mesh;
    mesh.rotation.x += 0.01;
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
