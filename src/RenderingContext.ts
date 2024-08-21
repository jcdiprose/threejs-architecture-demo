import { OrbitControls } from "src/bin/OrbitControls.js"
import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from "three"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"

export default class RenderingContext {
  scene: Scene
  camera: PerspectiveCamera
  renderer: WebGLRenderer
  controls: OrbitControls
  composer: EffectComposer
  constructor(
    scene: Scene,
    camera: PerspectiveCamera,
    renderer: WebGLRenderer,
    controls: OrbitControls,
    composer: EffectComposer
  ) {
    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.controls = controls
    this.composer = composer
  }

  static getDefault() {
    const width = window.innerWidth,
      height = window.innerHeight
    const scene = new Scene()
    const camera = new PerspectiveCamera(45, width / height, 0.01, 1000)
    camera.position.x = -150
    camera.position.y = 150
    camera.position.z = -200
    camera.zoom = 20
    const renderer = new WebGLRenderer()
    const controls = new OrbitControls(camera, renderer.domElement)

    renderer.setSize(width, height)

    document.body.appendChild(renderer.domElement)

    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    )
    bloomPass.threshold = 0.2
    bloomPass.strength = 0.1
    bloomPass.radius = 0.5
    composer.addPass(bloomPass)

    return new RenderingContext(scene, camera, renderer, controls, composer)
  }
}
