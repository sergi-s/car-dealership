import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase Admin Setup
const serviceAccountPath = join(__dirname, '../serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ serviceAccountKey.json not found. Please add your Firebase service account key.');
  process.exit(1);
}
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Helper function to categorize vehicle body type based on Derek Piccott Auto Sales inventory
function categorizeVehicleType(text) {
  const lowerText = text.toLowerCase();
  
  // ATVs and recreational vehicles
  if (lowerText.includes('atv') || lowerText.includes('4 wheeler') || lowerText.includes('quad') || 
      lowerText.includes('lanhai') || lowerText.includes('cx moto')) {
    return 'atv';
  }
  
  // Motorcycles and trikes
  if (lowerText.includes('motorcycle') || lowerText.includes('bike') || lowerText.includes('trike') || 
      lowerText.includes('suzuki trike')) {
    return 'motorcycle';
  }
  
  // Campers and RVs
  if (lowerText.includes('camper') || lowerText.includes('rv') || lowerText.includes('motorhome') || 
      lowerText.includes('camper van')) {
    return 'camper';
  }
  
  // Cargo vans
  if (lowerText.includes('cargo van') || lowerText.includes('promaster') || lowerText.includes('cargo van promaster')) {
    return 'cargo-van';
  }
  
  // Minivans
  if (lowerText.includes('minivan') || lowerText.includes('sedona') || lowerText.includes('quest') || 
      lowerText.includes('mini van') || lowerText.includes('7 seater')) {
    return 'minivan';
  }
  
  // Crew cab trucks
  if (lowerText.includes('crew cab') || lowerText.includes('crew-cab') || lowerText.includes('all terrain')) {
    return 'crew-cab';
  }
  
  // Extended cab trucks
  if (lowerText.includes('extended cab') || lowerText.includes('extended-cab')) {
    return 'extended-cab';
  }
  
  // Regular cab trucks
  if (lowerText.includes('regular cab') || lowerText.includes('regular-cab')) {
    return 'regular-cab';
  }
  
  // Pickup trucks
  if (lowerText.includes('pickup') || lowerText.includes('tacoma') || lowerText.includes('f-150') || 
      lowerText.includes('long box') || lowerText.includes('outdoorsman')) {
    return 'pickup';
  }
  
  // Regular vans
  if (lowerText.includes('van') && !lowerText.includes('cargo') && !lowerText.includes('mini')) {
    return 'van';
  }
  
  // SUVs
  if (lowerText.includes('wrangler') || lowerText.includes('grand cherokee') || lowerText.includes('tucson') || 
      lowerText.includes('kashkai') || lowerText.includes('kona') || lowerText.includes('rav 4') || 
      lowerText.includes('rvr') || lowerText.includes('trail hawk')) {
    return 'suv';
  }
  
  // Coupes and sports cars
  if (lowerText.includes('corvette') || lowerText.includes('camaro') || lowerText.includes('challenger') || 
      lowerText.includes('gennessis coupe') || lowerText.includes('malibu')) {
    return 'coupe';
  }
  
  // Classic vehicles
  if (lowerText.includes('classic') || lowerText.includes('196') || lowerText.includes('197') || 
      lowerText.includes('pace car') || lowerText.includes('matching num') || lowerText.includes('fury')) {
    return 'classic';
  }
  
  // Luxury vehicles
  if (lowerText.includes('luxury') || lowerText.includes('bmw') || lowerText.includes('mercedes') || 
      lowerText.includes('premier') || lowerText.includes('indy 500')) {
    return 'luxury';
  }
  
  // Commercial vehicles
  if (lowerText.includes('commercial') || lowerText.includes('work') || lowerText.includes('cargo')) {
    return 'commercial';
  }
  
  // Recreational vehicles
  if (lowerText.includes('recreational') || lowerText.includes('touring') || lowerText.includes('edition')) {
    return 'recreational';
  }
  
  // Wagons
  if (lowerText.includes('wagon') || lowerText.includes('flex') || lowerText.includes('outback') || 
      lowerText.includes('forester')) {
    return 'wagon';
  }
  
  // Sedans
  if (lowerText.includes('sedan') || lowerText.includes('civic') || lowerText.includes('corolla') || 
      lowerText.includes('jetta') || lowerText.includes('accent') || lowerText.includes('cruze') || 
      lowerText.includes('optima') || lowerText.includes('rio') || lowerText.includes('versa') || 
      lowerText.includes('mazda 3') || lowerText.includes('300')) {
    return 'sedan';
  }
  
  // Trucks (general)
  if (lowerText.includes('truck') || lowerText.includes('4x4') || lowerText.includes('diesel')) {
    return 'truck';
  }
  
  return 'other';
}

