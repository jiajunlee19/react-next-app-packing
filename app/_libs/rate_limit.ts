import { headers } from "next/headers";

// Trackers keep track of all identifiers during the server-run-time.
// Trackers can get into a very-large object over-time, considering scale-up/clean-up if needed
const trackers = new Map<string, {expiresAt: number, count: number}>();

export async function getIP() {

  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIP = headersList.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIP) {
    return realIP.trim();
  }

  return null;

};

export async function rateLimitByIP(maxRequests: number=60, windowSize=1000*60) {

  const ip = await getIP();
  
  if (!ip) {
    throw new Error('IP address not found !');
  }

  // rate limit with ip as uid
  return rateLimitByUid(ip, maxRequests, windowSize);

};

export async function rateLimitByUid(uid: string, maxRequests: number=60, windowSize=1000*60) {

  // console.log(trackers);

  const now = Date.now();

  // Delete expired items
  const expiredUid: string[] = [];
  trackers.forEach((v, k) => {
    if (now > v.expiresAt) {
      expiredUid.push(k);
    }
  });
  expiredUid.forEach(v => {
    trackers.delete(v);
  });

  // Track current uid, if not exists
  if (!trackers.get(uid)) {
    trackers.set(uid, {expiresAt: now+windowSize, count: 0})
  }

  // Reset tracker if expired
  var tracker = trackers.get(uid) || {expiresAt: now+windowSize, count: 0}
  if (now > tracker.expiresAt) {
    trackers.set(uid, {expiresAt: now+windowSize, count: 0});
  }

  // Return true if count exceeded maxRequests
  tracker = trackers.get(uid) || {expiresAt: now+windowSize, count: 0}
  if (tracker.count >= maxRequests) {
    return true;
  }

  // Increment count and return false
  trackers.set(uid, {expiresAt: tracker.expiresAt, count: tracker.count+1})
  return false;

};