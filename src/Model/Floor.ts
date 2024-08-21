import {
  Box3,
  BoxGeometry,
  BufferGeometry,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three"

export default class Floor {
  #location: Vector3
  #geometry: BufferGeometry
  #boundingBox: Box3
  #material: MeshStandardMaterial
  #mesh: Mesh
  #distance: number

  constructor(floorHeight: number) {
    const geometry = new BoxGeometry(13, 10.5, 2)

    this.#material = new MeshStandardMaterial({
      color: 0x507d2c,
      emissive: 0xffffff,
      emissiveIntensity: 0,
    })

    this.#mesh = new Mesh(geometry, this.#material)

    this.#mesh.rotation.x = Math.PI / 2
    this.#mesh.position.x -= 1.5
    this.#mesh.position.y += floorHeight
    this.#mesh.position.z -= 0.1
    this.#mesh.updateMatrixWorld(true)

    this.#boundingBox = new Box3().setFromObject(this.#mesh)
    const center = new Vector3()
    this.#boundingBox.getCenter(center)
    this.#location = center
  }

  get boundingBox() {
    return this.#boundingBox
  }
  get geometry() {
    return this.#geometry
  }

  get distance() {
    return this.#distance
  }

  get mesh() {
    return this.#mesh
  }

  get location() {
    return this.#location
  }

  get material() {
    return this.#material
  }
}
