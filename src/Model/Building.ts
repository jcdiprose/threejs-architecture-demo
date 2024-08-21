import Observable from "src/Observable"
import { Box3, BufferGeometry, Object3D } from "three"
import Floor from "./Floor"

export default class Building {
  floors: Floor[]
  assetPath: string
  #boundingBox: Box3
  #geometry: BufferGeometry
  #object3d: Object3D

  constructor(assetPath: string) {
    this.floors = []
    this.assetPath = assetPath
  }

  addFloor(floor) {
    this.floors.push(floor)
  }

  set boundingBox(bounds: Box3) {
    this.#boundingBox = bounds
  }

  get boundingBox() {
    return this.#boundingBox
  }

  set geometry(geometry: BufferGeometry) {
    this.#geometry = geometry
    this.#geometry.computeBoundingBox()
    this.#boundingBox = this.#geometry.boundingBox ?? new Box3()
  }

  get geometry() {
    return this.#geometry
  }

  set object3d(object3d: Object3D) {
    this.#object3d = object3d
  }

  get object3d() {
    return this.#object3d
  }

  [Symbol.iterator]() {
    return this.floors.values()
  }
}
