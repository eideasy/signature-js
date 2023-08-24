import Logger from './Logger';

interface Parent {
  width: number,
  height: number,
  left: number,
  top: number,
}

interface Child {
  width: number,
  height: number,
}
const calculateChildPosition = function calculateChildPosition({
  parent,
  child,
}: {
  parent: Parent,
  child: Child,
}) {
  // center the child window relative to the parent window
  return {
    left: (parent.width / 2) - (child.width / 2) + parent.left,
    top: (parent.height / 2) - (child.height / 2) + parent.top,
  };
};

const windowOpen = function windowOpen({
  target,
  url,
  onClosed,
  logger,
}: {
  target: string,
  url: string,
  onClosed: Function,
  logger: Logger,
}) {
  const child = {
    width: 800,
    height: 600,
  };

  const childPosition = calculateChildPosition({
    parent: {
      width: window.outerWidth,
      height: window.outerHeight,
      left: window.screenLeft,
      top: window.screenTop,
    },
    child,
  });

  const features = [
    'toolbar=no',
    'location=no',
    'directories=no',
    'status=no',
    'menubar=no',
    'scrollbars=no',
    'resizable=no',
    'copyhistory=no',
    `width=${child.width}`,
    `height=${child.height}`,
    `left=${childPosition.left}`,
    `top=${childPosition.top}`,
  ];

  logger.info('Opening window at url: ', url);
  const newWindow = window.open(url, target, features.join(', '));

  const timer = setInterval(() => {
    if (newWindow.closed) {
      clearInterval(timer);
      onClosed();
    }
  }, 500);

  return {
    window: newWindow,
  };
};

export default windowOpen;
export { calculateChildPosition };
