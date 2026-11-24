export interface IngredientVariant {
  id: string;
  name: string;
  emoji: string;
}

export interface IngredientWithVariants {
  category: string;
  defaultName: string;
  emoji: string;
  variants: IngredientVariant[];
}

export const ingredientVariants: Record<string, IngredientWithVariants> = {
  // ==================== PROTEINS ====================
  chicken: {
    category: "Proteins",
    defaultName: "Chicken",
    emoji: "🍗",
    variants: [
      { id: "chicken-breast", name: "Chicken Breast", emoji: "🍗" },
      { id: "chicken-thighs", name: "Chicken Thighs", emoji: "🍗" },
      { id: "chicken-tenders", name: "Chicken Tenders", emoji: "🍗" },
      { id: "chicken-wings", name: "Chicken Wings", emoji: "🍗" },
      { id: "chicken-drumsticks", name: "Chicken Drumsticks", emoji: "🍗" },
      { id: "ground-chicken", name: "Ground Chicken", emoji: "🍗" },
      { id: "whole-chicken", name: "Whole Chicken", emoji: "🍗" },
      { id: "rotisserie-chicken", name: "Rotisserie Chicken", emoji: "🍗" },
    ],
  },
  beef: {
    category: "Proteins",
    defaultName: "Beef",
    emoji: "🥩",
    variants: [
      { id: "ground-beef", name: "Ground Beef", emoji: "🥩" },
      { id: "ground-beef-lean", name: "Lean Ground Beef (90%)", emoji: "🥩" },
      { id: "beef-steak", name: "Beef Steak", emoji: "🥩" },
      { id: "beef-sirloin", name: "Sirloin Steak", emoji: "🥩" },
      { id: "beef-ribeye", name: "Ribeye Steak", emoji: "🥩" },
      { id: "beef-filet", name: "Filet Mignon", emoji: "🥩" },
      { id: "beef-flank", name: "Flank Steak", emoji: "🥩" },
      { id: "stew-beef", name: "Stew Beef", emoji: "🥩" },
      { id: "beef-roast", name: "Beef Roast", emoji: "🥩" },
      { id: "beef-brisket", name: "Beef Brisket", emoji: "🥩" },
      { id: "beef-short-ribs", name: "Short Ribs", emoji: "🥩" },
    ],
  },
  pork: {
    category: "Proteins",
    defaultName: "Pork",
    emoji: "🥓",
    variants: [
      { id: "pork-chops", name: "Pork Chops", emoji: "🥓" },
      { id: "pork-loin", name: "Pork Loin", emoji: "🥓" },
      { id: "ground-pork", name: "Ground Pork", emoji: "🥓" },
      { id: "bacon", name: "Bacon", emoji: "🥓" },
      { id: "turkey-bacon", name: "Turkey Bacon", emoji: "🥓" },
      { id: "pork-tenderloin", name: "Pork Tenderloin", emoji: "🥓" },
      { id: "pork-shoulder", name: "Pork Shoulder", emoji: "🥓" },
      { id: "pork-belly", name: "Pork Belly", emoji: "🥓" },
      { id: "ham", name: "Ham", emoji: "🥓" },
      { id: "ham-sliced", name: "Sliced Deli Ham", emoji: "🥓" },
      { id: "pork-ribs", name: "Pork Ribs", emoji: "🥓" },
      { id: "sausage-italian", name: "Italian Sausage", emoji: "🌭" },
      { id: "sausage-breakfast", name: "Breakfast Sausage", emoji: "🌭" },
      { id: "sausage-chorizo", name: "Chorizo", emoji: "🌭" },
    ],
  },
  fish: {
    category: "Proteins",
    defaultName: "Fish",
    emoji: "🐟",
    variants: [
      { id: "salmon-fillet", name: "Salmon Fillet", emoji: "🐟" },
      { id: "salmon-smoked", name: "Smoked Salmon", emoji: "🐟" },
      { id: "tilapia", name: "Tilapia", emoji: "🐟" },
      { id: "cod", name: "Cod", emoji: "🐟" },
      { id: "tuna-steak", name: "Tuna Steak", emoji: "🐟" },
      { id: "mahi-mahi", name: "Mahi Mahi", emoji: "🐟" },
      { id: "catfish", name: "Catfish", emoji: "🐟" },
      { id: "halibut", name: "Halibut", emoji: "🐟" },
      { id: "trout", name: "Trout", emoji: "🐟" },
      { id: "sea-bass", name: "Sea Bass", emoji: "🐟" },
      { id: "snapper", name: "Red Snapper", emoji: "🐟" },
    ],
  },
  shrimp: {
    category: "Proteins",
    defaultName: "Shrimp",
    emoji: "🦐",
    variants: [
      { id: "raw-shrimp", name: "Raw Shrimp", emoji: "🦐" },
      { id: "cooked-shrimp", name: "Cooked Shrimp", emoji: "🦐" },
      { id: "jumbo-shrimp", name: "Jumbo Shrimp", emoji: "🦐" },
      { id: "shrimp-peeled", name: "Peeled & Deveined Shrimp", emoji: "🦐" },
      { id: "cocktail-shrimp", name: "Cocktail Shrimp", emoji: "🦐" },
    ],
  },
  tofu: {
    category: "Proteins",
    defaultName: "Tofu",
    emoji: "🧈",
    variants: [
      { id: "firm-tofu", name: "Firm Tofu", emoji: "🧈" },
      { id: "extra-firm-tofu", name: "Extra Firm Tofu", emoji: "🧈" },
      { id: "silken-tofu", name: "Silken Tofu", emoji: "🧈" },
      { id: "smoked-tofu", name: "Smoked Tofu", emoji: "🧈" },
    ],
  },

  // ==================== DAIRY ====================
  eggs: {
    category: "Dairy",
    defaultName: "Eggs",
    emoji: "🥚",
    variants: [
      { id: "large-eggs", name: "Large Eggs", emoji: "🥚" },
      { id: "extra-large-eggs", name: "Extra Large Eggs", emoji: "🥚" },
      { id: "egg-whites", name: "Egg Whites", emoji: "🥚" },
      { id: "cage-free-eggs", name: "Cage-Free Eggs", emoji: "🥚" },
      { id: "organic-eggs", name: "Organic Eggs", emoji: "🥚" },
    ],
  },
  cheese: {
    category: "Dairy",
    defaultName: "Cheese",
    emoji: "🧀",
    variants: [
      { id: "cheddar-cheese", name: "Cheddar Cheese", emoji: "🧀" },
      { id: "sharp-cheddar", name: "Sharp Cheddar", emoji: "🧀" },
      { id: "mozzarella", name: "Mozzarella", emoji: "🧀" },
      { id: "fresh-mozzarella", name: "Fresh Mozzarella", emoji: "🧀" },
      { id: "parmesan", name: "Parmesan", emoji: "🧀" },
      { id: "feta-cheese", name: "Feta Cheese", emoji: "🧀" },
      { id: "swiss-cheese", name: "Swiss Cheese", emoji: "🧀" },
      { id: "gouda", name: "Gouda", emoji: "🧀" },
      { id: "blue-cheese", name: "Blue Cheese", emoji: "🧀" },
      { id: "brie", name: "Brie", emoji: "🧀" },
      { id: "provolone", name: "Provolone", emoji: "🧀" },
      { id: "pepper-jack", name: "Pepper Jack", emoji: "🧀" },
      { id: "american-cheese", name: "American Cheese", emoji: "🧀" },
      { id: "cotija", name: "Cotija Cheese", emoji: "🧀" },
      { id: "ricotta", name: "Ricotta Cheese", emoji: "🧀" },
      { id: "goat-cheese", name: "Goat Cheese", emoji: "🧀" },
      { id: "shredded-mexican", name: "Mexican Blend Shredded", emoji: "🧀" },
    ],
  },
  milk: {
    category: "Dairy",
    defaultName: "Milk",
    emoji: "🥛",
    variants: [
      { id: "whole-milk", name: "Whole Milk", emoji: "🥛" },
      { id: "2-percent-milk", name: "2% Milk", emoji: "🥛" },
      { id: "1-percent-milk", name: "1% Milk", emoji: "🥛" },
      { id: "skim-milk", name: "Skim Milk", emoji: "🥛" },
      { id: "almond-milk", name: "Almond Milk", emoji: "🥛" },
      { id: "oat-milk", name: "Oat Milk", emoji: "🥛" },
      { id: "soy-milk", name: "Soy Milk", emoji: "🥛" },
      { id: "coconut-milk-beverage", name: "Coconut Milk (Beverage)", emoji: "🥛" },
      { id: "lactose-free-milk", name: "Lactose-Free Milk", emoji: "🥛" },
    ],
  },
  cream: {
    category: "Dairy",
    defaultName: "Heavy Cream",
    emoji: "🥛",
    variants: [
      { id: "heavy-cream", name: "Heavy Cream", emoji: "🥛" },
      { id: "heavy-whipping-cream", name: "Heavy Whipping Cream", emoji: "🥛" },
      { id: "light-cream", name: "Light Cream", emoji: "🥛" },
      { id: "half-and-half", name: "Half and Half", emoji: "🥛" },
    ],
  },
  butter: {
    category: "Dairy",
    defaultName: "Butter",
    emoji: "🧈",
    variants: [
      { id: "salted-butter", name: "Salted Butter", emoji: "🧈" },
      { id: "unsalted-butter", name: "Unsalted Butter", emoji: "🧈" },
      { id: "european-butter", name: "European Style Butter", emoji: "🧈" },
      { id: "grass-fed-butter", name: "Grass-Fed Butter", emoji: "🧈" },
      { id: "whipped-butter", name: "Whipped Butter", emoji: "🧈" },
    ],
  },
  yogurt: {
    category: "Dairy",
    defaultName: "Yogurt",
    emoji: "🥛",
    variants: [
      { id: "plain-yogurt", name: "Plain Yogurt", emoji: "🥛" },
      { id: "greek-yogurt", name: "Greek Yogurt", emoji: "🥛" },
      { id: "vanilla-yogurt", name: "Vanilla Yogurt", emoji: "🥛" },
      { id: "low-fat-yogurt", name: "Low-Fat Yogurt", emoji: "🥛" },
      { id: "non-fat-greek-yogurt", name: "Non-Fat Greek Yogurt", emoji: "🥛" },
    ],
  },
  "sour-cream": {
    category: "Dairy",
    defaultName: "Sour Cream",
    emoji: "🥛",
    variants: [
      { id: "full-fat-sour-cream", name: "Full Fat Sour Cream", emoji: "🥛" },
      { id: "light-sour-cream", name: "Light Sour Cream", emoji: "🥛" },
      { id: "mexican-crema", name: "Mexican Crema", emoji: "🥛" },
    ],
  },
  "cream-cheese": {
    category: "Dairy",
    defaultName: "Cream Cheese",
    emoji: "🧀",
    variants: [
      { id: "regular-cream-cheese", name: "Regular Cream Cheese", emoji: "🧀" },
      { id: "whipped-cream-cheese", name: "Whipped Cream Cheese", emoji: "🧀" },
      { id: "low-fat-cream-cheese", name: "Low-Fat Cream Cheese", emoji: "🧀" },
      { id: "flavored-cream-cheese", name: "Flavored Cream Cheese", emoji: "🧀" },
    ],
  },

  // ==================== VEGETABLES ====================
  tomato: {
    category: "Vegetables",
    defaultName: "Tomato",
    emoji: "🍅",
    variants: [
      { id: "roma-tomatoes", name: "Roma Tomatoes", emoji: "🍅" },
      { id: "cherry-tomatoes", name: "Cherry Tomatoes", emoji: "🍅" },
      { id: "beefsteak-tomatoes", name: "Beefsteak Tomatoes", emoji: "🍅" },
      { id: "grape-tomatoes", name: "Grape Tomatoes", emoji: "🍅" },
      { id: "heirloom-tomatoes", name: "Heirloom Tomatoes", emoji: "🍅" },
      { id: "vine-tomatoes", name: "Vine Tomatoes", emoji: "🍅" },
    ],
  },
  lettuce: {
    category: "Vegetables",
    defaultName: "Lettuce",
    emoji: "🥬",
    variants: [
      { id: "romaine-lettuce", name: "Romaine Lettuce", emoji: "🥬" },
      { id: "iceberg-lettuce", name: "Iceberg Lettuce", emoji: "🥬" },
      { id: "butter-lettuce", name: "Butter Lettuce", emoji: "🥬" },
      { id: "mixed-greens", name: "Mixed Greens", emoji: "🥬" },
      { id: "arugula", name: "Arugula", emoji: "🥬" },
      { id: "spring-mix", name: "Spring Mix", emoji: "🥬" },
    ],
  },
  onion: {
    category: "Vegetables",
    defaultName: "Onion",
    emoji: "🧅",
    variants: [
      { id: "yellow-onion", name: "Yellow Onion", emoji: "🧅" },
      { id: "red-onion", name: "Red Onion", emoji: "🧅" },
      { id: "white-onion", name: "White Onion", emoji: "🧅" },
      { id: "sweet-onion", name: "Sweet Onion (Vidalia)", emoji: "🧅" },
      { id: "green-onion", name: "Green Onion", emoji: "🧅" },
      { id: "shallots", name: "Shallots", emoji: "🧅" },
    ],
  },
  garlic: {
    category: "Vegetables",
    defaultName: "Garlic",
    emoji: "🧄",
    variants: [
      { id: "fresh-garlic", name: "Fresh Garlic Head", emoji: "🧄" },
      { id: "minced-garlic", name: "Minced Garlic (Jar)", emoji: "🧄" },
      { id: "garlic-cloves", name: "Peeled Garlic Cloves", emoji: "🧄" },
      { id: "elephant-garlic", name: "Elephant Garlic", emoji: "🧄" },
    ],
  },
  spinach: {
    category: "Vegetables",
    defaultName: "Spinach",
    emoji: "🥬",
    variants: [
      { id: "baby-spinach", name: "Baby Spinach", emoji: "🥬" },
      { id: "mature-spinach", name: "Mature Spinach", emoji: "🥬" },
      { id: "frozen-spinach", name: "Frozen Spinach", emoji: "🥬" },
    ],
  },
  carrot: {
    category: "Vegetables",
    defaultName: "Carrot",
    emoji: "🥕",
    variants: [
      { id: "whole-carrots", name: "Whole Carrots", emoji: "🥕" },
      { id: "baby-carrots", name: "Baby Carrots", emoji: "🥕" },
      { id: "shredded-carrots", name: "Shredded Carrots", emoji: "🥕" },
      { id: "rainbow-carrots", name: "Rainbow Carrots", emoji: "🥕" },
    ],
  },
  "bell-pepper": {
    category: "Vegetables",
    defaultName: "Bell Pepper",
    emoji: "🫑",
    variants: [
      { id: "green-bell-pepper", name: "Green Bell Pepper", emoji: "🫑" },
      { id: "red-bell-pepper", name: "Red Bell Pepper", emoji: "🫑" },
      { id: "yellow-bell-pepper", name: "Yellow Bell Pepper", emoji: "🫑" },
      { id: "orange-bell-pepper", name: "Orange Bell Pepper", emoji: "🫑" },
      { id: "mini-peppers", name: "Mini Sweet Peppers", emoji: "🫑" },
    ],
  },
  broccoli: {
    category: "Vegetables",
    defaultName: "Broccoli",
    emoji: "🥦",
    variants: [
      { id: "broccoli-crowns", name: "Broccoli Crowns", emoji: "🥦" },
      { id: "broccoli-florets", name: "Broccoli Florets", emoji: "🥦" },
      { id: "frozen-broccoli", name: "Frozen Broccoli", emoji: "🥦" },
      { id: "broccolini", name: "Broccolini", emoji: "🥦" },
    ],
  },
  zucchini: {
    category: "Vegetables",
    defaultName: "Zucchini",
    emoji: "🥒",
    variants: [
      { id: "green-zucchini", name: "Green Zucchini", emoji: "🥒" },
      { id: "yellow-squash", name: "Yellow Squash", emoji: "🥒" },
      { id: "zucchini-noodles", name: "Zucchini Noodles (Spiralized)", emoji: "🥒" },
    ],
  },
  mushroom: {
    category: "Vegetables",
    defaultName: "Mushrooms",
    emoji: "🍄",
    variants: [
      { id: "white-mushrooms", name: "White Button Mushrooms", emoji: "🍄" },
      { id: "cremini-mushrooms", name: "Cremini (Baby Bella)", emoji: "🍄" },
      { id: "portobello-mushrooms", name: "Portobello Mushrooms", emoji: "🍄" },
      { id: "shiitake-mushrooms", name: "Shiitake Mushrooms", emoji: "🍄" },
      { id: "sliced-mushrooms", name: "Sliced Mushrooms", emoji: "🍄" },
    ],
  },
  celery: {
    category: "Vegetables",
    defaultName: "Celery",
    emoji: "🥬",
    variants: [
      { id: "celery-bunch", name: "Celery Bunch", emoji: "🥬" },
      { id: "celery-hearts", name: "Celery Hearts", emoji: "🥬" },
      { id: "celery-sticks", name: "Celery Sticks", emoji: "🥬" },
    ],
  },
  cucumber: {
    category: "Vegetables",
    defaultName: "Cucumber",
    emoji: "🥒",
    variants: [
      { id: "english-cucumber", name: "English Cucumber", emoji: "🥒" },
      { id: "regular-cucumber", name: "Regular Cucumber", emoji: "🥒" },
      { id: "persian-cucumber", name: "Persian Cucumber", emoji: "🥒" },
      { id: "pickling-cucumber", name: "Pickling Cucumbers", emoji: "🥒" },
    ],
  },
  potato: {
    category: "Vegetables",
    defaultName: "Potato",
    emoji: "🥔",
    variants: [
      { id: "russet-potato", name: "Russet Potato", emoji: "🥔" },
      { id: "yukon-gold", name: "Yukon Gold Potato", emoji: "🥔" },
      { id: "red-potato", name: "Red Potato", emoji: "🥔" },
      { id: "sweet-potato", name: "Sweet Potato", emoji: "🍠" },
      { id: "fingerling-potato", name: "Fingerling Potatoes", emoji: "🥔" },
      { id: "baby-potatoes", name: "Baby Potatoes", emoji: "🥔" },
    ],
  },
  corn: {
    category: "Vegetables",
    defaultName: "Corn",
    emoji: "🌽",
    variants: [
      { id: "corn-on-cob", name: "Corn on the Cob", emoji: "🌽" },
      { id: "frozen-corn", name: "Frozen Corn Kernels", emoji: "🌽" },
      { id: "canned-corn", name: "Canned Corn", emoji: "🌽" },
    ],
  },
  asparagus: {
    category: "Vegetables",
    defaultName: "Asparagus",
    emoji: "🥬",
    variants: [
      { id: "green-asparagus", name: "Green Asparagus", emoji: "🥬" },
      { id: "white-asparagus", name: "White Asparagus", emoji: "🥬" },
      { id: "thin-asparagus", name: "Thin Asparagus", emoji: "🥬" },
    ],
  },
  cabbage: {
    category: "Vegetables",
    defaultName: "Cabbage",
    emoji: "🥬",
    variants: [
      { id: "green-cabbage", name: "Green Cabbage", emoji: "🥬" },
      { id: "red-cabbage", name: "Red Cabbage", emoji: "🥬" },
      { id: "napa-cabbage", name: "Napa Cabbage", emoji: "🥬" },
      { id: "cabbage-napa", name: "Napa Cabbage", emoji: "🥬" },
      { id: "coleslaw-mix", name: "Coleslaw Mix", emoji: "🥬" },
    ],
  },
  kale: {
    category: "Vegetables",
    defaultName: "Kale",
    emoji: "🥬",
    variants: [
      { id: "curly-kale", name: "Curly Kale", emoji: "🥬" },
      { id: "lacinato-kale", name: "Lacinato (Dinosaur) Kale", emoji: "🥬" },
      { id: "baby-kale", name: "Baby Kale", emoji: "🥬" },
    ],
  },
  cauliflower: {
    category: "Vegetables",
    defaultName: "Cauliflower",
    emoji: "🥬",
    variants: [
      { id: "cauliflower-head", name: "Cauliflower Head", emoji: "🥬" },
      { id: "cauliflower-florets", name: "Cauliflower Florets", emoji: "🥬" },
      { id: "cauliflower-rice", name: "Cauliflower Rice", emoji: "🥬" },
    ],
  },
  "green-beans": {
    category: "Vegetables",
    defaultName: "Green Beans",
    emoji: "🫛",
    variants: [
      { id: "fresh-green-beans", name: "Fresh Green Beans", emoji: "🫛" },
      { id: "french-green-beans", name: "French Green Beans (Haricots Verts)", emoji: "🫛" },
      { id: "frozen-green-beans", name: "Frozen Green Beans", emoji: "🫛" },
      { id: "canned-green-beans", name: "Canned Green Beans", emoji: "🫛" },
    ],
  },
  peas: {
    category: "Vegetables",
    defaultName: "Peas",
    emoji: "🫛",
    variants: [
      { id: "frozen-peas", name: "Frozen Peas", emoji: "🫛" },
      { id: "snow-peas", name: "Snow Peas", emoji: "🫛" },
      { id: "sugar-snap-peas", name: "Sugar Snap Peas", emoji: "🫛" },
      { id: "canned-peas", name: "Canned Peas", emoji: "🫛" },
    ],
  },
  eggplant: {
    category: "Vegetables",
    defaultName: "Eggplant",
    emoji: "🍆",
    variants: [
      { id: "globe-eggplant", name: "Globe Eggplant", emoji: "🍆" },
      { id: "italian-eggplant", name: "Italian Eggplant", emoji: "🍆" },
      { id: "japanese-eggplant", name: "Japanese Eggplant", emoji: "🍆" },
    ],
  },

  // ==================== FRUITS ====================
  avocado: {
    category: "Fruits",
    defaultName: "Avocado",
    emoji: "🥑",
    variants: [
      { id: "hass-avocado", name: "Hass Avocado", emoji: "🥑" },
      { id: "florida-avocado", name: "Florida Avocado", emoji: "🥑" },
      { id: "ripe-avocado", name: "Ripe Avocado", emoji: "🥑" },
    ],
  },
  berries: {
    category: "Fruits",
    defaultName: "Berries",
    emoji: "🍓",
    variants: [
      { id: "strawberries", name: "Strawberries", emoji: "🍓" },
      { id: "cranberries", name: "Cranberries", emoji: "🔴" },
      { id: "blueberries", name: "Blueberries", emoji: "🫐" },
      { id: "raspberries", name: "Raspberries", emoji: "🍇" },
      { id: "blackberries", name: "Blackberries", emoji: "🫐" },
      { id: "mixed-berries", name: "Mixed Berries", emoji: "🍓" },
      { id: "frozen-berries", name: "Frozen Mixed Berries", emoji: "🍓" },
    ],
  },
  lemon: {
    category: "Fruits",
    defaultName: "Lemon",
    emoji: "🍋",
    variants: [
      { id: "fresh-lemon", name: "Fresh Lemon", emoji: "🍋" },
      { id: "meyer-lemon", name: "Meyer Lemon", emoji: "🍋" },
      { id: "lemon-juice", name: "Lemon Juice (Bottle)", emoji: "🍋" },
    ],
  },
  lime: {
    category: "Fruits",
    defaultName: "Lime",
    emoji: "🍈",
    variants: [
      { id: "fresh-lime", name: "Fresh Lime", emoji: "🍈" },
      { id: "key-lime", name: "Key Lime", emoji: "🍈" },
      { id: "lime-juice", name: "Lime Juice (Bottle)", emoji: "🍈" },
    ],
  },
  apple: {
    category: "Fruits",
    defaultName: "Apple",
    emoji: "🍎",
    variants: [
      { id: "gala-apple", name: "Gala Apple", emoji: "🍎" },
      { id: "fuji-apple", name: "Fuji Apple", emoji: "🍎" },
      { id: "granny-smith", name: "Granny Smith Apple", emoji: "🍏" },
      { id: "honeycrisp-apple", name: "Honeycrisp Apple", emoji: "🍎" },
      { id: "pink-lady-apple", name: "Pink Lady Apple", emoji: "🍎" },
      { id: "red-delicious", name: "Red Delicious Apple", emoji: "🍎" },
    ],
  },
  banana: {
    category: "Fruits",
    defaultName: "Banana",
    emoji: "🍌",
    variants: [
      { id: "yellow-banana", name: "Yellow Banana", emoji: "🍌" },
      { id: "ripe-banana", name: "Ripe Banana (for baking)", emoji: "🍌" },
      { id: "plantain", name: "Plantain", emoji: "🍌" },
    ],
  },
  orange: {
    category: "Fruits",
    defaultName: "Orange",
    emoji: "🍊",
    variants: [
      { id: "navel-orange", name: "Navel Orange", emoji: "🍊" },
      { id: "valencia-orange", name: "Valencia Orange", emoji: "🍊" },
      { id: "blood-orange", name: "Blood Orange", emoji: "🍊" },
      { id: "mandarin-orange", name: "Mandarin / Clementine", emoji: "🍊" },
      { id: "orange-juice", name: "Orange Juice", emoji: "🍊" },
    ],
  },
  grapes: {
    category: "Fruits",
    defaultName: "Grapes",
    emoji: "🍇",
    variants: [
      { id: "red-grapes", name: "Red Grapes", emoji: "🍇" },
      { id: "green-grapes", name: "Green Grapes", emoji: "🍇" },
      { id: "black-grapes", name: "Black Grapes", emoji: "🍇" },
      { id: "cotton-candy-grapes", name: "Cotton Candy Grapes", emoji: "🍇" },
    ],
  },
  mango: {
    category: "Fruits",
    defaultName: "Mango",
    emoji: "🥭",
    variants: [
      { id: "fresh-mango", name: "Fresh Mango", emoji: "🥭" },
      { id: "ataulfo-mango", name: "Ataulfo (Honey) Mango", emoji: "🥭" },
      { id: "frozen-mango", name: "Frozen Mango", emoji: "🥭" },
    ],
  },
  pineapple: {
    category: "Fruits",
    defaultName: "Pineapple",
    emoji: "🍍",
    variants: [
      { id: "fresh-pineapple", name: "Fresh Pineapple", emoji: "🍍" },
      { id: "canned-pineapple", name: "Canned Pineapple", emoji: "🍍" },
      { id: "frozen-pineapple", name: "Frozen Pineapple", emoji: "🍍" },
    ],
  },
  peach: {
    category: "Fruits",
    defaultName: "Peach",
    emoji: "🍑",
    variants: [
      { id: "fresh-peach", name: "Fresh Peach", emoji: "🍑" },
      { id: "white-peach", name: "White Peach", emoji: "🍑" },
      { id: "canned-peaches", name: "Canned Peaches", emoji: "🍑" },
      { id: "frozen-peaches", name: "Frozen Peaches", emoji: "🍑" },
    ],
  },
  watermelon: {
    category: "Fruits",
    defaultName: "Watermelon",
    emoji: "🍉",
    variants: [
      { id: "seedless-watermelon", name: "Seedless Watermelon", emoji: "🍉" },
      { id: "mini-watermelon", name: "Mini Watermelon", emoji: "🍉" },
      { id: "cubed-watermelon", name: "Pre-Cut Watermelon", emoji: "🍉" },
    ],
  },

  // ==================== GRAINS & PASTA ====================
  bread: {
    category: "Grains & Pasta",
    defaultName: "Bread",
    emoji: "🍞",
    variants: [
      { id: "white-bread", name: "White Bread", emoji: "🍞" },
      { id: "whole-wheat-bread", name: "Whole Wheat Bread", emoji: "🍞" },
      { id: "sourdough", name: "Sourdough Bread", emoji: "🍞" },
      { id: "baguette", name: "Baguette", emoji: "🥖" },
      { id: "ciabatta", name: "Ciabatta", emoji: "🍞" },
      { id: "brioche", name: "Brioche", emoji: "🍞" },
      { id: "multigrain-bread", name: "Multigrain Bread", emoji: "🍞" },
      { id: "rye-bread", name: "Rye Bread", emoji: "🍞" },
      { id: "english-muffins", name: "English Muffins", emoji: "🍞" },
      { id: "bagels", name: "Bagels", emoji: "🥯" },
      { id: "pita-bread", name: "Pita Bread", emoji: "🥙" },
      { id: "naan", name: "Naan Bread", emoji: "🍞" },
      { id: "tortillas-flour", name: "Flour Tortillas", emoji: "🫓" },
      { id: "tortillas-corn", name: "Corn Tortillas", emoji: "🫓" },
    ],
  },
  pasta: {
    category: "Grains & Pasta",
    defaultName: "Pasta",
    emoji: "🍝",
    variants: [
      { id: "spaghetti", name: "Spaghetti", emoji: "🍝" },
      { id: "penne", name: "Penne", emoji: "🍝" },
      { id: "fettuccine", name: "Fettuccine", emoji: "🍝" },
      { id: "rigatoni", name: "Rigatoni", emoji: "🍝" },
      { id: "linguine", name: "Linguine", emoji: "🍝" },
      { id: "macaroni", name: "Macaroni (Elbow)", emoji: "🍝" },
      { id: "farfalle", name: "Farfalle (Bowtie)", emoji: "🍝" },
      { id: "rotini", name: "Rotini", emoji: "🍝" },
      { id: "angel-hair", name: "Angel Hair", emoji: "🍝" },
      { id: "lasagna-noodles", name: "Lasagna Noodles", emoji: "🍝" },
      { id: "egg-noodles", name: "Egg Noodles", emoji: "🍝" },
      { id: "whole-wheat-pasta", name: "Whole Wheat Pasta", emoji: "🍝" },
      { id: "gluten-free-pasta", name: "Gluten-Free Pasta", emoji: "🍝" },
    ],
  },
  rice: {
    category: "Grains & Pasta",
    defaultName: "Rice",
    emoji: "🍚",
    variants: [
      { id: "white-rice", name: "Long Grain White Rice", emoji: "🍚" },
      { id: "brown-rice", name: "Brown Rice", emoji: "🍚" },
      { id: "jasmine-rice", name: "Jasmine Rice", emoji: "🍚" },
      { id: "basmati-rice", name: "Basmati Rice", emoji: "🍚" },
      { id: "arborio-rice", name: "Arborio Rice", emoji: "🍚" },
      { id: "sushi-rice", name: "Sushi Rice", emoji: "🍚" },
      { id: "wild-rice", name: "Wild Rice", emoji: "🍚" },
      { id: "instant-rice", name: "Instant Rice", emoji: "🍚" },
    ],
  },
  oats: {
    category: "Grains & Pasta",
    defaultName: "Oats",
    emoji: "🥣",
    variants: [
      { id: "rolled-oats", name: "Old-Fashioned Rolled Oats", emoji: "🥣" },
      { id: "steel-cut-oats", name: "Steel Cut Oats", emoji: "🥣" },
      { id: "instant-oats", name: "Instant Oats", emoji: "🥣" },
      { id: "quick-oats", name: "Quick Oats", emoji: "🥣" },
    ],
  },
  quinoa: {
    category: "Grains & Pasta",
    defaultName: "Quinoa",
    emoji: "🌾",
    variants: [
      { id: "white-quinoa", name: "White Quinoa", emoji: "🌾" },
      { id: "red-quinoa", name: "Red Quinoa", emoji: "🌾" },
      { id: "tricolor-quinoa", name: "Tricolor Quinoa", emoji: "🌾" },
    ],
  },
  couscous: {
    category: "Grains & Pasta",
    defaultName: "Couscous",
    emoji: "🌾",
    variants: [
      { id: "regular-couscous", name: "Regular Couscous", emoji: "🌾" },
      { id: "israeli-couscous", name: "Israeli (Pearl) Couscous", emoji: "🌾" },
      { id: "whole-wheat-couscous", name: "Whole Wheat Couscous", emoji: "🌾" },
    ],
  },

  // ==================== CANNED & JARRED ====================
  tuna: {
    category: "Canned & Jarred",
    defaultName: "Canned Tuna",
    emoji: "🐟",
    variants: [
      { id: "chunk-light-tuna", name: "Chunk Light Tuna", emoji: "🐟" },
      { id: "solid-white-tuna", name: "Solid White Albacore", emoji: "🐟" },
      { id: "tuna-in-oil", name: "Tuna in Olive Oil", emoji: "🐟" },
      { id: "tuna-in-water", name: "Tuna in Water", emoji: "🐟" },
    ],
  },
  tomatoes: {
    category: "Canned & Jarred",
    defaultName: "Canned Tomatoes",
    emoji: "🥫",
    variants: [
      { id: "diced-tomatoes", name: "Diced Tomatoes", emoji: "🥫" },
      { id: "crushed-tomatoes", name: "Crushed Tomatoes", emoji: "🥫" },
      { id: "tomato-paste", name: "Tomato Paste", emoji: "🥫" },
      { id: "tomato-sauce", name: "Tomato Sauce", emoji: "🥫" },
      { id: "whole-peeled-tomatoes", name: "Whole Peeled Tomatoes", emoji: "🥫" },
      { id: "fire-roasted-tomatoes", name: "Fire Roasted Tomatoes", emoji: "🥫" },
      { id: "san-marzano-tomatoes", name: "San Marzano Tomatoes", emoji: "🥫" },
    ],
  },
  beans: {
    category: "Canned & Jarred",
    defaultName: "Beans",
    emoji: "🫘",
    variants: [
      { id: "black-beans", name: "Black Beans", emoji: "🫘" },
      { id: "kidney-beans", name: "Kidney Beans", emoji: "🫘" },
      { id: "pinto-beans", name: "Pinto Beans", emoji: "🫘" },
      { id: "cannellini-beans", name: "Cannellini Beans", emoji: "🫘" },
      { id: "navy-beans", name: "Navy Beans", emoji: "🫘" },
      { id: "great-northern-beans", name: "Great Northern Beans", emoji: "🫘" },
      { id: "refried-beans", name: "Refried Beans", emoji: "🫘" },
    ],
  },
  chickpeas: {
    category: "Canned & Jarred",
    defaultName: "Chickpeas",
    emoji: "🫘",
    variants: [
      { id: "canned-chickpeas", name: "Canned Chickpeas", emoji: "🫘" },
      { id: "dried-chickpeas", name: "Dried Chickpeas", emoji: "🫘" },
    ],
  },
  "coconut-milk": {
    category: "Canned & Jarred",
    defaultName: "Coconut Milk",
    emoji: "🥥",
    variants: [
      { id: "full-fat-coconut-milk", name: "Full Fat Coconut Milk", emoji: "🥥" },
      { id: "light-coconut-milk", name: "Light Coconut Milk", emoji: "🥥" },
      { id: "coconut-cream", name: "Coconut Cream", emoji: "🥥" },
    ],
  },
  olives: {
    category: "Canned & Jarred",
    defaultName: "Olives",
    emoji: "🫒",
    variants: [
      { id: "black-olives", name: "Black Olives", emoji: "🫒" },
      { id: "green-olives", name: "Green Olives", emoji: "🫒" },
      { id: "kalamata-olives", name: "Kalamata Olives", emoji: "🫒" },
      { id: "stuffed-olives", name: "Stuffed Olives", emoji: "🫒" },
    ],
  },
  pickles: {
    category: "Canned & Jarred",
    defaultName: "Pickles",
    emoji: "🥒",
    variants: [
      { id: "pickles-dill", name: "Dill Pickles", emoji: "🥒" },
      { id: "pickles-kosher", name: "Kosher Dill Pickles", emoji: "🥒" },
      { id: "pickles-bread-butter", name: "Bread & Butter Pickles", emoji: "🥒" },
      { id: "pickles-spicy", name: "Spicy Pickles", emoji: "🥒" },
      { id: "pickles-cornichons", name: "Cornichons", emoji: "🥒" },
      { id: "pickles-sweet", name: "Sweet Pickles", emoji: "🥒" },
    ],
  },
  "pickle-juice": {
    category: "Canned & Jarred",
    defaultName: "Pickle Juice",
    emoji: "🥒",
    variants: [
      { id: "pickle-juice", name: "Pickle Juice/Brine", emoji: "🥒" },
      { id: "dill-pickle-brine", name: "Dill Pickle Brine", emoji: "🥒" },
    ],
  },
  relish: {
    category: "Canned & Jarred",
    defaultName: "Relish",
    emoji: "🥒",
    variants: [
      { id: "relish-sweet", name: "Sweet Relish", emoji: "🥒" },
      { id: "relish-dill", name: "Dill Relish", emoji: "🥒" },
      { id: "relish-hot-dog", name: "Hot Dog Relish", emoji: "🥒" },
    ],
  },
  capers: {
    category: "Canned & Jarred",
    defaultName: "Capers",
    emoji: "🫒",
    variants: [
      { id: "capers", name: "Capers in Brine", emoji: "🫒" },
      { id: "capers-salt-packed", name: "Salt-Packed Capers", emoji: "🫒" },
      { id: "caper-berries", name: "Caper Berries", emoji: "🫒" },
    ],
  },
  pepperoncini: {
    category: "Canned & Jarred",
    defaultName: "Pepperoncini",
    emoji: "🌶️",
    variants: [
      { id: "pepperoncini", name: "Pepperoncini", emoji: "🌶️" },
      { id: "banana-peppers", name: "Banana Peppers", emoji: "🌶️" },
      { id: "sport-peppers", name: "Sport Peppers", emoji: "🌶️" },
    ],
  },
  "pickled-peppers": {
    category: "Canned & Jarred",
    defaultName: "Pickled Peppers",
    emoji: "🌶️",
    variants: [
      { id: "jalapenos-pickled", name: "Pickled Jalapeños", emoji: "🌶️" },
      { id: "cherry-peppers", name: "Cherry Peppers", emoji: "🌶️" },
      { id: "pickled-serranos", name: "Pickled Serranos", emoji: "🌶️" },
    ],
  },
  giardiniera: {
    category: "Canned & Jarred",
    defaultName: "Giardiniera",
    emoji: "🥗",
    variants: [
      { id: "giardiniera", name: "Giardiniera (Mild)", emoji: "🥗" },
      { id: "giardiniera-hot", name: "Hot Giardiniera", emoji: "🥗" },
    ],
  },
  "artichoke-hearts": {
    category: "Canned & Jarred",
    defaultName: "Artichoke Hearts",
    emoji: "🥗",
    variants: [
      { id: "artichoke-hearts", name: "Artichoke Hearts in Water", emoji: "🥗" },
      { id: "artichoke-hearts-marinated", name: "Marinated Artichoke Hearts", emoji: "🥗" },
    ],
  },
  "roasted-peppers": {
    category: "Canned & Jarred",
    defaultName: "Roasted Peppers",
    emoji: "🌶️",
    variants: [
      { id: "roasted-red-peppers", name: "Roasted Red Peppers", emoji: "🌶️" },
      { id: "fire-roasted-peppers", name: "Fire-Roasted Peppers", emoji: "🌶️" },
      { id: "piquillo-peppers", name: "Piquillo Peppers", emoji: "🌶️" },
    ],
  },

  // ==================== OILS & VINEGARS ====================
  "olive-oil": {
    category: "Oils & Vinegars",
    defaultName: "Olive Oil",
    emoji: "🫒",
    variants: [
      { id: "extra-virgin-olive-oil", name: "Extra Virgin Olive Oil", emoji: "🫒" },
      { id: "light-olive-oil", name: "Light Olive Oil", emoji: "🫒" },
      { id: "regular-olive-oil", name: "Regular Olive Oil", emoji: "🫒" },
    ],
  },
  "vegetable-oil": {
    category: "Oils & Vinegars",
    defaultName: "Vegetable Oil",
    emoji: "🛢️",
    variants: [
      { id: "canola-oil", name: "Canola Oil", emoji: "🛢️" },
      { id: "vegetable-oil-blend", name: "Vegetable Oil Blend", emoji: "🛢️" },
      { id: "sunflower-oil", name: "Sunflower Oil", emoji: "🛢️" },
      { id: "avocado-oil", name: "Avocado Oil", emoji: "🛢️" },
      { id: "sesame-oil", name: "Sesame Oil", emoji: "🛢️" },
      { id: "coconut-oil", name: "Coconut Oil", emoji: "🛢️" },
    ],
  },
  balsamic: {
    category: "Oils & Vinegars",
    defaultName: "Balsamic Vinegar",
    emoji: "🍶",
    variants: [
      { id: "balsamic-vinegar", name: "Balsamic Vinegar", emoji: "🍶" },
      { id: "white-balsamic", name: "White Balsamic Vinegar", emoji: "🍶" },
      { id: "balsamic-glaze", name: "Balsamic Glaze", emoji: "🍶" },
    ],
  },
  vinegar: {
    category: "Oils & Vinegars",
    defaultName: "Vinegar",
    emoji: "🍶",
    variants: [
      { id: "white-vinegar", name: "White Vinegar", emoji: "🍶" },
      { id: "apple-cider-vinegar", name: "Apple Cider Vinegar", emoji: "🍶" },
      { id: "red-wine-vinegar", name: "Red Wine Vinegar", emoji: "🍶" },
      { id: "rice-vinegar", name: "Rice Vinegar", emoji: "🍶" },
      { id: "sherry-vinegar", name: "Sherry Vinegar", emoji: "🍶" },
    ],
  },

  // ==================== BAKING ====================
  flour: {
    category: "Baking",
    defaultName: "Flour",
    emoji: "🌾",
    variants: [
      { id: "all-purpose-flour", name: "All-Purpose Flour", emoji: "🌾" },
      { id: "bread-flour", name: "Bread Flour", emoji: "🌾" },
      { id: "whole-wheat-flour", name: "Whole Wheat Flour", emoji: "🌾" },
      { id: "cake-flour", name: "Cake Flour", emoji: "🌾" },
      { id: "self-rising-flour", name: "Self-Rising Flour", emoji: "🌾" },
      { id: "almond-flour", name: "Almond Flour", emoji: "🌾" },
      { id: "coconut-flour", name: "Coconut Flour", emoji: "🌾" },
    ],
  },
  sugar: {
    category: "Baking",
    defaultName: "Sugar",
    emoji: "🍬",
    variants: [
      { id: "granulated-sugar", name: "Granulated Sugar", emoji: "🍬" },
      { id: "powdered-sugar", name: "Powdered Sugar", emoji: "🍬" },
      { id: "cane-sugar", name: "Cane Sugar", emoji: "🍬" },
    ],
  },
  "brown-sugar": {
    category: "Baking",
    defaultName: "Brown Sugar",
    emoji: "🍬",
    variants: [
      { id: "light-brown-sugar", name: "Light Brown Sugar", emoji: "🍬" },
      { id: "dark-brown-sugar", name: "Dark Brown Sugar", emoji: "🍬" },
      { id: "coconut-sugar", name: "Coconut Sugar", emoji: "🍬" },
    ],
  },
  "chocolate-chips": {
    category: "Baking",
    defaultName: "Chocolate Chips",
    emoji: "🍫",
    variants: [
      { id: "semi-sweet-chips", name: "Semi-Sweet Chocolate Chips", emoji: "🍫" },
      { id: "milk-chocolate-chips", name: "Milk Chocolate Chips", emoji: "🍫" },
      { id: "dark-chocolate-chips", name: "Dark Chocolate Chips", emoji: "🍫" },
      { id: "white-chocolate-chips", name: "White Chocolate Chips", emoji: "🍫" },
    ],
  },

  // ==================== SPICES ====================
  pepper: {
    category: "Spices",
    defaultName: "Black Pepper",
    emoji: "🌶️",
    variants: [
      { id: "ground-black-pepper", name: "Ground Black Pepper", emoji: "🌶️" },
      { id: "whole-peppercorns", name: "Whole Peppercorns", emoji: "🌶️" },
      { id: "white-pepper", name: "White Pepper", emoji: "🌶️" },
      { id: "cracked-pepper", name: "Cracked Black Pepper", emoji: "🌶️" },
    ],
  },
  salt: {
    category: "Spices",
    defaultName: "Salt",
    emoji: "🧂",
    variants: [
      { id: "table-salt", name: "Table Salt", emoji: "🧂" },
      { id: "kosher-salt", name: "Kosher Salt", emoji: "🧂" },
      { id: "sea-salt", name: "Sea Salt", emoji: "🧂" },
      { id: "himalayan-salt", name: "Himalayan Pink Salt", emoji: "🧂" },
      { id: "flaky-salt", name: "Flaky Finishing Salt", emoji: "🧂" },
    ],
  },
  paprika: {
    category: "Spices",
    defaultName: "Paprika",
    emoji: "🌶️",
    variants: [
      { id: "sweet-paprika", name: "Sweet Paprika", emoji: "🌶️" },
      { id: "smoked-paprika", name: "Smoked Paprika", emoji: "🌶️" },
      { id: "hot-paprika", name: "Hot Paprika", emoji: "🌶️" },
      { id: "hungarian-paprika", name: "Hungarian Paprika", emoji: "🌶️" },
    ],
  },
  cinnamon: {
    category: "Spices",
    defaultName: "Cinnamon",
    emoji: "🌰",
    variants: [
      { id: "ground-cinnamon", name: "Ground Cinnamon", emoji: "🌰" },
      { id: "cinnamon-sticks", name: "Cinnamon Sticks", emoji: "🌰" },
      { id: "ceylon-cinnamon", name: "Ceylon Cinnamon", emoji: "🌰" },
    ],
  },
  ginger: {
    category: "Spices",
    defaultName: "Ginger",
    emoji: "🫚",
    variants: [
      { id: "fresh-ginger", name: "Fresh Ginger Root", emoji: "🫚" },
      { id: "ground-ginger", name: "Ground Ginger", emoji: "🫚" },
      { id: "crystallized-ginger", name: "Crystallized Ginger", emoji: "🫚" },
      { id: "ginger-paste", name: "Ginger Paste", emoji: "🫚" },
    ],
  },
  cumin: {
    category: "Spices",
    defaultName: "Cumin",
    emoji: "🌰",
    variants: [
      { id: "ground-cumin", name: "Ground Cumin", emoji: "🌰" },
      { id: "cumin-seeds", name: "Cumin Seeds", emoji: "🌰" },
    ],
  },
  "chili-powder": {
    category: "Spices",
    defaultName: "Chili Powder",
    emoji: "🌶️",
    variants: [
      { id: "regular-chili-powder", name: "Chili Powder", emoji: "🌶️" },
      { id: "ancho-chili-powder", name: "Ancho Chili Powder", emoji: "🌶️" },
      { id: "chipotle-powder", name: "Chipotle Powder", emoji: "🌶️" },
    ],
  },

  // ==================== HERBS ====================
  basil: {
    category: "Herbs",
    defaultName: "Basil",
    emoji: "🌿",
    variants: [
      { id: "fresh-basil", name: "Fresh Basil", emoji: "🌿" },
      { id: "dried-basil", name: "Dried Basil", emoji: "🌿" },
      { id: "thai-basil", name: "Thai Basil", emoji: "🌿" },
    ],
  },
  cilantro: {
    category: "Herbs",
    defaultName: "Cilantro",
    emoji: "🌿",
    variants: [
      { id: "fresh-cilantro", name: "Fresh Cilantro", emoji: "🌿" },
      { id: "dried-cilantro", name: "Dried Cilantro", emoji: "🌿" },
    ],
  },
  parsley: {
    category: "Herbs",
    defaultName: "Parsley",
    emoji: "🌿",
    variants: [
      { id: "fresh-parsley", name: "Fresh Parsley", emoji: "🌿" },
      { id: "dried-parsley", name: "Dried Parsley", emoji: "🌿" },
      { id: "flat-leaf-parsley", name: "Flat-Leaf (Italian) Parsley", emoji: "🌿" },
      { id: "curly-parsley", name: "Curly Parsley", emoji: "🌿" },
    ],
  },
  rosemary: {
    category: "Herbs",
    defaultName: "Rosemary",
    emoji: "🌿",
    variants: [
      { id: "fresh-rosemary", name: "Fresh Rosemary", emoji: "🌿" },
      { id: "dried-rosemary", name: "Dried Rosemary", emoji: "🌿" },
    ],
  },
  thyme: {
    category: "Herbs",
    defaultName: "Thyme",
    emoji: "🌿",
    variants: [
      { id: "fresh-thyme", name: "Fresh Thyme", emoji: "🌿" },
      { id: "dried-thyme", name: "Dried Thyme", emoji: "🌿" },
    ],
  },
  oregano: {
    category: "Herbs",
    defaultName: "Oregano",
    emoji: "🌿",
    variants: [
      { id: "fresh-oregano", name: "Fresh Oregano", emoji: "🌿" },
      { id: "dried-oregano", name: "Dried Oregano", emoji: "🌿" },
    ],
  },
  mint: {
    category: "Herbs",
    defaultName: "Mint",
    emoji: "🌿",
    variants: [
      { id: "fresh-mint", name: "Fresh Mint", emoji: "🌿" },
      { id: "dried-mint", name: "Dried Mint", emoji: "🌿" },
      { id: "peppermint", name: "Peppermint", emoji: "🌿" },
      { id: "spearmint", name: "Spearmint", emoji: "🌿" },
    ],
  },
  dill: {
    category: "Herbs",
    defaultName: "Dill",
    emoji: "🌿",
    variants: [
      { id: "fresh-dill", name: "Fresh Dill", emoji: "🌿" },
      { id: "dried-dill", name: "Dried Dill", emoji: "🌿" },
    ],
  },

  // ==================== NUTS & SEEDS ====================
  nuts: {
    category: "Nuts & Seeds",
    defaultName: "Nuts",
    emoji: "🥜",
    variants: [
      { id: "almonds", name: "Almonds", emoji: "🥜" },
      { id: "sliced-almonds", name: "Sliced Almonds", emoji: "🥜" },
      { id: "walnuts", name: "Walnuts", emoji: "🥜" },
      { id: "pecans", name: "Pecans", emoji: "🥜" },
      { id: "cashews", name: "Cashews", emoji: "🥜" },
      { id: "peanuts", name: "Peanuts", emoji: "🥜" },
      { id: "pistachios", name: "Pistachios", emoji: "🥜" },
      { id: "macadamia-nuts", name: "Macadamia Nuts", emoji: "🥜" },
      { id: "pine-nuts", name: "Pine Nuts", emoji: "🥜" },
      { id: "mixed-nuts", name: "Mixed Nuts", emoji: "🥜" },
    ],
  },
  seeds: {
    category: "Nuts & Seeds",
    defaultName: "Seeds",
    emoji: "🌻",
    variants: [
      { id: "chia-seeds", name: "Chia Seeds", emoji: "🌻" },
      { id: "flax-seeds", name: "Flax Seeds", emoji: "🌻" },
      { id: "sunflower-seeds", name: "Sunflower Seeds", emoji: "🌻" },
      { id: "pumpkin-seeds", name: "Pumpkin Seeds (Pepitas)", emoji: "🌻" },
      { id: "sesame-seeds", name: "Sesame Seeds", emoji: "🌻" },
      { id: "hemp-seeds", name: "Hemp Seeds", emoji: "🌻" },
      { id: "poppy-seeds", name: "Poppy Seeds", emoji: "🌻" },
    ],
  },

  // ==================== CONDIMENTS & SAUCES ====================
  "soy-sauce": {
    category: "Condiments",
    defaultName: "Soy Sauce",
    emoji: "🥢",
    variants: [
      { id: "regular-soy-sauce", name: "Regular Soy Sauce", emoji: "🥢" },
      { id: "low-sodium-soy-sauce", name: "Low-Sodium Soy Sauce", emoji: "🥢" },
      { id: "tamari", name: "Tamari (Gluten-Free)", emoji: "🥢" },
      { id: "dark-soy-sauce", name: "Dark Soy Sauce", emoji: "🥢" },
    ],
  },
  mustard: {
    category: "Condiments",
    defaultName: "Mustard",
    emoji: "🟡",
    variants: [
      { id: "yellow-mustard", name: "Yellow Mustard", emoji: "🟡" },
      { id: "dijon-mustard", name: "Dijon Mustard", emoji: "🟡" },
      { id: "whole-grain-mustard", name: "Whole Grain Mustard", emoji: "🟡" },
      { id: "spicy-brown-mustard", name: "Spicy Brown Mustard", emoji: "🟡" },
      { id: "honey-mustard", name: "Honey Mustard", emoji: "🟡" },
    ],
  },
  "hot-sauce": {
    category: "Condiments",
    defaultName: "Hot Sauce",
    emoji: "🌶️",
    variants: [
      { id: "franks-hot-sauce", name: "Frank's RedHot", emoji: "🌶️" },
      { id: "sriracha", name: "Sriracha", emoji: "🌶️" },
      { id: "tabasco", name: "Tabasco", emoji: "🌶️" },
      { id: "cholula", name: "Cholula", emoji: "🌶️" },
      { id: "sambal-oelek", name: "Sambal Oelek", emoji: "🌶️" },
    ],
  },
  mayonnaise: {
    category: "Condiments",
    defaultName: "Mayonnaise",
    emoji: "🥫",
    variants: [
      { id: "regular-mayo", name: "Regular Mayonnaise", emoji: "🥫" },
      { id: "light-mayo", name: "Light Mayonnaise", emoji: "🥫" },
      { id: "olive-oil-mayo", name: "Olive Oil Mayonnaise", emoji: "🥫" },
      { id: "avocado-mayo", name: "Avocado Mayo", emoji: "🥫" },
    ],
  },
  ketchup: {
    category: "Condiments",
    defaultName: "Ketchup",
    emoji: "🍅",
    variants: [
      { id: "regular-ketchup", name: "Regular Ketchup", emoji: "🍅" },
      { id: "organic-ketchup", name: "Organic Ketchup", emoji: "🍅" },
      { id: "no-sugar-ketchup", name: "No Sugar Added Ketchup", emoji: "🍅" },
    ],
  },
  // ==================== BEVERAGES (DRINK INGREDIENTS) ====================
  vodka: {
    category: "Beverages",
    defaultName: "Vodka",
    emoji: "🍸",
    variants: [
      { id: "regular-vodka", name: "Vodka", emoji: "🍸" },
      { id: "premium-vodka", name: "Premium Vodka", emoji: "🍸" },
      { id: "flavored-vodka", name: "Flavored Vodka", emoji: "🍸" },
    ],
  },
  gin: {
    category: "Beverages",
    defaultName: "Gin",
    emoji: "🍸",
    variants: [
      { id: "london-dry-gin", name: "London Dry Gin", emoji: "🍸" },
      { id: "plymouth-gin", name: "Plymouth Gin", emoji: "🍸" },
    ],
  },
  "rum-white": {
    category: "Beverages",
    defaultName: "White Rum",
    emoji: "🍹",
    variants: [
      { id: "white-rum", name: "White Rum", emoji: "🍹" },
      { id: "silver-rum", name: "Silver Rum", emoji: "🍹" },
    ],
  },
  "rum-dark": {
    category: "Beverages",
    defaultName: "Dark Rum",
    emoji: "🍹",
    variants: [
      { id: "dark-rum", name: "Dark Rum", emoji: "🍹" },
      { id: "spiced-rum", name: "Spiced Rum", emoji: "🍹" },
    ],
  },
  tequila: {
    category: "Beverages",
    defaultName: "Tequila",
    emoji: "🥃",
    variants: [
      { id: "blanco-tequila", name: "Blanco Tequila", emoji: "🥃" },
      { id: "reposado-tequila", name: "Reposado Tequila", emoji: "🥃" },
      { id: "anejo-tequila", name: "Añejo Tequila", emoji: "🥃" },
    ],
  },
  whiskey: {
    category: "Beverages",
    defaultName: "Whiskey",
    emoji: "🥃",
    variants: [
      { id: "bourbon-whiskey", name: "Bourbon Whiskey", emoji: "🥃" },
      { id: "rye-whiskey", name: "Rye Whiskey", emoji: "🥃" },
      { id: "irish-whiskey", name: "Irish Whiskey", emoji: "🥃" },
    ],
  },
  bourbon: {
    category: "Beverages",
    defaultName: "Bourbon",
    emoji: "🥃",
    variants: [
      { id: "kentucky-bourbon", name: "Kentucky Bourbon", emoji: "🥃" },
    ],
  },
  scotch: {
    category: "Beverages",
    defaultName: "Scotch",
    emoji: "🥃",
    variants: [
      { id: "single-malt-scotch", name: "Single Malt Scotch", emoji: "🥃" },
      { id: "blended-scotch", name: "Blended Scotch", emoji: "🥃" },
    ],
  },
  brandy: {
    category: "Beverages",
    defaultName: "Brandy",
    emoji: "🥃",
    variants: [
      { id: "cognac", name: "Cognac", emoji: "🥃" },
      { id: "vs-brandy", name: "VS Brandy", emoji: "🥃" },
    ],
  },
  "triple-sec": {
    category: "Beverages",
    defaultName: "Triple Sec",
    emoji: "🍊",
    variants: [
      { id: "triple-sec", name: "Triple Sec", emoji: "🍊" },
      { id: "cointreau", name: "Cointreau", emoji: "🍊" },
      { id: "grand-marnier", name: "Grand Marnier", emoji: "🍊" },
    ],
  },
  kahlua: {
    category: "Beverages",
    defaultName: "Kahlúa",
    emoji: "☕",
    variants: [
      { id: "kahlua", name: "Kahlúa", emoji: "☕" },
      { id: "coffee-liqueur", name: "Coffee Liqueur", emoji: "☕" },
    ],
  },
  baileys: {
    category: "Beverages",
    defaultName: "Baileys",
    emoji: "🍫",
    variants: [
      { id: "baileys-original", name: "Baileys Original", emoji: "🍫" },
      { id: "irish-cream", name: "Irish Cream", emoji: "🍫" },
    ],
  },
  amaretto: {
    category: "Beverages",
    defaultName: "Amaretto",
    emoji: "🍸",
    variants: [
      { id: "amaretto", name: "Amaretto", emoji: "🍸" },
      { id: "disaronno", name: "Disaronno", emoji: "🍸" },
    ],
  },
  campari: {
    category: "Beverages",
    defaultName: "Campari",
    emoji: "🍹",
    variants: [
      { id: "campari", name: "Campari", emoji: "🍹" },
      { id: "aperol", name: "Aperol", emoji: "🍹" },
    ],
  },
  "vermouth-sweet": {
    category: "Beverages",
    defaultName: "Sweet Vermouth",
    emoji: "🍷",
    variants: [
      { id: "sweet-vermouth", name: "Sweet Vermouth", emoji: "🍷" },
    ],
  },
  "vermouth-dry": {
    category: "Beverages",
    defaultName: "Dry Vermouth",
    emoji: "🍷",
    variants: [
      { id: "dry-vermouth", name: "Dry Vermouth", emoji: "🍷" },
    ],
  },
  "club-soda": {
    category: "Beverages",
    defaultName: "Club Soda",
    emoji: "🥤",
    variants: [
      { id: "club-soda", name: "Club Soda", emoji: "🥤" },
      { id: "sparkling-water", name: "Sparkling Water", emoji: "🥤" },
    ],
  },
  "tonic-water": {
    category: "Beverages",
    defaultName: "Tonic Water",
    emoji: "🥤",
    variants: [
      { id: "regular-tonic", name: "Tonic Water", emoji: "🥤" },
      { id: "diet-tonic", name: "Diet Tonic Water", emoji: "🥤" },
    ],
  },
  "ginger-beer": {
    category: "Beverages",
    defaultName: "Ginger Beer",
    emoji: "🍺",
    variants: [
      { id: "ginger-beer", name: "Ginger Beer", emoji: "🍺" },
      { id: "spicy-ginger-beer", name: "Spicy Ginger Beer", emoji: "🍺" },
    ],
  },
  "ginger-ale": {
    category: "Beverages",
    defaultName: "Ginger Ale",
    emoji: "🥤",
    variants: [
      { id: "ginger-ale", name: "Ginger Ale", emoji: "🥤" },
    ],
  },
  cola: {
    category: "Beverages",
    defaultName: "Cola",
    emoji: "🥤",
    variants: [
      { id: "cola", name: "Cola", emoji: "🥤" },
      { id: "diet-cola", name: "Diet Cola", emoji: "🥤" },
    ],
  },
  "lemon-lime-soda": {
    category: "Beverages",
    defaultName: "Lemon-Lime Soda",
    emoji: "🥤",
    variants: [
      { id: "sprite", name: "Sprite", emoji: "🥤" },
      { id: "7up", name: "7UP", emoji: "🥤" },
    ],
  },
  "cranberry-juice": {
    category: "Beverages",
    defaultName: "Cranberry Juice",
    emoji: "🧃",
    variants: [
      { id: "cranberry-juice", name: "Cranberry Juice", emoji: "🧃" },
      { id: "cranberry-cocktail", name: "Cranberry Juice Cocktail", emoji: "🧃" },
    ],
  },
  "orange-juice": {
    category: "Beverages",
    defaultName: "Orange Juice",
    emoji: "🍊",
    variants: [
      { id: "fresh-orange-juice", name: "Fresh Orange Juice", emoji: "🍊" },
      { id: "store-orange-juice", name: "Orange Juice", emoji: "🍊" },
    ],
  },
  "pineapple-juice": {
    category: "Beverages",
    defaultName: "Pineapple Juice",
    emoji: "🍍",
    variants: [
      { id: "pineapple-juice", name: "Pineapple Juice", emoji: "🍍" },
    ],
  },
  "grapefruit-juice": {
    category: "Beverages",
    defaultName: "Grapefruit Juice",
    emoji: "🍊",
    variants: [
      { id: "grapefruit-juice", name: "Grapefruit Juice", emoji: "🍊" },
      { id: "ruby-red-grapefruit", name: "Ruby Red Grapefruit Juice", emoji: "🍊" },
    ],
  },
  "tomato-juice": {
    category: "Beverages",
    defaultName: "Tomato Juice",
    emoji: "🍅",
    variants: [
      { id: "tomato-juice", name: "Tomato Juice", emoji: "🍅" },
    ],
  },
  "apple-juice": {
    category: "Beverages",
    defaultName: "Apple Juice",
    emoji: "🍎",
    variants: [
      { id: "apple-juice", name: "Apple Juice", emoji: "🍎" },
      { id: "apple-cider", name: "Apple Cider", emoji: "🍎" },
    ],
  },
  "coconut-cream": {
    category: "Beverages",
    defaultName: "Coconut Cream",
    emoji: "🥥",
    variants: [
      { id: "coconut-cream", name: "Coconut Cream", emoji: "🥥" },
      { id: "cream-of-coconut", name: "Cream of Coconut", emoji: "🥥" },
    ],
  },
  "coconut-water": {
    category: "Beverages",
    defaultName: "Coconut Water",
    emoji: "🥥",
    variants: [
      { id: "coconut-water", name: "Coconut Water", emoji: "🥥" },
    ],
  },
  coffee: {
    category: "Beverages",
    defaultName: "Coffee",
    emoji: "☕",
    variants: [
      { id: "brewed-coffee", name: "Brewed Coffee", emoji: "☕" },
      { id: "cold-brew", name: "Cold Brew Coffee", emoji: "☕" },
    ],
  },
  espresso: {
    category: "Beverages",
    defaultName: "Espresso",
    emoji: "☕",
    variants: [
      { id: "espresso-shot", name: "Espresso", emoji: "☕" },
    ],
  },
  "green-tea": {
    category: "Beverages",
    defaultName: "Green Tea",
    emoji: "🍵",
    variants: [
      { id: "brewed-green-tea", name: "Brewed Green Tea", emoji: "🍵" },
    ],
  },
  matcha: {
    category: "Beverages",
    defaultName: "Matcha Powder",
    emoji: "🍵",
    variants: [
      { id: "matcha-powder", name: "Matcha Powder", emoji: "🍵" },
      { id: "culinary-matcha", name: "Culinary Matcha", emoji: "🍵" },
    ],
  },
  chai: {
    category: "Beverages",
    defaultName: "Chai",
    emoji: "🍵",
    variants: [
      { id: "chai-concentrate", name: "Chai Concentrate", emoji: "🍵" },
      { id: "chai-tea-bags", name: "Chai Tea Bags", emoji: "🍵" },
    ],
  },
  "simple-syrup": {
    category: "Beverages",
    defaultName: "Simple Syrup",
    emoji: "🍯",
    variants: [
      { id: "simple-syrup", name: "Simple Syrup", emoji: "🍯" },
      { id: "rich-simple-syrup", name: "Rich Simple Syrup (2:1)", emoji: "🍯" },
    ],
  },
  grenadine: {
    category: "Beverages",
    defaultName: "Grenadine",
    emoji: "🍒",
    variants: [
      { id: "grenadine-syrup", name: "Grenadine Syrup", emoji: "🍒" },
    ],
  },
  agave: {
    category: "Beverages",
    defaultName: "Agave Nectar",
    emoji: "🌵",
    variants: [
      { id: "agave-nectar", name: "Agave Nectar", emoji: "🌵" },
      { id: "light-agave", name: "Light Agave", emoji: "🌵" },
    ],
  },
  orgeat: {
    category: "Beverages",
    defaultName: "Orgeat Syrup",
    emoji: "🥜",
    variants: [
      { id: "orgeat-syrup", name: "Orgeat Syrup", emoji: "🥜" },
    ],
  },
  elderflower: {
    category: "Beverages",
    defaultName: "Elderflower Syrup",
    emoji: "🌸",
    variants: [
      { id: "elderflower-syrup", name: "Elderflower Syrup", emoji: "🌸" },
      { id: "st-germain", name: "St-Germain Liqueur", emoji: "🌸" },
    ],
  },
  "lavender-syrup": {
    category: "Beverages",
    defaultName: "Lavender Syrup",
    emoji: "💜",
    variants: [
      { id: "lavender-syrup", name: "Lavender Syrup", emoji: "💜" },
    ],
  },
  "vanilla-syrup": {
    category: "Beverages",
    defaultName: "Vanilla Syrup",
    emoji: "🍦",
    variants: [
      { id: "vanilla-syrup", name: "Vanilla Syrup", emoji: "🍦" },
    ],
  },
  "ginger-syrup": {
    category: "Beverages",
    defaultName: "Ginger Syrup",
    emoji: "🫚",
    variants: [
      { id: "ginger-syrup", name: "Ginger Syrup", emoji: "🫚" },
    ],
  },
  "hibiscus-syrup": {
    category: "Beverages",
    defaultName: "Hibiscus Syrup",
    emoji: "🌺",
    variants: [
      { id: "hibiscus-syrup", name: "Hibiscus Syrup", emoji: "🌺" },
    ],
  },
  "rose-syrup": {
    category: "Beverages",
    defaultName: "Rose Syrup",
    emoji: "🌹",
    variants: [
      { id: "rose-syrup", name: "Rose Syrup", emoji: "🌹" },
    ],
  },
  "coconut-syrup": {
    category: "Beverages",
    defaultName: "Coconut Syrup",
    emoji: "🥥",
    variants: [
      { id: "coconut-syrup", name: "Coconut Syrup", emoji: "🥥" },
    ],
  },
  "caramel-syrup": {
    category: "Beverages",
    defaultName: "Caramel Syrup",
    emoji: "🍮",
    variants: [
      { id: "caramel-syrup", name: "Caramel Syrup", emoji: "🍮" },
    ],
  },
  "pumpkin-spice-syrup": {
    category: "Beverages",
    defaultName: "Pumpkin Spice Syrup",
    emoji: "🎃",
    variants: [
      { id: "pumpkin-spice-syrup", name: "Pumpkin Spice Syrup", emoji: "🎃" },
    ],
  },
  "hazelnut-syrup": {
    category: "Beverages",
    defaultName: "Hazelnut Syrup",
    emoji: "🌰",
    variants: [
      { id: "hazelnut-syrup", name: "Hazelnut Syrup", emoji: "🌰" },
    ],
  },
  "peppermint-syrup": {
    category: "Beverages",
    defaultName: "Peppermint Syrup",
    emoji: "🌿",
    variants: [
      { id: "peppermint-syrup", name: "Peppermint Syrup", emoji: "🌿" },
    ],
  },
  "chocolate-syrup": {
    category: "Beverages",
    defaultName: "Chocolate Syrup",
    emoji: "🍫",
    variants: [
      { id: "chocolate-syrup", name: "Chocolate Syrup", emoji: "🍫" },
    ],
  },
  "white-chocolate-syrup": {
    category: "Beverages",
    defaultName: "White Chocolate Syrup",
    emoji: "🤍",
    variants: [
      { id: "white-chocolate-syrup", name: "White Chocolate Syrup", emoji: "🤍" },
    ],
  },
  angostura: {
    category: "Beverages",
    defaultName: "Angostura Bitters",
    emoji: "🍶",
    variants: [
      { id: "angostura-bitters", name: "Angostura Bitters", emoji: "🍶" },
    ],
  },
  "orange-bitters": {
    category: "Beverages",
    defaultName: "Orange Bitters",
    emoji: "🍊",
    variants: [
      { id: "orange-bitters", name: "Orange Bitters", emoji: "🍊" },
    ],
  },
  "cocktail-cherries": {
    category: "Beverages",
    defaultName: "Cocktail Cherries",
    emoji: "🍒",
    variants: [
      { id: "maraschino-cherries", name: "Maraschino Cherries", emoji: "🍒" },
      { id: "luxardo-cherries", name: "Luxardo Cherries", emoji: "🍒" },
    ],
  },
  "cocktail-olives": {
    category: "Beverages",
    defaultName: "Cocktail Olives",
    emoji: "🫒",
    variants: [
      { id: "cocktail-olives", name: "Cocktail Olives", emoji: "🫒" },
      { id: "stuffed-olives", name: "Stuffed Olives", emoji: "🫒" },
    ],
  },
};

// Helper to get display name for an ingredient
export function getIngredientDisplayName(ingredientId: string): string {
  const variant = ingredientVariants[ingredientId];
  if (variant) {
    return variant.defaultName;
  }
  // Fallback: capitalize and replace hyphens
  return ingredientId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// Helper to get category for an ingredient
export function getIngredientCategory(ingredientId: string): string {
  return ingredientVariants[ingredientId]?.category || "Other";
}
