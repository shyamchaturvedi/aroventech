
export const demoPlans = {
    "digital-biz-card": {
        title: "Digital Business Card",
        type: "mobile-profile",
        theme: "modern",
        features: ["Click to Call", "Save Contact", "Social Links", "Profile Video"],
        mockData: {
            name: "Rahul Verma",
            role: "Marketing Director",
            company: "TechFlow Solutions",
            phone: "+91 98765 43210",
            email: "rahul@techflow.in",
            links: [
                { label: "WhatsApp Chat", url: "#", icon: "💬" },
                { label: "Visit Website", url: "#", icon: "🌐" },
                { label: "LinkedIn", url: "#", icon: "💼" },
                { label: "Instagram", url: "#", icon: "📸" }
            ]
        }
    },
    "student-resume": {
        title: "Professional Student Resume",
        type: "resume",
        theme: "clean",
        features: ["Download PDF", "Skill Bars", "Project Showcase", "Dark/Light Mode"],
        mockData: {
            name: "Aditya Singh",
            role: "Computer Science Graduate",
            summary: "Passionate developer with expertise in React and Node.js. Looking for entry-level opportunities.",
            skills: ["React.js", "Python", "SQL", "Public Speaking"],
            education: "B.Tech CSE - 2024",
            experience: "Intern at XYZ Corp (3 Months)"
        }
    },
    "event-invite": {
        title: "Wedding / Event Invitation",
        type: "event",
        theme: "celebration",
        features: ["Google Maps", "RSVP Form", "Countdown Timer", "Photo Gallery"],
        mockData: {
            event: "Rohit & Priya's Wedding",
            date: "2024-12-15",
            venue: "Grand Hotel, Lucknow",
            message: "We invite you to celebrate our special day with us."
        }
    },
    "frontend-js-website": {
        title: "Modern Corporate Website",
        type: "landing",
        theme: "corporate",
        features: ["Responsive Design", "Contact Form", "Animations", "Service Cards"],
        mockData: {
            heroTitle: "Innovate Your Future",
            heroSubtitle: "We build digital solutions for modern businesses.",
            services: ["Web Design", "App Development", "Cloud Solutions"]
        }
    },
    "cafe-menu": {
        title: "Digital QR Menu",
        type: "menu",
        theme: "food",
        features: ["Category Filtering", "Veg/Non-Veg Indicators", "Instant Search", "WhatsApp Order"],
        mockData: {
            restaurant: "The Urban Cafe",
            categories: [
                { name: "Coffee", items: [{ name: "Cappuccino", price: "₹150" }, { name: "Latte", price: "₹180" }] },
                { name: "Snacks", items: [{ name: "Grilled Sandwich", price: "₹220" }, { name: "Fries", price: "₹120" }] }
            ]
        }
    },
    "landing-page-pro": {
        title: "High Conversion Landing Page",
        type: "landing",
        theme: "marketing",
        features: ["Sticky CTA", "Testimonials", "FAQ Section", "Lead Capture"],
        mockData: {
            heroTitle: "Boost Your Sales 10x",
            heroSubtitle: "The ultimate tool to grow your business online.",
            pricing: "Starts @ $49/mo"
        }
    },
    "doctor-clinic": { // Mapped from "Doctor OR CA OR Lawyer"
        title: "Medical Specialist Portfolio",
        type: "profile",
        theme: "medical",
        features: ["Book Appointment", "Service List", "Clinic Walkthrough", "Patient Reviews"],
        mockData: {
            name: "Dr. Anjali Gupta",
            role: "Cardiologist (MBBS, MD)",
            clinic: "Heart Care Center, Gomti Nagar",
            availability: "Mon-Sat, 10 AM - 7 PM"
        }
    },
    "creative-portfolio": {
        title: "Artist / Photographer Portfolio",
        type: "gallery",
        theme: "dark-art",
        features: ["Masonry Grid", "Lightbox View", "Commission Form", "Social Feed"],
        mockData: {
            name: "Captured by Ravi",
            role: "Professional Photographer",
            gallery: ["Wedding", "Portrait", "Landscape", "Events"]
        }
    },
    "service-intro": {
        title: "Local Service Business",
        type: "landing",
        theme: "service",
        features: ["Service Pricing", "Team Photos", "Before/After Gallery", "Call Now Button"],
        mockData: {
            business: "FitZone Gym / QuickFix Repair",
            tagline: "Quality Service You Can Trust",
            offer: "First Visit 50% Off"
        }
    },
    "blogger-writer": {
        title: "Professional Blog / Magazine",
        type: "blog",
        theme: "editorial",
        features: ["Category Tags", "Author Bio", "Comments System", "Newsletter Signup"],
        mockData: {
            blogName: "Tech Insights",
            posts: [
                { title: "The Future of AI in 2025", date: "Oct 12, 2024" },
                { title: "Top 10 Web Frameworks", date: "Sep 28, 2024" },
                { title: "How to Start Coding", date: "Sep 15, 2024" }
            ]
        }
    },
    "news-portal": {
        title: "Breaking News Portal",
        type: "news",
        theme: "news",
        features: ["Breaking Ticker", "Ad Spaces", "Video Reports", "Reporter Dashboard"],
        mockData: {
            portalName: "Daily Lucknow News",
            headlines: ["New Metro Line Announced", "Weather Update: Heavy Rain Expected", "Tech Summit 2024 Highlights"]
        }
    },
    "ngo-charity": {
        title: "NGO & Charity Foundation",
        type: "impact",
        theme: "social",
        features: ["Donate Button", "Volunteer Form", "Impact Stories", "Transparency Reports"],
        mockData: {
            orgName: "Helping Hands Foundation",
            mission: "Empowering education for every child.",
            raised: "₹12,50,000",
            goal: "₹20,00,000"
        }
    },
    "school-cms": {
        title: "School Management System",
        type: "dashboard",
        theme: "education",
        features: ["Student Login", "Fee Status", "Online Classes", "Result Portal"],
        mockData: {
            schoolName: "City Public School",
            stats: { students: 1200, teachers: 45, classes: 24 }
        }
    },
    "real-estate": {
        title: "Real Estate & Property Listings",
        type: "listing",
        theme: "luxury",
        features: ["Search Filters", "Property Map", "Virtual Tour", "Agent Contact"],
        mockData: {
            agency: "Dream Homes Realty",
            listings: [
                { title: "3BHK Luxury Apartment", price: "₹85 Lakhs", area: "Gomti Nagar" },
                { title: "Commercial Office Space", price: "₹2.5 Cr", area: "Hazratganj" }
            ]
        }
    },
    "travel-agency": {
        title: "Travel & Tourism Agency",
        type: "listing",
        theme: "travel",
        features: ["Package Booking", "Destination Guides", "Car Rental", "Itinerary Builder"],
        mockData: {
            agency: "Wanderlust Travels",
            packages: [
                { dest: "Manali Escape", price: "₹12,999", days: "5 Days / 4 Nights" },
                { dest: "Goa Party Trip", price: "₹15,999", days: "4 Days / 3 Nights" }
            ]
        }
    },
    "shop-lite": {
        title: "WhatsApp Shop (Lite)",
        type: "store",
        theme: "lite",
        features: ["Send Order on WhatsApp", "Product Catalog", "No Payment Gateway", "Fast Loading"],
        mockData: {
            storeName: "Fashion Hub",
            products: [
                { name: "Men's T-Shirt", price: "₹499" },
                { name: "Sneakers", price: "₹1299" },
                { name: "Wrist Watch", price: "₹899" }
            ]
        }
    },
    "political-leader": {
        title: "Political Leader & Campaign",
        type: "profile",
        theme: "patriotic",
        features: ["Join Party Form", "Press Releases", "Rally Gallery", "Vision Manifest"],
        mockData: {
            leader: "Leaders Name",
            slogan: "Development for All",
            party: "Janata Vikas Party"
        }
    },
    "directory-classifieds": {
        title: "Local Directory / Classifieds",
        type: "listing",
        theme: "directory",
        features: ["Post Ad", "Category Search", "Verified Listings", "Map View"],
        mockData: {
            region: "Lucknow City",
            categories: ["Jobs", "Real Estate", "Services", "Second Hand Cars"]
        }
    },
    "full-ecommerce": {
        title: "Complete E-Commerce Store",
        type: "store",
        theme: "modern-shop",
        features: ["Cart & Checkout", "User Accounts", "Coupons", "Order Tracking"],
        mockData: {
            storeName: "MegaMart Online",
            categories: ["Electronics", "Fashion", "Home & Kitchen"]
        }
    },
    "lms-course": {
        title: "Online Course Platform (LMS)",
        type: "dashboard",
        theme: "learning",
        features: ["Video Player", "Quiz Module", "Certificate Gen", "Instructor Dashboard"],
        mockData: {
            platform: "SkillUp Academy",
            courses: ["Python Mastery", "Digital Marketing 101", "Graphic Design Pro"]
        }
    },
    "offline-software": {
        title: "Desktop Software Solution",
        type: "software",
        theme: "desktop",
        features: ["Offline Database", "Barcode Scanning", "Bill Printing", "Inventory Sync"],
        mockData: {
            software: "AroBill POS / Hotel Manager",
            os: "Windows 10/11",
            version: "v2.4.0"
        }
    },
    "android-app": {
        title: "Native Mobile App",
        type: "mobile-app",
        theme: "app-showcase",
        features: ["Push Notifications", "Smooth UI", "Offline Mode", "Play Store Ready"],
        mockData: {
            appName: "Grocer Delivery / News App",
            downloads: "10k+",
            rating: "4.8"
        }
    },
    "marketing-seo": {
        title: "SEO & Marketing Dashboard",
        type: "dashboard",
        theme: "analytics",
        features: ["Keyword Ranking", "Traffic Stats", "Backlink Monitor", "Competitor Analysis"],
        mockData: {
            client: "Your Business",
            growth: "+145% Traffic",
            keywords: 25
        }
    }
};
