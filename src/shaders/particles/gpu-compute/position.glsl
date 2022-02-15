uniform float uTime;
uniform float uDelta;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;

	vec3 position = texture2D(v_samplerPosition, uv).xyz;
	vec3 velocity = texture2D(v_samplerVelocity, uv).xyz;

	position += velocity * 0.01;

	gl_FragColor = vec4(position, 1.);
}