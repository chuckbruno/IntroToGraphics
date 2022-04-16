var raytraceFS = `
struct Ray {
	vec3 pos;
	vec3 dir;
};

struct Material {
	vec3  k_d;	// diffuse coefficient
	vec3  k_s;	// specular coefficient
	float n;	// specular exponent
};

struct Sphere {
	vec3     center;
	float    radius;
	Material mtl;
};

struct Light {
	vec3 position;
	vec3 intensity;
};

struct HitInfo {
	float    t;
	vec3     position;
	vec3     normal;
	Material mtl;
};

uniform Sphere spheres[ NUM_SPHERES ];
uniform Light  lights [ NUM_LIGHTS  ];
uniform samplerCube envMap;
uniform int bounceLimit;

bool IntersectRay( inout HitInfo hit, Ray ray );

// Shades the given point and returns the computed color.
vec3 Shade( Material mtl, vec3 position, vec3 normal, vec3 view )
{
	vec3 color = vec3(0,0,0);
	vec3 specular = vec3(0,0,0);
	for ( int i=0; i<NUM_LIGHTS; ++i ) {

		// TO-DO: Check for shadows
		vec3 lightDir = normalize(lights[i].position - position);
		vec3 relLight = reflect(-lightDir, normal);
		Ray r;
		r.dir = lightDir;
		r.pos = position;
		HitInfo h;

		if (!IntersectRay( h, r ))
		{
			vec3 lightDir = normalize(lights[i].position - position);
			float c = dot(lightDir, normalize(normal));
			if(c > 0.0)
			{
				vec3 clr = c * mtl.k_d;
				vec3 halfVec = normalize(view + lightDir);
				float s = dot(normalize(normal), halfVec );
				if(s > 0.0)
				{
					// float spec = pow(s, mtl.n);
					clr += mtl.k_s * pow(s, mtl.n);
					// specular = mtl.k_s * spec * lights[i].intensity ;
					color += clr ;//* lights[i].intensity;
				}
			}
			// float diff = max(dot(lightDir, normalize(normal)), 0.0);
			// vec3 diffuse = mtl.k_d * diff;
			// vec3 diffuse = mtl.k_d * lights[i].intensity * diff;
			

			// float spec = pow(max(dot(normalize(normal), halfVec), 0.0), mtl.n);
			// vec3 specular = mtl.k_s * spec ;
			// vec3 specular = mtl.k_s * spec * lights[i].intensity ;

			// color += clr * light[i].intensity;
			// color += (diffuse + specular);

		}
		// TO-DO: If not shadowed, perform shading using the Blinn model
		// else{
		// 	color += mtl.k_d * lights[i].intensity + specular;	// change this line
		// }
	}
	return color;
}

// Intersects the given ray with all spheres in the scene
// and updates the given HitInfo using the information of the sphere
// that first intersects with the ray.
// Returns true if an intersection is found.
bool IntersectRay( inout HitInfo hit, Ray ray )
{
	hit.t = 1e30;
	bool foundHit = false;

	for ( int i=0; i<NUM_SPHERES; ++i ) {
		float radius = spheres[i].radius;
		vec3 center = spheres[i].center;
		float a = dot(ray.dir, ray.dir);
		vec3 ptoc = ray.pos - center;
		float b = 2.0 * dot(ray.dir, ptoc);
		float c = dot(ptoc, ptoc) - (radius * radius);
		float delta = b * b - 4.0 * a * c;
		if (delta >=0.0)
		{
			float t = (-b - sqrt(delta)) / (2.0 * a);

			if (t < hit.t && t > 0.0) // not allow big sphere black ray
			{
				foundHit = true;
				hit.t = t;
				hit.mtl = spheres[i].mtl;
				vec3 hitPos = ray.pos + t * ray.dir;
				hit.position = hitPos;
				hit.normal = normalize((hitPos - center));
			}
		}

		// TO-DO: Test for ray-sphere intersection
		// TO-DO: If intersection is found, update the given HitInfo
	}
	return foundHit;
}

// Given a ray, returns the shaded color where the ray intersects a sphere.
// If the ray does not hit a sphere, returns the environment color.
vec4 RayTracer( Ray ray )
{

	HitInfo hit;
	Ray _ray = ray;
	if ( IntersectRay( hit, ray ) ) {
		vec3 view = normalize( -ray.dir );
		vec3 clr = Shade( hit.mtl, hit.position, hit.normal, view );
		
		// Compute reflections
		vec3 k_s = hit.mtl.k_s;
		// Ray r;	// this is the reflection ray
		// HitInfo h;	// reflection hit info
		for ( int bounce=0; bounce<MAX_BOUNCES; ++bounce ) {
			if ( bounce >= bounceLimit ) break;
			if ( hit.mtl.k_s.r + hit.mtl.k_s.g + hit.mtl.k_s.b <= 0.0 ) break;
			
			Ray r;	// this is the reflection ray
			HitInfo h;	// reflection hit info
			
			// TO-DO: Initialize the reflection ray

			r.pos = hit.position;
			r.dir = reflect(_ray.dir, hit.normal);
			
			if ( IntersectRay( h, r ) ) {
					vec3 view = normalize( -r.dir );
					vec3 clr_temp = Shade( h.mtl, h.position, h.normal, view );
					clr += clr_temp;

					_ray.dir = r.dir;
					_ray.pos = h.position;
					hit.position = h.position;
					hit.normal = h.normal;
					hit.mtl = h.mtl;
				
					// HitInfo g;	// reflection hit info

					// r.pos = h.position;
					// r.dir = reflect(r.dir, h.normal);
					// if ( IntersectRay( g, r ) ) {
					// 	vec3 view = normalize( -r.dir );
					// 	vec3 clr_temp = Shade( g.mtl, g.position, g.normal, view );
					// 	clr += clr_temp;
			
					// }
					// else 
					// {
					// 	// The refleciton ray did not intersect with anything,
					// 	// so we are using the environment color
					// 	clr += hit.mtl.k_s * textureCube( envMap, r.dir.xzy ).rgb;
					// 	break;	// no more reflections
					// }
					
					// TO-DO: Initialize the reflection ray
					// TO-DO: Hit found, so shade the hit point
				// TO-DO: Update the loop variables for tracing the next reflection ray
			} 
			else 
			{
				// The refleciton ray did not intersect with anything,
				// so we are using the environment color
				clr += hit.mtl.k_s * textureCube( envMap, r.dir.xzy ).rgb;
				break;	// no more reflections
			}
		}
		return vec4( clr, 1 );	// return the accumulated color, including the reflections
	} else {
		return vec4( textureCube( envMap, ray.dir.xzy ).rgb, 0 );	// return the environment color
	}
}
`;