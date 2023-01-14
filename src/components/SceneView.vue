<template>
  <div class="view">
    <!--  create a ThreeJS renderer (TroisJS)  -->
    <Renderer ref="renderer" resize="true">
      <!--  create a ThreeJS camera (TroisJS)  -->
      <Camera ref="camera" :position="{ z: 10 }" />
      <!--  create a ThreeJS scene (TroisJS)  -->
      <Scene ref="scene">
        <!--  create a ThreeJS light (TroisJS)  -->
        <PointLight :position="{ y: 50, z: 50 }" />
        <Box ref="box" :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }">
          <LambertMaterial />
        </Box>
      </Scene>
    </Renderer>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as three from "three";
const renderer = ref(null); // Get ThreeJS render
const scene = ref(null); // Get ThreeJS scene
const camera = ref(null); // Get ThreeJS camera
const box = ref(null); // Get ThreeJS box
onMounted(() => {
  // Using ThreeJS create a sphere
  const geometry = new three.SphereGeometry(0.7, 32, 32);
  const material = new three.MeshBasicMaterial({ color: 0xff0000 });
  const sphere = new three.Mesh(geometry, material);
  scene.value.add(sphere);
  // Create an animation
  renderer.value.onBeforeRender(() => {
    const mesh = box.value.mesh;
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
