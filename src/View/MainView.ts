import BuildingViewMediator from "src/Mediator/BuildingViewMediator"
import RenderingContext from "src/RenderingContext"

export default class MainView {
  renderingContext: RenderingContext
  buildingViewMediator: BuildingViewMediator
  constructor(
    renderingContext: RenderingContext,
    buildingViewMediator: BuildingViewMediator
  ) {
    this.renderingContext = renderingContext
    this.buildingViewMediator = buildingViewMediator
  }

  async initializeBuilding() {
    const scene = this.renderingContext.scene
    await this.buildingViewMediator.makeObject3D(scene)
    this.buildingViewMediator.addFloors(scene)
    this.buildingViewMediator.illumiateObject(scene)
  }

  frameScene() {
    const center = this.buildingViewMediator.getCenter()
    this.renderingContext.controls.target.copy({ ...center, x: center.x + 10 })
  }

  async initialize() {
    await this.initializeBuilding()
    this.frameScene()
    this.buildingViewMediator.floorRotation(0, { initial: true })
    this.render()

    window.addEventListener("resize", (e) => this.onWindowResize(), false)
  }

  render() {
    this.renderingContext.controls.update()
    requestAnimationFrame(() => this.render())
    this.renderingContext.composer.render()
  }

  onWindowResize() {
    this.renderingContext.camera.aspect = window.innerWidth / window.innerHeight
    this.renderingContext.camera.updateProjectionMatrix()
    this.renderingContext.controls.updateProjectionMatrix()
    this.renderingContext.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
