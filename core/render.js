// fiber data structure -> dom
function createDom(fiber) {
  const dom =
    fiber.type === 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type);

  const isProperty = (key) => key !== 'children';
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });

  return dom;
}

// 开始渲染
function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
  };
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
function performUnitOfWork(fiber) {
  // 创建 Dom
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  // 渲染 Dom
  if (fiber.parent) {
    fiber.parent.dom.appendChild(fiber.dom);
  }

  const elements = fiber.props.children;
  index = 0;
  prevSibling = null;
  while (index < elements.length) {
    element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }

  // 先渲染子节点
  if (fiber.child) {
    return fiber.child;
  }

  // 再渲染子兄弟节点
  let nextFiber = fiber;
  while (nextFiber) {
    if (newFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

export default render;
