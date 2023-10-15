import rateLimit from 'express-rate-limit';

const customizeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
});

export default {
  customizeLimiter
}