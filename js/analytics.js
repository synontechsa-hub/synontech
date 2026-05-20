(function () {
  // Add your GA4 Measurement ID here, for example: G-XXXXXXXXXX
  const measurementId = 'G-M547HLMYPT';

  if (measurementId) {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }

    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', measurementId);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  // Vercel Web Analytics
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  const vaScript = document.createElement('script');
  vaScript.defer = true;
  vaScript.src = '/_vercel/insights/script.js';
  document.head.appendChild(vaScript);
})();
