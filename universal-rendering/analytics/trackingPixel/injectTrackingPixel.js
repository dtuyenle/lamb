const injectTrackingPixel = (trackingPixelRequestUrl) => {
  const div = document.createElement('div');
  div.style.display = 'none';
  const img = document.createElement(('img'));
  img.src = trackingPixelRequestUrl;
  img.alt = 'visitor tracking pixel';
  img.id = 'tracking_pixel';
  div.appendChild(img);
  document.body.appendChild(div);
};

export default injectTrackingPixel;
