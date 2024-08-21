import { expect, test, vi } from "vitest"
import BuildingViewMediator from "./BuildingViewMediator"
import { Scene, Vector3 } from "three"
import Building from "src/Model/Building"
import Observable from "src/Observable"
import pause from "src/utils/async/pause"

test(".lightTargetPosition should place cube correctly", () => {
  const centerVector = { x: 2, y: 2, z: 6 }

  class MockBuilding {
    boundingBox = {
      getCenter(vector: Vector3) {
        vector.copy(centerVector)
      },
    }
  }

  const building = new MockBuilding() as unknown as Building
  const buildingViewMediator = new BuildingViewMediator(null, building)
  const cube = buildingViewMediator.lightTargetPosition(new Scene())
  expect(cube.position).toEqual({ x: 2, y: 2, z: 6 })
})

test("observer receives FloorChanged event on floor change", async () => {
  class MockBuilding {
    floors = []
  }
  const building = new MockBuilding() as unknown as Building

  const methods = {
    func: vi.fn(),
  }

  Observable.addObserver("FloorChanged", methods.func)

  const buildingViewMediator = new BuildingViewMediator(null, building)

  const animateSpy = vi
    .spyOn(buildingViewMediator, "animateToFloor")
    .mockImplementation(() => true)

  vi.mock("../utils/async/pause.ts")
  vi.mocked(pause).mockReturnValue(Promise.resolve())

  await buildingViewMediator.floorRotation(0, { initial: false, once: true })
  expect(methods.func).toHaveBeenCalled()
  expect(animateSpy).toHaveBeenCalled()
})
