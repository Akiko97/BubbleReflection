export const shaders = {
  frag: `
varying vec2 vUv;
uniform sampler2D u_texture; // Landscape
uniform float u_alpha; // Alpha
uniform float u_center;
uniform vec2 u_posOffset;
void main() {
  vec2 uv = vUv;
  // left side of bubble
  if( uv.x < u_center )
    uv = vec2( u_center - uv.x, ( 0.6 - uv.y ) * 2.0 ); // flip side up and move to the bottom left.
  // right side of bubble
  else
    uv = vec2( uv.x - u_center, ( uv.y - 0.4 ) * 2.0 ); // move to the top right.
  uv = vec2( fract( uv.x * 4.0 ), uv.y );
  // distortion
  vec2 uvOffset = 0.01 * vec2( cos( uv.y * 20. ), sin( uv.x * 20. ) );
  vec3 color = texture2D( u_texture, uv + uvOffset + u_posOffset  ).rgb;
  gl_FragColor = vec4( color, u_alpha );
}`,
  vert: `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,
};
