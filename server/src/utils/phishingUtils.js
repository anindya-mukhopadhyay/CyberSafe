const suspiciousTlds = ['.xyz', '.top', '.tk', '.gq', '.ml', '.work', '.buzz'];
const suspiciousKeywords = [
  'login',
  'verify',
  'update',
  'secure',
  'bank',
  'paypal',
  'wallet',
  'signin',
  'password',
  'crypto',
  'account',
];

const ipAddressRegex = /^(?:\d{1,3}\.){3}\d{1,3}$/;

const hasSuspiciousPatterns = (hostname, fullUrl) => {
  const reasons = [];

  if (ipAddressRegex.test(hostname)) {
    reasons.push('Domain is an IP address instead of a trusted domain name');
  }

  if (fullUrl.includes('@')) {
    reasons.push('URL contains @ symbol which can hide malicious redirects');
  }

  if (hostname.split('.').length > 4) {
    reasons.push('Domain has too many subdomains (possible obfuscation)');
  }

  if (hostname.length > 30) {
    reasons.push('Domain name is unusually long');
  }

  return reasons;
};

export const analyzePhishingRisk = (inputUrl) => {
  const result = {
    isSuspicious: false,
    score: 0,
    reasons: [],
    normalizedUrl: '',
  };

  try {
    const withProtocol = /^https?:\/\//i.test(inputUrl) ? inputUrl : `https://${inputUrl}`;
    const parsed = new URL(withProtocol);
    const hostname = parsed.hostname.toLowerCase();
    const fullUrl = parsed.href.toLowerCase();

    result.normalizedUrl = parsed.href;

    const tldMatched = suspiciousTlds.find((tld) => hostname.endsWith(tld));
    if (tldMatched) {
      result.score += 30;
      result.reasons.push(`Domain uses high-risk TLD (${tldMatched})`);
    }

    const keywordMatches = suspiciousKeywords.filter(
      (keyword) => hostname.includes(keyword) || fullUrl.includes(keyword)
    );

    if (keywordMatches.length > 0) {
      result.score += Math.min(30, keywordMatches.length * 8);
      result.reasons.push(`Suspicious keywords found: ${keywordMatches.join(', ')}`);
    }

    const patternReasons = hasSuspiciousPatterns(hostname, fullUrl);
    if (patternReasons.length > 0) {
      result.score += Math.min(40, patternReasons.length * 12);
      result.reasons.push(...patternReasons);
    }

    const hasHighRiskSignal = result.reasons.some(
      (reason) =>
        reason.includes('high-risk TLD') || reason.includes('IP address instead of a trusted domain')
    );
    result.isSuspicious = result.score >= 30 || hasHighRiskSignal;
  } catch (error) {
    return {
      isSuspicious: true,
      score: 100,
      reasons: ['Invalid URL format'],
      normalizedUrl: inputUrl,
    };
  }

  return result;
};
