import BuildingViewMediator from "src/Mediator/BuildingViewMediator"
import Building from "src/Model/Building"
import MainView from "src/View/MainView"
import Floor from "./Model/Floor"
import RenderingContext from "./RenderingContext"
import SceneInfoMediator from "./Mediator/SceneInfoMediator"

const building = new Building("assets/building.obj")
building.addFloor(new Floor(20))
building.addFloor(new Floor(40))
building.addFloor(new Floor(66))

const renderingContext = RenderingContext.getDefault()

new SceneInfoMediator()
const buildingViewMediator = new BuildingViewMediator(renderingContext, building)
const mainView = new MainView(renderingContext, buildingViewMediator)
mainView.initialize()
