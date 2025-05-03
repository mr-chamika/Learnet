const Tag = require("../models/TagModel");

// Users shoud not be allowed to edit a tag even if they own it
// bcs they might already be used in contents

// const tags = [
//     // 1–50: Academic – Humanities, Social Sciences, Natural Sciences, Engineering, Health
//     "Mathematics","Algebra","Geometry","Calculus","Statistics","Discrete Mathematics","Number Theory","Topology","Mathematical Logic","Applied Math",
//     "Philosophy","Ethics","Metaphysics","Epistemology","Logic","Aesthetics","Religion","Theology","Divinity","Religious Studies",
//     "History","Ancient History","Medieval History","Modern History","World History","Art History","Military History","Social History","Oral History","Historiography",
//     "Sociology","Anthropology","Cultural Anthropology","Linguistic Anthropology","Archaeology","Psychology","Clinical Psychology","Cognitive Psychology","Developmental Psychology","Social Psychology",
//     "Economics","Microeconomics","Macroeconomics","Econometrics","Development Economics","International Economics","Political Economy","Behavioral Economics","Environmental Economics","Financial Economics",
//     "Physics","Classical Mechanics","Electromagnetism","Thermodynamics","Quantum Mechanics","Statistical Mechanics","Optics","Nuclear Physics","Condensed Matter","Particle Physics",
    
//     // 51–100: Engineering & Technology
//     "Mechanical Engineering","Civil Engineering","Electrical Engineering","Chemical Engineering","Aerospace Engineering","Biomedical Engineering","Materials Science","Environmental Engineering","Industrial Engineering","Systems Engineering",
//     "Computer Science","Algorithms","Data Structures","Databases","SQL","NoSQL","Operating Systems","Networking","Cybersecurity","Computer Architecture",
//     "Software Engineering","Agile","DevOps","Cloud Computing","Microservices","API Design","Containerization","Docker","Kubernetes","Mobile Development",
//     "Web Development","Frontend","Backend","Full Stack","HTML","CSS","JavaScript","TypeScript","React","Angular",
    
//     // 101–150: Programming Languages & Paradigms
//     "C","C++","C#","Java","JavaScript","TypeScript","Python","Ruby","PHP","Go",
//     "Rust","Kotlin","Swift","Dart","Scala","Perl","Lua","Haskell","Erlang","Elixir",
//     "MATLAB","R","SQL","NoSQL Query","Prolog","Lisp","Scheme","F#","Objective-C","Assembly",
//     "Functional Programming","Object‑Oriented","Procedural","Event‑Driven","Reactive","Logic Programming","Concurrent Programming","Parallel Programming","Scripting","DSL",
    
//     // 151–200: Hobbies & Leisure
//     "Gardening","Birdwatching","Hiking","Camping","Fishing","Photography","Painting","Drawing","Knitting","Sewing",
//     "Woodworking","Pottery","Ceramics","Model Building","Scale Modeling","3D Printing","Robotics","Drone Flying","Home Brewing","Winemaking",
//     "Cooking","Baking","Candle Making","Soap Making","DIY Electronics","Electronics Repair","Home Improvement","Car Restoration","Collecting Coins","Stamp Collecting",
//     "Record Collecting","Antique Collecting","Comic Collecting","LEGO Building","Puzzle Solving","Board Games","Card Games","Video Games","Chess","Sudoku",
    
//     // 201–250: Sports & Recreation
//     "Football","Soccer","Basketball","Baseball","Cricket","Rugby","Tennis","Badminton","Volleyball","Table Tennis",
//     "Golf","Swimming","Running","Marathon","Triathlon","Cycling","Mountain Biking","Road Cycling","Skating","Roller Derby",
//     "Skiing","Snowboarding","Surfing","Skateboarding","Motorsports","Formula One","Karting","NASCAR","Boxing","Wrestling",
    
//     // 251–300: Arts & Culture
//     "Music","Music Theory","Musicology","Jazz","Classical Music","Composition","Conducting","Dance","Ballet","Hip‑Hop Dance",
//     "Theater","Acting","Directing","Playwriting","Film","Cinematography","Screenwriting","Photography","Graphic Design","Animation",
//     "Digital Art","Mixed Media","Sculpture","Installation Art","Architecture","Interior Design","Fashion Design","Textile Arts","Calligraphy","Culinary Arts",
    
//     // 301–350: Business & Finance
//     "Business Administration","Management","Marketing","Sales","Accounting","Auditing","Finance","Investment Banking","Corporate Finance","Financial Planning",
//     "Entrepreneurship","Human Resources","Organizational Behavior","Operations Management","Supply Chain","Logistics","Project Management","Risk Management","Insurance","Real Estate",
//     "Economics (Business)","International Business","E‑Commerce","Retail Management","Business Ethics","Business Law","Negotiation","Public Relations","Advertising","Market Research",
    
//     // 351–400: Health & Wellness
//     "Medicine","Anatomy","Physiology","Pathology","Pharmacology","Immunology","Microbiology","Public Health","Epidemiology","Nutrition",
//     "Nursing","Dentistry","Physical Therapy","Occupational Therapy","Sports Medicine","Psychiatry","Clinical Psychology","Counseling","Mindfulness","Yoga",
//     "Meditation","Fitness","Personal Training","Wellness Coaching","Mental Health","Dermatology","Cardiology","Oncology","Neurology","Pediatrics",
    
//     // 401–450: Education & Pedagogy
//     "Education","Curriculum Development","Instructional Design","Pedagogy","Educational Technology","Distance Learning","E‑Learning","STEM Education","Literacy","Bilingual Education",
//     "Special Education","Adult Education","Child Development","Early Childhood Education","Higher Education","Educational Psychology","Assessment","Testing","Teacher Training","Classroom Management",
    
//     // 451–500: Lifestyle & Miscellaneous
//     "Travel","Tourism","Backpacking","Cultural Tourism","Ecotourism","Language Learning","Self‑Improvement","Productivity","Minimalism","Personal Finance",
//     "Budgeting","Investing","Cryptocurrency","Blockchain","Artificial Intelligence","Machine Learning","Data Science","Big Data","Automation","Smart Home",
//     "Astrology","Horology","Collectibles","Magic","Mind Games","Esoterica","Spirituality","Astrophotography","Meteorology","Zymology"
//   ];
  
async function getAllTags(req, res){
    const validUserTags = await Tag.find({$and : [{isApproved: true}, {type: "userdefined"}]})
    const predefinedTags = await Tag.find({type : "predefined"})
    res.json({userdefinedTags: validUserTags, predefinedTags})
}

let isDone = false
async function createTag(req, res){
    // if(!isDone){
    //     isDone = true
    //     const userId = req.user.userId
    //     for(let i = 0; i < tags.length; i++){
    //         const tag = new Tag({
    //             userId,
    //             name: tags[i],
    //             type: "predefined"
    //         })
    //         await tag.save()
    //     }
    // }
    const userId = req.user.userId
    const {name, description} = req.body
    const tag = await Tag.createTag(userId, name, description)
    res.json(tag)
}

module.exports = {
    getAllTags,
    createTag
}