const BASE_URL = 'https://www.derekpiccottautosales.ca/browse';

async function scrapeVehicles() {
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('🌐 Navigating to:', BASE_URL);
    
    try {
      // Try with a longer timeout and different wait strategy
      await page.goto(BASE_URL, { 
        waitUntil: 'domcontentloaded',
        timeout: 60000 // 60 seconds timeout
      });
      
      // Wait for network to be idle or timeout after 30 seconds
      try {
        await page.waitForFunction(
          () => {
            return new Promise((resolve) => {
              let lastNetworkActivity = Date.now();
              const checkInterval = setInterval(() => {
                if (Date.now() - lastNetworkActivity > 2000) {
                  clearInterval(checkInterval);
                  resolve(true);
                }
              }, 100);
              
              // Listen for network requests
              const observer = new PerformanceObserver((list) => {
                lastNetworkActivity = Date.now();
              });
              observer.observe({ entryTypes: ['resource'] });
              
              // Timeout after 30 seconds
              setTimeout(() => {
                clearInterval(checkInterval);
                observer.disconnect();
                resolve(true);
              }, 30000);
            });
          },
          { timeout: 35000 }
        );
      } catch (waitError) {
        console.log('⚠️ Network idle wait timed out, continuing anyway...');
      }
      
      // Additional wait for any dynamic content
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } catch (navigationError) {
      console.error('❌ Navigation failed:', navigationError.message);
      
      // Try alternative approach - just wait for basic page load
      try {
        console.log('🔄 Trying alternative navigation approach...');
        await page.goto(BASE_URL, { 
          waitUntil: 'load',
          timeout: 45000 
        });
        await new Promise(resolve => setTimeout(resolve, 10000));
      } catch (altError) {
        console.error('❌ Alternative navigation also failed:', altError.message);
        throw new Error('Failed to navigate to the website after multiple attempts');
      }
    }
    
    const html = await page.content();
    const $ = cheerio.load(html);

  console.log('🔍 Analyzing page structure...');
  
  // Try multiple selectors to find vehicle listings
  const selectors = [
    '.vehicle-card', '.inventory-listing', '.inventory-card', '.card', '.vehicle-listing',
    '.listing', '.item', '.product', '.vehicle', '.car-listing',
    '[class*="vehicle"]', '[class*="car"]', '[class*="listing"]', '[class*="inventory"]'
  ];
  
  let vehicleCards = null;
  for (const selector of selectors) {
    vehicleCards = $(selector);
    if (vehicleCards.length > 0) {
      console.log(`✅ Found ${vehicleCards.length} vehicles using selector: ${selector}`);
      break;
    }
  }
  
  if (!vehicleCards || vehicleCards.length === 0) {
    console.log('⚠️ No vehicle cards found with common selectors. Trying to find any elements with vehicle-like content...');
    // Look for any elements that might contain vehicle information
    const allElements = $('*');
    const potentialVehicles = [];
    allElements.each((i, el) => {
      const text = $(el).text().toLowerCase();
      if (text.includes('$') && (text.includes('km') || text.includes('mile') || text.includes('202') || text.includes('201'))) {
        potentialVehicles.push(el);
      }
    });
    console.log(`Found ${potentialVehicles.length} potential vehicle elements`);
    // Convert to cheerio object
    vehicleCards = $(potentialVehicles);
  }
  
  const vehicles = [];

  vehicleCards.each((i, el) => {
    console.log(`\n🔍 Processing vehicle ${i + 1}...`);
    
    // Try to extract as much as possible from the card
    const makeModel = $(el).find('.make-model, .vehicle-title, .title, h2, h3, h4').text().trim();
    const year = parseInt($(el).find('.year, .vehicle-year').text().trim()) || null;
    // Enhanced price extraction for listing cards
    const priceText = $(el).find('.price, .vehicle-price, .listing-price, [class*="price"]').text();
    let price = null;
    let salePrice = null;
    
    if (priceText) {
      // Look for multiple prices in the price text
      const priceMatches = priceText.match(/\$?(\d{1,3}(?:,\d{3})*)/g);
      if (priceMatches && priceMatches.length > 0) {
        const prices = priceMatches.map(p => parseInt(p.replace(/[$,]/g, '')));
        prices.sort((a, b) => a - b);
        
        if (prices.length === 1) {
          price = prices[0];
        } else if (prices.length >= 2) {
          // Assume higher is regular, lower is sale
          price = prices[prices.length - 1];
          salePrice = prices[prices.length - 2];
        }
      }
    }
    
    // Also check for specific sale price elements in the card
    const salePriceText = $(el).find('.sale-price, .discount-price, .reduced-price, .was-price, .old-price, [class*="sale"], [class*="discount"]').text();
    if (salePriceText) {
      const saleMatch = salePriceText.match(/\$?(\d{1,3}(?:,\d{3})*)/);
      if (saleMatch) {
        salePrice = parseInt(saleMatch[1].replace(/,/g, ''));
      }
    }
    const mileageText = $(el).find('.mileage, .vehicle-mileage, [class*="mileage"], [class*="km"]').text().replace(/[^\d]/g, '');
    const mileage = mileageText ? parseInt(mileageText) : null;
    // Enhanced body type detection based on Derek Piccott Auto Sales inventory
    let bodyType = $(el).find('.body-type, .vehicle-body, [class*="body"]').text().trim() || '';
    
    // If no body type found, use the helper function to categorize based on content
    if (!bodyType) {
      const fullText = $(el).text();
      bodyType = categorizeVehicleType(fullText);
    }
    const color = $(el).find('.color, .vehicle-color, [class*="color"]').text().trim() || '';
    const description = $(el).find('.description, .vehicle-description, .desc, [class*="desc"]').text().trim() || '';
    
    const imageEls = $(el).find('img');
    const images = [];
    let isSold = false;
    imageEls.each((i, img) => {
      const src = $(img).attr('src');
      if (src && !src.startsWith('data:')) {
        // Check if this is a "sold" image
        if (src.toLowerCase().includes('sold.png') || src.toLowerCase().includes('sold.jpg') || src.toLowerCase().includes('sold.jpeg')) {
          isSold = true;
        } else {
          images.push(src);
        }
      }
    });
    
    // Fallbacks for missing fields - try to parse from the entire element text
    let make = '', model = '', extractedYear = year;
    const fullText = $(el).text();
    
    if (makeModel) {
      const parts = makeModel.split(' ');
      if (parts.length > 1) {
        extractedYear = extractedYear || parseInt(parts[0]);
        make = parts[1];
        model = parts.slice(2).join(' ');
      } else {
        make = makeModel;
      }
    } else {
      // Try to extract from full text
      const yearMatch = fullText.match(/(20\d{2})/);
      if (yearMatch) extractedYear = parseInt(yearMatch[1]);
      
      // Look for common car makes and extract model
      const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Dodge', 'Jeep', 'Subaru', 'Mazda', 'Hyundai', 'Kia', 'Volkswagen', 'Volvo', 'Lexus', 'Acura', 'Infiniti', 'Buick', 'Cadillac', 'Lincoln', 'Chrysler', 'Pontiac', 'Saturn', 'Scion', 'Mitsubishi', 'Suzuki', 'Isuzu', 'Saab', 'Alfa Romeo', 'Fiat', 'Jaguar', 'Land Rover', 'Mini', 'Smart', 'Ferrari', 'Lamborghini', 'Porsche', 'Aston Martin', 'Bentley', 'Rolls Royce', 'McLaren', 'Bugatti', 'Koenigsegg', 'Pagani', 'Lotus', 'Caterham', 'Ariel', 'Noble', 'Gumpert', 'Rimac', 'Pininfarina', 'Italdesign', 'Bertone', 'Zagato', 'Ghia', 'Fisker', 'Tesla', 'Rivian', 'Lucid', 'Polestar', 'Nio', 'Xpeng', 'Li Auto', 'BYD', 'Geely', 'Great Wall', 'Haval', 'Changan', 'Chery', 'JAC', 'Dongfeng', 'FAW', 'SAIC', 'GAC', 'BAIC', 'Brilliance', 'Haima', 'Lifan', 'Zotye', 'Wuling', 'Hongqi', 'NIO', 'XPeng', 'Li Auto', 'BYD', 'Geely', 'Great Wall', 'Haval', 'Changan', 'Chery', 'JAC', 'Dongfeng', 'FAW', 'SAIC', 'GAC', 'BAIC', 'Brilliance', 'Haima', 'Lifan', 'Zotye', 'Wuling', 'Hongqi'];
      for (const carMake of makes) {
        if (fullText.includes(carMake)) {
          make = carMake;
          // Try to extract model after the make
          const makeIndex = fullText.indexOf(carMake);
          const afterMake = fullText.substring(makeIndex + carMake.length);
          const modelMatch = afterMake.match(/^\s*([A-Za-z0-9\s]+?)(?:\s|$|,|\.)/);
          if (modelMatch) {
            model = modelMatch[1].trim();
          }
          break;
        }
      }
    }
    
    // Enhanced price extraction to handle both regular and sale prices
    let extractedPrice = price;
    let extractedSalePrice = salePrice; // Use sale price from card if found
    
    if (!extractedPrice) {
      // Look for multiple price patterns in the text
      const priceMatches = fullText.match(/\$?(\d{1,3}(?:,\d{3})*)/g);
      if (priceMatches && priceMatches.length > 0) {
        const prices = priceMatches.map(p => parseInt(p.replace(/[$,]/g, '')));
        
        // Sort prices to identify regular and sale prices
        prices.sort((a, b) => a - b);
        
        if (prices.length === 1) {
          // Single price found
          extractedPrice = prices[0];
        } else if (prices.length >= 2) {
          // Multiple prices found - assume higher is regular, lower is sale
          const highestPrice = prices[prices.length - 1];
          const secondHighestPrice = prices[prices.length - 2];
          
          // If there's a significant difference (>10%), treat as sale price
          if (highestPrice > secondHighestPrice * 1.1) {
            extractedPrice = highestPrice;
            extractedSalePrice = secondHighestPrice;
          } else {
            // Use the highest price as regular price
            extractedPrice = highestPrice;
          }
        }
      }
    }
    
    // Also check for specific sale price indicators
    const salePricePatterns = [
      /sale\s*price[:\s]*\$?(\d{1,3}(?:,\d{3})*)/i,
      /was\s*\$?(\d{1,3}(?:,\d{3})*)\s*now\s*\$?(\d{1,3}(?:,\d{3})*)/i,
      /original\s*\$?(\d{1,3}(?:,\d{3})*)\s*sale\s*\$?(\d{1,3}(?:,\d{3})*)/i,
      /reduced\s*from\s*\$?(\d{1,3}(?:,\d{3})*)\s*to\s*\$?(\d{1,3}(?:,\d{3})*)/i,
      /marked\s*down\s*from\s*\$?(\d{1,3}(?:,\d{3})*)\s*to\s*\$?(\d{1,3}(?:,\d{3})*)/i
    ];
    
    for (const pattern of salePricePatterns) {
      const match = fullText.match(pattern);
      if (match) {
        if (match.length === 2) {
          // Single sale price found
          const salePrice = parseInt(match[1].replace(/,/g, ''));
          if (!extractedSalePrice || salePrice < extractedSalePrice) {
            extractedSalePrice = salePrice;
          }
        } else if (match.length === 3) {
          // Original and sale price found
          const originalPrice = parseInt(match[1].replace(/,/g, ''));
          const salePrice = parseInt(match[2].replace(/,/g, ''));
          if (!extractedPrice || originalPrice > extractedPrice) {
            extractedPrice = originalPrice;
          }
          if (!extractedSalePrice || salePrice < extractedSalePrice) {
            extractedSalePrice = salePrice;
          }
        }
      }
    }
    
    // Clean up concatenated prices (e.g., "6950065000" -> 69500)
    if (extractedPrice && extractedPrice > 1000000) {
      const priceStr = extractedPrice.toString();
      // Try to find a reasonable price by looking for patterns
      if (priceStr.length > 6) {
        // Try different splits
        const possiblePrices = [
          parseInt(priceStr.substring(0, 5)), // First 5 digits
          parseInt(priceStr.substring(0, 6)), // First 6 digits
          parseInt(priceStr.substring(priceStr.length - 5)), // Last 5 digits
          parseInt(priceStr.substring(priceStr.length - 6)), // Last 6 digits
        ];
        // Find the most reasonable price (between 1000 and 200000)
        const reasonablePrice = possiblePrices.find(p => p >= 1000 && p <= 200000);
        if (reasonablePrice) {
          extractedPrice = reasonablePrice;
        }
      }
    }
    
    // Try to extract mileage from full text if not found
    let extractedMileage = mileage;
    if (!extractedMileage) {
      const mileageMatch = fullText.match(/(\d{1,3}(?:,\d{3})*)\s*(?:km|mile|miles)/i);
      if (mileageMatch) extractedMileage = parseInt(mileageMatch[1].replace(/,/g, ''));
    }
    
    const vehicle = {
      make,
      model,
      year: extractedYear,
      price: extractedPrice,
      salePrice: extractedSalePrice, // Use extracted sale price if found
      mileage: extractedMileage,
      fuelType: '', // Not always available
      transmission: '', // Not always available
      bodyType,
      color,
      description,
      images,
      features: [],
      vin: '',
      stockNumber: '',
      isAvailable: !isSold, // Mark as unavailable if sold
    };
    
    const priceDisplay = vehicle.salePrice 
      ? `$${vehicle.price} (Sale: $${vehicle.salePrice})` 
      : `$${vehicle.price}`;
    const statusDisplay = vehicle.isAvailable ? 'Available' : 'SOLD';
    console.log(`   Found: ${vehicle.year} ${vehicle.make} ${vehicle.model} - ${priceDisplay} - ${vehicle.mileage}km - ${statusDisplay}`);
    
    vehicles.push(vehicle);
  });

  // Try to follow links to detail pages for more info if available
  const detailLinks = [];
  $('.vehicle-card a, .inventory-listing a, .card a').each((i, el) => {
    const href = $(el).attr('href');
    if (href && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
      const url = href.startsWith('http') ? href : `${BASE_URL.replace(/\/browse$/, '')}${href}`;
      if (!detailLinks.includes(url)) detailLinks.push(url);
    }
  });

  for (const [i, url] of detailLinks.entries()) {
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      const detailHtml = await page.content();
      const $$ = cheerio.load(detailHtml);
      // Try to extract more details
      const title = $$('h1, .vehicle-title, .title').text().trim();
      let make = '', model = '', year = null;
      if (title) {
        const parts = title.split(' ');
        if (parts.length > 1) {
          year = parseInt(parts[0]);
          make = parts[1];
          model = parts.slice(2).join(' ');
        } else {
          make = title;
        }
      }
      // Enhanced price extraction for detail pages
      const priceText = $$('.price, .vehicle-price, .listing-price').text();
      let price = null;
      let salePrice = null;
      
      if (priceText) {
        // Look for multiple prices in the price text
        const priceMatches = priceText.match(/\$?(\d{1,3}(?:,\d{3})*)/g);
        if (priceMatches && priceMatches.length > 0) {
          const prices = priceMatches.map(p => parseInt(p.replace(/[$,]/g, '')));
          prices.sort((a, b) => a - b);
          
          if (prices.length === 1) {
            price = prices[0];
          } else if (prices.length >= 2) {
            // Assume higher is regular, lower is sale
            price = prices[prices.length - 1];
            salePrice = prices[prices.length - 2];
          }
        }
      }
      
      // Also check for specific sale price elements
      const salePriceText = $$('.sale-price, .discount-price, .reduced-price, .was-price').text();
      if (salePriceText) {
        const saleMatch = salePriceText.match(/\$?(\d{1,3}(?:,\d{3})*)/);
        if (saleMatch) {
          salePrice = parseInt(saleMatch[1].replace(/,/g, ''));
        }
      }
      const mileageText = $$('.mileage, .vehicle-mileage').text().replace(/[^\d]/g, '');
      const mileage = mileageText ? parseInt(mileageText) : null;
      // Enhanced body type detection for detail pages
      let bodyType = $$('.body-type, .vehicle-body').text().trim() || '';
      
      // If no body type found, use the helper function to categorize based on content
      if (!bodyType) {
        const fullText = $$('body').text();
        bodyType = categorizeVehicleType(fullText);
      }
      const color = $$('.color, .vehicle-color').text().trim() || '';
      const description = $$('.description, .vehicle-description, .desc').text().trim() || '';
      const imageEls = $$('img');
      const images = [];
      let isSold = false;
      imageEls.each((i, img) => {
        const src = $$(img).attr('src');
        if (src && !src.startsWith('data:')) {
          // Check if this is a "sold" image
          if (src.toLowerCase().includes('sold.png') || src.toLowerCase().includes('sold.jpg') || src.toLowerCase().includes('sold.jpeg')) {
            isSold = true;
          } else {
            images.push(src);
          }
        }
      });
      // Try to find VIN, stock number, transmission, fuel type, features
      let vin = '', stockNumber = '', transmission = '', fuelType = '', features = [];
      $$('.vin, .vehicle-vin').each((i, el) => { vin = $$(el).text().trim(); });
      $$('.stock, .stock-number').each((i, el) => { stockNumber = $$(el).text().trim(); });
      $$('.transmission, .vehicle-transmission').each((i, el) => { transmission = $$(el).text().trim(); });
      $$('.fuel, .fuel-type').each((i, el) => { fuelType = $$(el).text().trim(); });
      $$('.features li, .feature').each((i, el) => { features.push($$(el).text().trim()); });
      vehicles[i] = {
        ...vehicles[i],
        make: make || vehicles[i].make,
        model: model || vehicles[i].model,
        year: year || vehicles[i].year,
        price: price || vehicles[i].price,
        salePrice: salePrice || vehicles[i].salePrice, // Use extracted sale price
        mileage: mileage || vehicles[i].mileage,
        bodyType: bodyType || vehicles[i].bodyType,
        color: color || vehicles[i].color,
        description: description || vehicles[i].description,
        images: images.length ? images : vehicles[i].images,
        vin,
        stockNumber,
        transmission,
        fuelType,
        features: features.length ? features : vehicles[i].features,
        isAvailable: isSold ? false : vehicles[i].isAvailable, // Update availability based on sold status
      };
    } catch (err) {
      console.warn(`⚠️ Failed to scrape detail page ${url}:`, err.message);
    }
  }

  // Clean and filter vehicles
  const cleanedVehicles = vehicles
    .filter(v => v.make && v.year && v.price && v.price > 0 && v.price < 1000000) // Basic validation
    .map(v => {
      const cleanedVehicle = {
        ...v,
        price: Math.round(v.price), // Round to nearest dollar
        mileage: v.mileage || 0,
        model: v.model || 'Unknown',
        make: v.make || 'Unknown',
        year: v.year || new Date().getFullYear(),
        fuelType: v.fuelType || 'gasoline',
        transmission: v.transmission || 'automatic',
        bodyType: v.bodyType ? categorizeVehicleType(v.bodyType) : 'other',
        color: v.color || 'Unknown',
        description: v.description || `${v.year} ${v.make} ${v.model}`,
        images: v.images || [],
        features: v.features || [],
        vin: v.vin || '',
        stockNumber: v.stockNumber || `STK${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        isAvailable: true,
      };
      
      // Only include salePrice if it exists and is valid
      if (v.salePrice && v.salePrice > 0 && v.salePrice < v.price) {
        cleanedVehicle.salePrice = Math.round(v.salePrice);
      }
      
      return cleanedVehicle;
    })
    .filter((v, index, arr) => {
      // Remove duplicates based on make, model, year, and price
      const duplicate = arr.findIndex(item => 
        item.make === v.make && 
        item.model === v.model && 
        item.year === v.year && 
        Math.abs(item.price - v.price) < 1000
      );
      return duplicate === index;
    });
  
  console.log(`\n🧹 Cleaned ${vehicles.length} raw vehicles down to ${cleanedVehicles.length} valid vehicles`);
  
  // Summary of availability
  const availableCount = cleanedVehicles.filter(v => v.isAvailable).length;
  const soldCount = cleanedVehicles.filter(v => !v.isAvailable).length;
  console.log(`📊 Availability Summary: ${availableCount} available, ${soldCount} sold`);
  
  return cleanedVehicles;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function uploadVehicles(vehicles) {
  try {
    console.log('🚗 Starting to upload scraped vehicles to Firestore...');
    // Clear existing vehicles
    const existingVehicles = await db.collection('vehicles').get();
    const batch = db.batch();
    existingVehicles.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log('✅ Cleared existing vehicles');
    // Add new vehicles
    for (const vehicle of vehicles) {
      const vehicleData = {
        ...vehicle,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      await db.collection('vehicles').add(vehicleData);
      console.log(`✅ Added ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    }
    console.log(`\n🎉 Successfully uploaded ${vehicles.length} vehicles to Firestore!`);
  } catch (error) {
    console.error('❌ Error uploading vehicles:', error);
    process.exit(1);
  }
}

(async () => {
  try {
    const vehicles = await scrapeVehicles();
    console.log(`\n🔎 Scraped ${vehicles.length} vehicles.`);
    await uploadVehicles(vehicles);
    console.log('\n✨ Scraping and upload complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
})(); 