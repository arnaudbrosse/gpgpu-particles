uniform float uTime;
uniform float uDelta;
uniform float uSize;
uniform sampler2D uTexturePosition;

attribute vec2 reference;

void main() {
	vec3 position = texture2D(uTexturePosition, reference).xyz;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	gl_PointSize = uSize;
}