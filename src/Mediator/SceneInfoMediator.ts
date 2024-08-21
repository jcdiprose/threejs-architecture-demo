import Observable from "src/Observable"

const textContent = [
  {
    name: "Commercial",
    cost: "$313 per foot",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    name: "Residential",
    cost: "$388 per foot",
    description:
      "Lorem ipsum odor amet, consectetuer adipiscing elit. Primis volutpat morbi nibh suscipit sem. Inceptos parturient fusce quam eu odio et iaculis.",
  },
  {
    name: "Penthouse",
    cost: "$846 per foot",
    description:
      "Amet egestas varius vivamus suscipit dignissim. Sagittis velit laoreet eleifend nascetur efficitur commodo eu. Ultrices orci vitae velit conubia et quam. Platea facilisi rhoncus dapibus cubilia curae eu.",
  },
]

export default class SceneInfoMediator {
  controls: HTMLDivElement
  titleEl: HTMLHeadingElement
  subtitleEl: HTMLParagraphElement
  descriptionEl: HTMLParagraphElement

  constructor() {
    const domEl = document.createElement("div")
    domEl.classList.add("navigator")
    domEl.classList.add("hidden")
    this.controls = domEl
    document.body.appendChild(domEl)

    Observable.addObserver("FloorChanged", this.renderContent.bind(this))
  }

  /**
   * @param index number
   * Direct DOM manipulation only for this demo.
   * Depends on how the threejs scene interacts with React.. This could a custom event or
   * the app could be built with @react-three/fiber or similar.
   * My preference custom events so three js code can be kept to MVC and easily tested
   */
  renderContent(index: number) {
    // const reactEvent = new CustomEvent('dataToReact', { detail: { somedata: "" } });
    // window.dispatchEvent(reactEvent);

    const content = textContent[index]

    this.controls.classList.remove("hidden")
    const titleEl = this.titleEl ?? document.createElement("h2")
    titleEl.innerText = content.name
    this.titleEl = titleEl

    const subtitleEl = this.subtitleEl ?? document.createElement("p")
    subtitleEl.innerText = content.cost
    this.subtitleEl = subtitleEl

    const descriptionEl = this.descriptionEl ?? document.createElement("p")
    descriptionEl.innerText = content.description
    this.descriptionEl = descriptionEl

    if (this.controls.innerHTML === "") {
      this.controls.appendChild(titleEl)
      this.controls.appendChild(subtitleEl)
      this.controls.appendChild(descriptionEl)
    }
  }
}
