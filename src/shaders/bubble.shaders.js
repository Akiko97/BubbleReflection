export const shaders = {
  frag: `
const float PI = 3.14159265358979323846;

varying vec3 v_mvViewPosition;
varying vec3 v_mvNormal;

uniform vec3 u_directionalLightPos;
uniform vec3 u_directionalLightColor;
uniform vec3 u_ambientLightColor;
uniform vec3 u_materialColor;
uniform vec3 u_backgroundColor;
uniform float u_surfaceThickness; // nm
uniform float u_refractiveIndex;

const vec3 wavelengths = vec3( 620.0, 530.0, 485.0 ); // nm

vec3 getInterferenceColor() {
  vec3 interferenceColor = u_directionalLightColor;

  float cos_theta = max( dot(normalize(u_directionalLightPos), v_mvNormal), dot(normalize(u_directionalLightPos), -v_mvNormal) );
  float sin_phi_squared = ( 1.0 - pow( cos_theta, 2.0 ) ) / pow( u_refractiveIndex, 2.0 );
  float distanceDiff = ( 2.0 * u_surfaceThickness * sqrt(sin_phi_squared) ) / sqrt( 1.0 - sin_phi_squared );

  interferenceColor *= 0.5 * sqrt( 2.0 + 2.0 * cos( 2.0 * PI * distanceDiff / wavelengths ) );

  return interferenceColor;
}

void main() {
  vec3 ambientColor = u_ambientLightColor * u_materialColor;
  vec3 diffuseColor = max( 0.0, dot( normalize(u_directionalLightPos), v_mvNormal ) ) * u_directionalLightColor * u_materialColor;
  vec3 interferenceColor = getInterferenceColor();
  gl_FragColor.rgb = mix( u_backgroundColor, ambientColor + diffuseColor + interferenceColor, 0.1 );
  gl_FragColor.a = 1.0;
}`,
  vert: `
varying vec3 v_mvViewPosition;
varying vec3 v_mvNormal;

void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vec4 mvPosition =  viewMatrix * worldPosition;
  gl_Position = projectionMatrix * mvPosition;

  v_mvViewPosition = -mvPosition.xyz;
  v_mvNormal = normalize( normalMatrix * normal );
}`,
};
