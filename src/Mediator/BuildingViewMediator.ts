import {
  BoxGeometry,
  DirectionalLight,
  DirectionalLightHelper,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Object3D,
  Object3DEventMap,
  Scene,
  Vector3,
} from "three"
import Building from "src/Model/Building"
import { OBJLoader } from "src/bin/OBJLoader.js"
import ifDebugDo from "src/utils/debug/ifDebugDo"
import RenderingContext from "src/RenderingContext"
import gsap from "gsap"
import pause from "src/utils/async/pause"
import Observable from "src/Observable"
import isFreeCamMode from "src/utils/isFreeCamMode"

const loader = new OBJLoader()

export default class BuildingViewMediator {
  renderingContext: RenderingContext
  building: Building
  constructor(renderingContext: RenderingContext, building: Building) {
    this.renderingContext = renderingContext
    this.building = building
  }

  loadAsset() {
    return new Promise((res: (data: Group<Object3DEventMap>) => void, rej) => {
      loader.load(this.building.assetPath, res, undefined, rej)
    })
  }

  async makeObject3D(scene: Scene) {
    const container = new Object3D()
    const asset = await this.loadAsset()

    asset.traverse((child) => {
      if (child instanceof Mesh) {
        this.building.geometry = child.geometry
        const material = new MeshPhysicalMaterial({
          color: 0x507d2c,
          roughness: 0,
          clearcoat: 1,
        })

        child.material = material
      }
    })
    container.add(asset)
    this.building.object3d = container
    scene.add(this.building.object3d)
  }

  async illumiateObject(scene: Scene) {
    const radius = 60,
      intensity = 6
    const lightPositions = [
      new Vector3(-radius, radius, radius),
      new Vector3(-radius, radius, -radius),
    ]

    const lights = lightPositions.map((position) => {
      const light = new DirectionalLight(0xffffff, intensity)
      light.position.copy(position)
      light.target = this.lightTargetPosition(scene)
      return light
    })

    lights.forEach((light) => {
      scene.add(light)
      scene.add(light.target)

      ifDebugDo(() => {
        const helper = new DirectionalLightHelper(light, 5)
        scene.add(helper)
      })
    })
  }

  addFloors(scene: Scene) {
    for (const floor of this.building) {
      scene.add(floor.mesh)
    }
  }

  lightTargetPosition(scene: Scene) {
    const center = new Vector3()
    this.building.boundingBox.getCenter(center)

    const geometry = new BoxGeometry(0, 0)
    const material = new MeshBasicMaterial({ transparent: true })
    const cube = new Mesh(geometry, material)
    cube.position.copy(center)
    scene.add(cube)

    return cube
  }

  async floorRotation(index: number, options: { initial: boolean; once?: boolean }) {
    await pause(1000)
    this.animateToFloor(index, options)
    Observable.emit("FloorChanged", index)
    const maxFloorIndex = this.building.floors.length - 1
    await pause(4000)

    if (!options.once) {
      this.floorRotation(index === maxFloorIndex ? 0 : index + 1, { initial: false })
    }
  }

  animateToFloor(index: number, { initial }: { initial: boolean }) {
    let x, y, z, emissiveIntensity

    try {
      ;({ x, y, z } = this.building.floors[index].location)
      emissiveIntensity = this.building.floors[index].material.emissiveIntensity
    } catch (err) {
      console.error(err)
    }

    const duration = 2

    const targetStart = this.renderingContext.controls.target.clone()
    gsap.to(targetStart, {
      x,
      y,
      z,
      duration,
      ease: initial ? "power4.out" : "power3.inOut",
      onUpdate: () => {
        this.renderingContext.controls.target.set(
          targetStart.x,
          targetStart.y,
          targetStart.z
        )
      },
    })

    const targetX = x - 6
    const targetY = y - 8
    const targetZ = z - 36

    if (!isFreeCamMode()) {
      const positionStart = this.renderingContext.camera.position.clone()
      gsap.to(positionStart, {
        x: targetX,
        y: targetY,
        z: targetZ,
        duration,
        ease: initial ? "power4.out" : "power3.inOut",
        onUpdate: () => {
          this.renderingContext.camera.position.set(
            positionStart.x,
            positionStart.y,
            positionStart.z
          )
        },
      })
    }

    const startIntensity = { value: emissiveIntensity }
    gsap.to(startIntensity, {
      value: 30,
      duration: duration * 0.75,
      delay: duration * 0.25,
      ease: "power2.inOut",
      onUpdate: () => {
        this.building.floors[index].material.emissiveIntensity = startIntensity.value
      },
    })

    for (let i = 0; i < this.building.floors.length; i++) {
      const floor = this.building.floors[i]
      if (i !== index && floor.material.emissiveIntensity > 0) {
        const startIntensity = { value: floor.material.emissiveIntensity }
        gsap.to(startIntensity, {
          value: 0,
          duration: duration / 2,
          ease: "power2.inOut",
          onUpdate: () => {
            this.building.floors[i].material.emissiveIntensity = startIntensity.value
          },
        })
      }
    }
  }

  getCenter() {
    const center = new Vector3()
    this.building.boundingBox.getCenter(center)
    return center
  }
}
