import { GeneratorSettings } from '../types';

// Spanish QWERTY Layout Zones
// Separated by hands for "Easy Typing" flow.
// Note: 'ñ' is typically typed with the right hand pinky.
const LEFT_HAND_LOWER = 'qwertasdfgzxcvb';
const RIGHT_HAND_LOWER = 'yuiophjklñnm';
const LEFT_HAND_UPPER = 'QWERTASDFGZXCVB';
const RIGHT_HAND_UPPER = 'YUIOPHJKLÑNM';
const NUMBERS_LEFT = '12345';
const NUMBERS_RIGHT = '67890';

// Standard accessible symbols on Spanish ISO keyboard (shift + numbers/top row)
const SYMBOLS = '!@#$%&/()=?¿¡*+'; 

const AMBIGUOUS = 'l1IO0';

export const calculateStrength = (password: string): 'Débil' | 'Media' | 'Fuerte' | 'Muy Fuerte' => {
  if (!password) return 'Débil';
  
  let score = 0;
  if (password.length >= 10) score++;
  if (password.length >= 14) score++;
  if (password.length >= 18) score++;
  
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score < 3) return 'Débil';
  if (score < 4) return 'Media';
  if (score < 6) return 'Fuerte';
  return 'Muy Fuerte';
};

export const generatePassword = (settings: GeneratorSettings): string => {
  let password = '';
  
  // Basic charset construction for fallback or standard generation
  const lower = settings.useLowercase ? (LEFT_HAND_LOWER + RIGHT_HAND_LOWER) : '';
  const upper = settings.useUppercase ? (LEFT_HAND_UPPER + RIGHT_HAND_UPPER) : '';
  const nums = settings.useNumbers ? (NUMBERS_LEFT + NUMBERS_RIGHT) : '';
  const syms = settings.useSymbols ? SYMBOLS : '';
  
  let allowed = lower + upper + nums + syms;

  if (settings.useAmbiguous) {
    allowed = allowed.split('').filter(c => !AMBIGUOUS.includes(c)).join('');
  }

  if (allowed.length === 0) return '';

  // "Easy Typing" Algorithm: Alternate hands to simulate flow
  if (settings.easyTyping) {
    // Build separate pools for Left and Right hands
    let leftPool = '';
    let rightPool = '';

    if (settings.useLowercase) {
      leftPool += LEFT_HAND_LOWER;
      rightPool += RIGHT_HAND_LOWER;
    }
    if (settings.useUppercase) {
      leftPool += LEFT_HAND_UPPER;
      rightPool += RIGHT_HAND_UPPER;
    }
    if (settings.useNumbers) {
      leftPool += NUMBERS_LEFT;
      rightPool += NUMBERS_RIGHT;
    }
    if (settings.useSymbols) {
      // Symbols are scattered, but mostly right hand or easy reach. 
      // We'll distribute them to right hand for balance in this specific algorithm 
      // or split them if needed. Let's put them in Right for now as shift-keys 
      // often involve left-shift + right-hand key.
      rightPool += SYMBOLS; 
    }

    if (settings.useAmbiguous) {
      leftPool = leftPool.split('').filter(c => !AMBIGUOUS.includes(c)).join('');
      rightPool = rightPool.split('').filter(c => !AMBIGUOUS.includes(c)).join('');
    }

    // Safety fallback if one hand has no characters enabled
    if (leftPool.length === 0) leftPool = rightPool.length > 0 ? rightPool : allowed;
    if (rightPool.length === 0) rightPool = leftPool.length > 0 ? leftPool : allowed;

    // Start with a random hand
    let useLeft = Math.random() > 0.5;

    for (let i = 0; i < settings.length; i++) {
      const pool = useLeft ? leftPool : rightPool;
      // Double check pool length to prevent NaN
      if (pool.length > 0) {
        password += pool.charAt(Math.floor(Math.random() * pool.length));
      } else {
        // Fallback to allowed if specific hand pool is empty unexpectedly
        password += allowed.charAt(Math.floor(Math.random() * allowed.length));
      }
      useLeft = !useLeft; // STRICT alternation for QWERTY flow
    }

  } else {
    // Standard Random (Cryptographically stronger but harder to type potentially)
    const array = new Uint32Array(settings.length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < settings.length; i++) {
      password += allowed.charAt(array[i] % allowed.length);
    }
  }

  return password;
};