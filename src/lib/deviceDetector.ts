export interface DeviceDetails {
  os: string;
  model: string;
  browser: string;
  resolution: string;
  userAgent: string;
}

export function getDeviceDetails(): DeviceDetails {
  if (typeof window === 'undefined') {
    return {
      os: 'Server',
      model: 'Unknown',
      browser: 'Server',
      resolution: 'Unknown',
      userAgent: 'Server',
    };
  }

  const ua = window.navigator.userAgent;
  const resolution = `${window.innerWidth}x${window.innerHeight}`;

  // OS Detection
  let os = 'Unknown OS';
  if (/iPhone|iPad|iPod/i.test(ua)) {
    os = 'iOS';
  } else if (/Android/i.test(ua)) {
    os = 'Android';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = 'macOS';
  } else if (/Windows NT/i.test(ua)) {
    os = 'Windows';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
  }

  // Model / Device Brand Detection
  let model = 'Generic Desktop';
  if (os === 'iOS') {
    if (/iPhone/i.test(ua)) model = 'iPhone';
    else if (/iPad/i.test(ua)) model = 'iPad';
    else model = 'iOS Device';
  } else if (os === 'Android') {
    // Try to extract Android model name from User Agent
    const match = ua.match(/Android\s+[^;]+;\s+([^;)]+)/);
    if (match && match[1]) {
      model = match[1].trim();
    } else {
      model = 'Android Device';
    }
  }

  // Browser Detection
  let browser = 'Unknown Browser';
  if (/Chrome/i.test(ua) && !/Chromium|Edge|OPR/i.test(ua)) {
    browser = 'Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Safari';
  } else if (/Firefox/i.test(ua)) {
    browser = 'Firefox';
  } else if (/Edge|Edg/i.test(ua)) {
    browser = 'Edge';
  } else if (/OPR|Opera/i.test(ua)) {
    browser = 'Opera';
  }

  return {
    os,
    model,
    browser,
    resolution,
    userAgent: ua,
  };
}
