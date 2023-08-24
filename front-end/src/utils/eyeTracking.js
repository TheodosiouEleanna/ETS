// export const normalizeCoordinates = (x, y) => {
//   const screenWidth = window.screen.width;
//   const screenHeight = window.screen.height;

//   const normalizedX = x / screenWidth;
//   const normalizedY = y / screenHeight;

//   return [normalizedX, normalizedY];
// };

// document.addEventListener("mousemove", (event) => {
//   const xPixel = event.clientX;
//   const yPixel = event.clientY;

//   const [xNormalized, yNormalized] = normalizeCoordinates(xPixel, yPixel);

//   console.log(`Clicked at pixel coordinates: (${xPixel}, ${yPixel})`);
//   console.log(`Normalized coordinates: (${xNormalized}, ${yNormalized})`);
// });

export const createRedPoint = (normalizedX, normalizedY) => {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  const actualX = normalizedX * document.documentElement.scrollWidth;
  const actualY = normalizedY * document.documentElement.scrollHeight;

  // Check if a red point already exists and remove it
  const existingPoint = document.getElementById("eyeTrackingPoint");
  if (existingPoint) {
    existingPoint.remove();
  }

  const point = document.createElement("div");
  point.id = "eyeTrackingPoint"; // Set an id for easy reference
  point.style.position = "fixed";
  point.style.left = `${actualX}px`;
  point.style.top = `${actualY}px`;
  point.style.border = "2px solid red";
  point.style.borderRadius = "50%";
  point.style.width = "20px";
  point.style.height = "20px";
  point.style.transform = "translateX(-50%) translateY(-50%)";
  point.style.pointerEvents = "none";
  point.style.transition = "all 300ms ease-out";
  point.style.zIndex = 999;

  //   point.style.position = "absolute";
  //   point.style.left = `${actualX}px`;
  //   point.style.top = `${actualY}px`;
  //   point.style.width = "5px"; // size of the point
  //   point.style.height = "5px";
  //   point.style.backgroundColor = "red";
  //   point.style.borderRadius = "50%"; // makes the point circular
  //   point.style.zIndex = 10000; // ensures the point appears on top of other elements

  document.body.appendChild(point);
};
