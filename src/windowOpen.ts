const calculateChildPosition = function calculateChildPosition({
  parent,
  child,
}) {
  // center the child window relative to the parent window
  return {
    left: (parent.width / 2) - (child.width / 2) + parent.left,
    top: (parent.height / 2) - (child.height / 2) + parent.top,
  };
};

const windowOpen = function windowOpen({
  url,
  onClosed,
}: {
  url: string,
  onClosed: Function,
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

  const newWindow = window.open(url, 'eID Easy', features.join(', '));
  console.log(url);

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
