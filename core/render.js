let count = 0;

function render(element, container) {
  const dom =
    element.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(element.type);
  const isProperty = (key) => key !== 'children';
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });
  element.props.children.forEach((child) => render(child, dom));
  container.appendChild(dom);
}

// 下一个渲染单元
let nextUnitOfWork = null;

function workLoop(deadline) {
  // 是否应该终止渲染
  shouldYield = false;

  // 如果 持续有渲染单元 且 不应终止渲染
  while (nextUnitOfWork && !shouldYield) {
    // 执行并取得下一渲染单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 判断线程是否繁忙, 繁忙则终止渲染
    shouldYield = deadline.timeRemaining() < 1;
  }
  // 重新请求
  requestIdleCallback(workLoop);
}

// 请求在空闲时执行渲染
requestIdleCallback(workLoop);

// 执行渲染单元 并 返回下一渲染单元
function performUnitOfWork(nextUnitOfWork) {
  // TODO
}

export default render;
