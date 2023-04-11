import Didact from "./core"
import createElement from "./core/createElement"

const container = document.getElementById('app')

const element = Didact.createElement(
  'div',
  { id: 'foo' },
  'Hello World',
)

Didact.render(element, container)