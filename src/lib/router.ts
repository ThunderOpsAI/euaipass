export type ProductType = "physical" | "digital" | "physical_with_ai";

export interface RouterResult {
  product_type: ProductType;
  has_ai: boolean;
  is_physical: boolean;
  matched_signals: {
    physical: string[];
    digital: string[];
    ai: string[];
  };
}

export interface ScanInput {
  description: string;
  image?: {
    buffer: Buffer;
    mimeType: string;
  } | null;
}

export class ScanValidationError extends Error {
  readonly code = "VALIDATION_ERROR";
  readonly statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = "ScanValidationError";
  }
}

export function validateScanInput(input: ScanInput): void {
  if (!input || input.description === undefined || input.description === null) {
    throw new ScanValidationError("Product description is required.");
  }
  if (typeof input.description !== "string") {
    throw new ScanValidationError("Product description must be a string.");
  }
  const trimmed = input.description.trim();
  if (trimmed.length < 10) {
    throw new ScanValidationError("Product description must be at least 10 characters.");
  }
  if (trimmed.length > 1000) {
    throw new ScanValidationError("Product description cannot exceed 1,000 characters.");
  }
  if (input.image !== undefined && input.image !== null) {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!input.image.mimeType || !allowedMimeTypes.includes(input.image.mimeType)) {
      throw new ScanValidationError("Image must be JPEG, PNG, or WebP format.");
    }
    const maxBytes = 5 * 1024 * 1024;
    if (!input.image.buffer || input.image.buffer.length > maxBytes) {
      throw new ScanValidationError("Image size cannot exceed 5 MB.");
    }
  }
}

const PHYSICAL_PATTERNS: Array<[RegExp, string]> = [
  [/\b(t-shirt|shirt|cotton|hoodie|jacket|apparel|garment|jeans|trousers|sweater|socks|dress|knit|woven|textile|fabric|wool|silk|polyester)\b/i, "apparel/textile"],
  [/\b(shoe|footwear|boot|sneaker|sandal|leather|handbag|backpack|wallet|luggage)\b/i, "footwear/leather"],
  [/\b(mug|tumbler|flask|cup|bottle|kitchenware|cookware|cutlery|plate|ceramic|glassware|furniture|chair|table|mattress|lamp|cushion)\b/i, "homeware/furniture"],
  [/\b(monitor|camera|sensor|device|hardware|drone|uav|quadcopter|robot|machinery|appliance|toy|doll|plush|earbud|headphone|speaker|battery|power\s*bank|charger|cable|wearable|watch|thermostat|lock|doorbell|scanner|printer|vehicle|scooter|bike)\b/i, "hardware/device"],
  [/\b(steel|iron|aluminium|aluminum|copper|plastic|rubber|wood|paper|cardboard|cosmetic|perfume|soap|candle|fertiliser|chemical|pharmaceutical|vitamin)\b/i, "material/commodity"],
];

const DIGITAL_ONLY_PATTERNS: Array<[RegExp, string]> = [
  [/\b(saas|cloud\s*platform|web\s*app|mobile\s*app|browser\s*extension|api\s*service|software-as-a-service|software\s*platform|digital\s*platform|portal|crm|erp|ats)\b/i, "software/saas"],
  [/\b(resume\s*screening|cv\s*screening|candidate\s*screening|applicant\s*tracking|recruitment\s*software|hiring\s*platform|credit\s*scoring\s*engine|underwriting\s*model|chatbot|llm\s*wrapper|virtual\s*assistant|deepfake\s*generator)\b/i, "digital-workflow"],
];

const AI_PATTERNS: Array<[RegExp, string]> = [
  [/\b(ai|artificial\s*intelligence|machine\s*learning|deep\s*learning|neural\s*network|llm|large\s*language\s*model|generative|gpt|computer\s*vision)\b/i, "ai/ml"],
  [/\b(face\s*recognition|facial\s*recognition|biometric|emotion\s*recognition|sentiment\s*analysis|cry\s*detection|voice\s*recognition|pose\s*estimation|object\s*detection|autonomous|predictive|algorithmic)\b/i, "biometric/vision-ai"],
  [/\b(resume\s*screening|cv\s*screening|candidate\s*ranking|credit\s*scoring|social\s*scoring|exam\s*proctoring|subliminal|deepfake|chatbot|automated\s*decision)\b/i, "regulated-ai-usecase"],
  [/\bsmart\s+(baby\s*monitor|camera|doorbell|toy|speaker|watch|lock|thermostat|glasses)\b/i, "smart-ai-device"],
];

/**
 * Step A: Classify product into `physical | digital | physical_with_ai` and set `has_ai: boolean`.
 */
export function routeProduct(description: string, hasImage = false): RouterResult {
  const text = description.trim();

  const physicalHits = PHYSICAL_PATTERNS.filter(([re]) => re.test(text)).map(([, label]) => label);
  const digitalHits = DIGITAL_ONLY_PATTERNS.filter(([re]) => re.test(text)).map(([, label]) => label);
  const aiHits = AI_PATTERNS.filter(([re]) => re.test(text)).map(([, label]) => label);

  // If an image of a product was uploaded and no pure-SaaS signal dominates, treat as physical
  const hasExplicitPureSoftware =
    /\b(saas|software-as-a-service|web\s*app|cloud\s*software|api\s*only|browser\s*extension)\b/i.test(text) &&
    physicalHits.length === 0;

  const isPhysical =
    physicalHits.length > 0 ||
    (hasImage && !hasExplicitPureSoftware) ||
    (digitalHits.length === 0 && aiHits.length === 0);

  const hasAi = aiHits.length > 0 || (!isPhysical && digitalHits.length > 0);

  let product_type: ProductType;
  if (isPhysical && hasAi) {
    product_type = "physical_with_ai";
  } else if (isPhysical && !hasAi) {
    product_type = "physical";
  } else {
    product_type = "digital";
  }

  return {
    product_type,
    has_ai: product_type === "digital" ? true : hasAi,
    is_physical: isPhysical,
    matched_signals: {
      physical: physicalHits,
      digital: digitalHits,
      ai: aiHits,
    },
  };
}
