// IELTS Speaking — Comprehensive topic bank
// Covers Part 1 (intro/interview), Part 2 (long turn cue card), Part 3 (discussion)
// Plus key vocabulary with definitions + example sentences

export interface VocabItem {
  word: string;
  pos: string; // part of speech
  definition: string;
  example: string;
}

export interface CueCard {
  prompt: string;
  bulletPoints: string[];
  followUp: string[];
}

export interface Topic {
  id: string;
  name: string;
  emoji: string;
  category: string;
  color: string; // tailwind gradient classes
  description: string;
  part1: string[];
  cueCard: CueCard;
  part3: string[];
  vocabulary: VocabItem[];
  sampleAnswer: string;
}

export const TOPICS: Topic[] = [
  {
    id: "hometown",
    name: "Hometown",
    emoji: "🏠",
    category: "Personal",
    color: "from-emerald-400 to-teal-500",
    description: "Talk about where you grew up, its character, and what makes it special.",
    part1: [
      "Where is your hometown?",
      "What is your hometown known for?",
      "Do you like your hometown? Why?",
      "Is there anything you dislike about your hometown?",
      "Would you say your hometown is a good place to live?",
      "Has your hometown changed much since you were a child?",
    ],
    cueCard: {
      prompt: "Describe a place in your hometown that is special to you.",
      bulletPoints: [
        "Where it is",
        "How often you go there",
        "What you do there",
        "And explain why it is special to you",
      ],
      followUp: [
        "How do people in your hometown feel about tourists?",
        "Do you think cities are becoming too similar around the world?",
      ],
    },
    part3: [
      "Why do many young people move away from their hometowns?",
      "What are the advantages of living in a small town versus a big city?",
      "How has technology changed the way people interact in their communities?",
      "Should governments invest more in rural development? Why?",
    ],
    vocabulary: [
      { word: "picturesque", pos: "adj", definition: "visually attractive, especially in a quaint or pretty style", example: "The old quarter of my hometown is incredibly picturesque." },
      { word: "bustling", pos: "adj", definition: "full of energetic and noisy activity", example: "The market is always bustling on weekend mornings." },
      { word: "tight-knit", pos: "adj", definition: "closely connected, especially in a community", example: "We grew up in a tight-knit neighbourhood where everyone knew each other." },
      { word: "undergo", pos: "verb", definition: "to experience or be subjected to something", example: "The city has undergone massive transformation in the last decade." },
      { word: "heritage", pos: "noun", definition: "cultural traditions that have been passed down", example: "Preserving our heritage is essential for future generations." },
    ],
    sampleAnswer:
      "My hometown is a coastal city in the south, known for its picturesque harbour and bustling seafood market. I love the laid-back pace of life there, although the traffic has gotten worse in recent years. What makes it truly special to me is the tight-knit community — neighbours still greet each other by name, and festivals bring everyone together.",
  },
  {
    id: "work-study",
    name: "Work & Study",
    emoji: "📚",
    category: "Personal",
    color: "from-amber-400 to-orange-500",
    description: "Discuss your job, studies, ambitions, and the balance between them.",
    part1: [
      "Do you work or are you a student?",
      "What is your favourite subject / part of your job?",
      "Why did you choose this field?",
      "Is there anything you dislike about your work or studies?",
      "What do you hope to do in the future?",
      "How do you usually spend your weekends?",
    ],
    cueCard: {
      prompt: "Describe a goal you would like to achieve in the future.",
      bulletPoints: [
        "What the goal is",
        "When you want to achieve it",
        "How you plan to achieve it",
        "And explain why this goal is important to you",
      ],
      followUp: [
        "Do you think it is better to have one clear goal or many?",
        "What role does luck play in achieving success?",
      ],
    },
    part3: [
      "How has the concept of a career changed in your country?",
      "Is it more important to enjoy your job or to earn a high salary?",
      "Should universities focus more on practical skills or theoretical knowledge?",
      "How might artificial intelligence affect future careers?",
    ],
    vocabulary: [
      { word: "lucrative", pos: "adj", definition: "producing a great deal of profit", example: "Software engineering can be a highly lucrative career." },
      { word: "fulfilling", pos: "adj", definition: "making someone satisfied through meaningful work", example: "Teaching is a fulfilling profession despite the modest pay." },
      { word: "prospect", pos: "noun", definition: "the possibility of future success", example: "Job prospects in renewable energy are improving rapidly." },
      { word: "tenacious", pos: "adj", definition: "persistent and determined", example: "She was tenacious in pursuing her PhD despite setbacks." },
      { word: "trajectory", pos: "noun", definition: "the path a career or development follows", example: "His career trajectory took him from intern to CEO." },
    ],
    sampleAnswer:
      "I currently study computer science, and my favourite part is algorithms — there is something elegant about solving a complex problem efficiently. I chose this field because of the limitless prospects and the chance to build tools that help people. In the future, I hope to launch my own startup focused on education technology.",
  },
  {
    id: "hobbies",
    name: "Hobbies & Free Time",
    emoji: "🎨",
    category: "Lifestyle",
    color: "from-rose-400 to-pink-500",
    description: "Share what you love doing in your spare time and why it matters.",
    part1: [
      "What do you usually do in your free time?",
      "Do you prefer spending your free time alone or with others?",
      "Did you have any hobbies as a child that you no longer do?",
      "Are there any new hobbies you would like to try?",
      "How much free time do you usually have?",
    ],
    cueCard: {
      prompt: "Describe a hobby you enjoy.",
      bulletPoints: [
        "What the hobby is",
        "When you started it",
        "How often you do it",
        "And explain why you enjoy it",
      ],
      followUp: [
        "Do you think hobbies should be productive?",
        "Are hobbies from childhood different from adult hobbies?",
      ],
    },
    part3: [
      "Do you think people today have less free time than in the past?",
      "How can hobbies benefit mental health?",
      "Should schools dedicate more time to hobbies and creativity?",
      "Why do some people turn hobbies into careers?",
    ],
    vocabulary: [
      { word: "pastime", pos: "noun", definition: "an activity someone does regularly for enjoyment", example: "Reading has been my favourite pastime since childhood." },
      { word: "therapeutic", pos: "adj", definition: "having a healing or calming effect", example: "Painting is incredibly therapeutic after a stressful day." },
      { word: "immerse", pos: "verb", definition: "to involve oneself deeply in an activity", example: "I love to immerse myself in a good novel on rainy weekends." },
      { word: "tedious", pos: "adj", definition: "boring and repetitive", example: "I gave up knitting because it became tedious." },
      { word: "cathartic", pos: "adj", definition: "providing psychological relief through expression", example: "Writing in a journal can be cathartic." },
    ],
    sampleAnswer:
      "My favourite hobby is watercolour painting. I started about three years ago as a way to unwind, and now I try to paint at least twice a week. I find it therapeutic — when I'm painting, hours slip by without me noticing. It has taught me patience and to appreciate small details in everyday life.",
  },
  {
    id: "food",
    name: "Food & Cooking",
    emoji: "🍜",
    category: "Lifestyle",
    color: "from-orange-400 to-red-500",
    description: "Talk about cuisines, cooking traditions, and your relationship with food.",
    part1: [
      "What is your favourite food?",
      "Do you like cooking? Why or why not?",
      "How often do you eat out?",
      "Is there any food you dislike?",
      "Do you prefer eating at home or in restaurants?",
    ],
    cueCard: {
      prompt: "Describe a meal you enjoyed that you remember well.",
      bulletPoints: [
        "What the meal was",
        "Where you had it",
        "Who you were with",
        "And explain why you enjoyed it so much",
      ],
      followUp: [
        "Has the food in your country changed much in recent years?",
        "Why do some people prefer fast food?",
      ],
    },
    part3: [
      "How does food reflect a country's culture?",
      "Should children be taught cooking at school?",
      "What are the health implications of the modern diet?",
      "Is it important to preserve traditional recipes?",
    ],
    vocabulary: [
      { word: "mouth-watering", pos: "adj", definition: "extremely appetising in appearance or smell", example: "The bakery displayed a mouth-watering selection of pastries." },
      { word: "savory", pos: "adj", definition: "salty or spicy rather than sweet", example: "I prefer savory dishes to desserts." },
      { word: "culinary", pos: "adj", definition: "relating to cooking or kitchens", example: "France is famous for its culinary traditions." },
      { word: "wholesome", pos: "adj", definition: "good for health and wellbeing", example: "My grandmother always cooked wholesome meals from scratch." },
      { word: "exotic", pos: "adj", definition: "originating from a distant foreign country", example: "I love trying exotic fruits when I travel." },
    ],
    sampleAnswer:
      "The most memorable meal I ever had was a seafood paella in a small coastal village in Spain. I was travelling with my best friend, and we ate at a family-run restaurant overlooking the harbour. The rice was perfectly savoury, the prawns were fresh, and the atmosphere — golden sunset, gentle waves — made it unforgettable.",
  },
  {
    id: "travel",
    name: "Travel & Holidays",
    emoji: "✈️",
    category: "Lifestyle",
    color: "from-sky-400 to-cyan-500",
    description: "Explore destinations, journeys, and the value of seeing the world.",
    part1: [
      "Do you like travelling? Why?",
      "What is the most interesting place you have visited?",
      "Where would you like to travel in the future?",
      "Do you prefer travelling alone or with others?",
      "Have you ever travelled abroad?",
    ],
    cueCard: {
      prompt: "Describe a trip you took that you remember well.",
      bulletPoints: [
        "Where you went",
        "How you travelled",
        "What you did there",
        "And explain why the trip was memorable",
      ],
      followUp: [
        "What are the benefits of travelling alone?",
        "Has technology changed the way people travel?",
      ],
    },
    part3: [
      "How does tourism affect local communities?",
      "Should countries limit the number of tourists they receive?",
      "Is space tourism likely to become popular in the future?",
      "How can travel promote understanding between cultures?",
    ],
    vocabulary: [
      { word: "itinerary", pos: "noun", definition: "a planned route or schedule for a journey", example: "We followed a packed itinerary across three cities." },
      { word: "picturesque", pos: "adj", definition: "charming or quaint in appearance", example: "We stayed in a picturesque village in the Alps." },
      { word: "off the beaten track", pos: "phrase", definition: "in a place not usually visited by tourists", example: "We found a hidden beach off the beaten track." },
      { word: "soak up", pos: "phrasal verb", definition: "to absorb or enjoy an atmosphere", example: "We spent the afternoon soaking up the local culture." },
      { word: "wanderlust", pos: "noun", definition: "a strong desire to travel", example: "Her wanderlust took her to over forty countries." },
    ],
    sampleAnswer:
      "The most memorable trip I ever took was to Kyoto during cherry blossom season. I travelled by bullet train from Tokyo, and the journey itself was thrilling. We spent five days wandering through ancient temples, soaking up the serene atmosphere, and eating incredible food. It was magical — pink petals drifting like snow over centuries-old wooden shrines.",
  },
  {
    id: "technology",
    name: "Technology",
    emoji: "💻",
    category: "Modern Life",
    color: "from-slate-500 to-gray-700",
    description: "Reflect on gadgets, the internet, AI, and how tech reshapes daily life.",
    part1: [
      "Do you use technology a lot?",
      "What device do you use the most?",
      "Is there any technology you dislike?",
      "How has technology changed your life?",
      "Do you think children should use technology from a young age?",
    ],
    cueCard: {
      prompt: "Describe a piece of technology you could not live without.",
      bulletPoints: [
        "What it is",
        "How long you have had it",
        "What you use it for",
        "And explain why you could not live without it",
      ],
      followUp: [
        "Are people becoming too dependent on technology?",
        "What technology might become common in the next decade?",
      ],
    },
    part3: [
      "How has social media affected relationships?",
      "Should governments regulate artificial intelligence?",
      "Is the digital divide a serious problem?",
      "Will technology eventually replace teachers and doctors?",
    ],
    vocabulary: [
      { word: "indispensable", pos: "adj", definition: "absolutely necessary", example: "My smartphone has become indispensable." },
      { word: "obsolete", pos: "adj", definition: "no longer produced or used; out of date", example: "Physical maps are largely obsolete now." },
      { word: "cutting-edge", pos: "adj", definition: "at the forefront of innovation", example: "The lab uses cutting-edge AI tools." },
      { word: "ubiquitous", pos: "adj", definition: "present everywhere", example: "Smartphones are now ubiquitous in daily life." },
      { word: "detrimental", pos: "adj", definition: "causing harm or damage", example: "Excessive screen time can be detrimental to sleep." },
    ],
    sampleAnswer:
      "The piece of technology I cannot live without is my laptop. I have used one for almost fifteen years, and I rely on it for work, communication, and creative projects. It has become indispensable — it stores my entire professional life and connects me to people across the world. Without it, my career as I know it would simply not exist.",
  },
  {
    id: "environment",
    name: "Environment",
    emoji: "🌱",
    category: "World Issues",
    color: "from-green-500 to-emerald-600",
    description: "Discuss climate, sustainability, and our responsibility to the planet.",
    part1: [
      "Are there any environmental problems in your country?",
      "Do you try to protect the environment? How?",
      "Do you recycle?",
      "Is clean air important to you?",
      "What kind of pollution bothers you most?",
    ],
    cueCard: {
      prompt: "Describe an environmental problem that concerns you.",
      bulletPoints: [
        "What the problem is",
        "What causes it",
        "What effects it has",
        "And explain what can be done to solve it",
      ],
      followUp: [
        "Who is more responsible for the environment: governments or individuals?",
        "Are young people more environmentally aware than older generations?",
      ],
    },
    part3: [
      "Should economic growth be sacrificed for environmental protection?",
      "How effective are international climate agreements?",
      "What role can renewable energy play in the future?",
      "Is overpopulation the root cause of environmental problems?",
    ],
    vocabulary: [
      { word: "ecosystem", pos: "noun", definition: "a community of living organisms and their environment", example: "Pollution threatens the entire marine ecosystem." },
      { word: "sustainable", pos: "adj", definition: "able to be maintained without depleting resources", example: "We need sustainable farming practices." },
      { word: "devastating", pos: "adj", definition: "highly destructive or damaging", example: "Deforestation has devastating consequences." },
      { word: "mitigate", pos: "verb", definition: "to make less severe", example: "Planting trees can mitigate carbon emissions." },
      { word: "biodegradable", pos: "adj", definition: "capable of being decomposed naturally", example: "Choose biodegradable packaging when possible." },
    ],
    sampleAnswer:
      "The environmental problem that concerns me most is plastic pollution in the oceans. It is caused by single-use plastics and poor waste management. The effects are devastating — marine animals die from ingesting plastic, and microplastics enter the food chain. To solve it, governments must ban single-use plastics, companies must redesign packaging, and individuals must adopt reusable alternatives.",
  },
  {
    id: "music",
    name: "Music",
    emoji: "🎵",
    category: "Arts & Culture",
    color: "from-purple-400 to-fuchsia-500",
    description: "Talk about genres, instruments, concerts, and music's emotional power.",
    part1: [
      "What kind of music do you like?",
      "Do you play any musical instruments?",
      "How often do you listen to music?",
      "Has your taste in music changed over the years?",
      "Do you prefer live music or recorded music?",
    ],
    cueCard: {
      prompt: "Describe a song or piece of music that is meaningful to you.",
      bulletPoints: [
        "What the song is",
        "When you first heard it",
        "How it makes you feel",
        "And explain why it is meaningful to you",
      ],
      followUp: [
        "Why do some songs become timeless?",
        "Has streaming changed the music industry for better or worse?",
      ],
    },
    part3: [
      "How does music reflect a culture?",
      "Should music be a compulsory subject in schools?",
      "Can music really heal emotional wounds?",
      "Has technology improved or harmed musical creativity?",
    ],
    vocabulary: [
      { word: "melodic", pos: "adj", definition: "having a pleasant tune", example: "The song has a beautifully melodic chorus." },
      { word: "uplifting", pos: "adj", definition: "making someone feel cheerful", example: "Her music is genuinely uplifting." },
      { word: "resonate", pos: "verb", definition: "to evoke a feeling of shared emotion", example: "The lyrics really resonated with me." },
      { word: "versatile", pos: "adj", definition: "able to adapt to many different functions", example: "The piano is a remarkably versatile instrument." },
      { word: "nostalgic", pos: "adj", definition: "feeling longing for the past", example: "That track makes me nostalgic for my teenage years." },
    ],
    sampleAnswer:
      "A song that is deeply meaningful to me is 'Imagine' by John Lennon. I first heard it as a child in my father's car. The melodic simplicity and the message of unity really resonated with me even then. Today, whenever I hear it, I feel a bittersweet mix of hope and nostalgia. It reminds me that music can carry ideals across generations.",
  },
  {
    id: "books",
    name: "Books & Reading",
    emoji: "📖",
    category: "Arts & Culture",
    color: "from-amber-500 to-yellow-600",
    description: "Discuss novels, genres, authors, and the joy of reading.",
    part1: [
      "Do you like reading books?",
      "What kind of books do you read?",
      "Do you prefer printed books or e-books?",
      "How often do you read?",
      "What was the last book you read?",
    ],
    cueCard: {
      prompt: "Describe a book you read that you found particularly enjoyable.",
      bulletPoints: [
        "What the book was about",
        "When you read it",
        "Why you chose it",
        "And explain why you enjoyed it",
      ],
      followUp: [
        "Do you think reading habits are changing?",
        "Will printed books disappear in the future?",
      ],
    },
    part3: [
      "Why is literature important in education?",
      "Do books have an advantage over films in storytelling?",
      "Should controversial books be censored?",
      "How can schools encourage children to read more?",
    ],
    vocabulary: [
      { word: "gripping", pos: "adj", definition: "holding the attention intensely", example: "The novel had a gripping opening chapter." },
      { word: "thought-provoking", pos: "adj", definition: "stimulating careful consideration", example: "It is a thought-provoking read." },
      { word: "page-turner", pos: "noun", definition: "a book so exciting it is hard to put down", example: "The thriller was an absolute page-turner." },
      { word: "immersive", pos: "adj", definition: "deeply engaging the reader's attention", example: "The world-building was totally immersive." },
      { word: "poignant", pos: "adj", definition: "evoking a keen sense of sadness or regret", example: "The ending was poignant and unforgettable." },
    ],
    sampleAnswer:
      "One book I genuinely loved is 'The Alchemist' by Paulo Coelho. I read it during a difficult period in my life. The story follows a shepherd boy chasing his dream, and the message — that the universe conspires to help those who pursue their destiny — was deeply thought-provoking. It changed how I think about risk and ambition.",
  },
  {
    id: "health",
    name: "Health & Fitness",
    emoji: "💪",
    category: "Lifestyle",
    color: "from-lime-400 to-green-500",
    description: "Discuss exercise, wellbeing, mental health, and healthy habits.",
    part1: [
      "Do you try to keep fit?",
      "How often do you exercise?",
      "What do you do to stay healthy?",
      "Do you eat a healthy diet?",
      "Is there anything you would like to change about your lifestyle?",
    ],
    cueCard: {
      prompt: "Describe a habit you have that is good for your health.",
      bulletPoints: [
        "What the habit is",
        "When you started it",
        "How you maintain it",
        "And explain why it is good for your health",
      ],
      followUp: [
        "Should governments do more to promote healthy living?",
        "Are modern lifestyles less healthy than in the past?",
      ],
    },
    part3: [
      "How can society address the rise in mental health issues?",
      "Is diet or exercise more important for wellbeing?",
      "Should junk food be taxed more heavily?",
      "How has the pandemic changed attitudes toward health?",
    ],
    vocabulary: [
      { word: "regimen", pos: "noun", definition: "a prescribed course of treatment or self-care", example: "I follow a strict exercise regimen." },
      { word: "vitality", pos: "noun", definition: "physical and mental energy", example: "Yoga has restored my vitality." },
      { word: "sedentary", pos: "adj", definition: "involving little physical activity", example: "Office jobs are notoriously sedentary." },
      { word: "rejuvenate", pos: "verb", definition: "to make someone feel refreshed and younger", example: "A weekend in nature rejuvenates me." },
      { word: "detrimental", pos: "adj", definition: "causing harm", example: "Chronic stress is detrimental to health." },
    ],
    sampleAnswer:
      "A habit that has transformed my health is morning jogging. I started about three years ago after a particularly stressful period. At first it was a struggle, but I committed to 20 minutes every day, and within weeks I noticed improved vitality and clearer thinking. Now it is non-negotiable — it sets the tone for my entire day.",
  },
  {
    id: "family",
    name: "Family & Friends",
    emoji: "👨‍👩‍👧",
    category: "Personal",
    color: "from-pink-400 to-rose-500",
    description: "Talk about relationships, family traditions, and the people who shape us.",
    part1: [
      "How large is your family?",
      "Do you spend a lot of time with your family?",
      "Are you close to your relatives?",
      "Who are you most similar to in your family?",
      "Do you have many close friends?",
    ],
    cueCard: {
      prompt: "Describe a person who has had an important influence on your life.",
      bulletPoints: [
        "Who the person is",
        "How long you have known them",
        "What they are like",
        "And explain why they have influenced you",
      ],
      followUp: [
        "Are parents always the biggest influence on a child?",
        "How have family structures changed in your country?",
      ],
    },
    part3: [
      "Is the role of the extended family declining?",
      "Should elderly people live with their children or in care homes?",
      "How do friendships formed online compare to offline ones?",
      "What makes a friendship last a lifetime?",
    ],
    vocabulary: [
      { word: "upbringing", pos: "noun", definition: "the way a child is raised", example: "I had a strict but loving upbringing." },
      { word: "bond", pos: "noun", definition: "a strong connection between people", example: "We share a bond that has only strengthened over the years." },
      { word: "mentor", pos: "noun", definition: "an experienced and trusted advisor", example: "My uncle was my first mentor." },
      { word: "supportive", pos: "adj", definition: "providing encouragement and help", example: "My parents have always been supportive." },
      { word: "kinship", pos: "noun", definition: "a sharing of characteristics or origins", example: "There is a strong sense of kinship in our village." },
    ],
    sampleAnswer:
      "The person who has most influenced me is my grandmother. She raised three children alone after my grandfather died, and she taught me resilience by example. She had only a primary education but read constantly and encouraged me to value learning above all. Her quiet strength during hard times shaped how I face challenges today.",
  },
  {
    id: "weather",
    name: "Weather & Seasons",
    emoji: "🌦️",
    category: "Daily Life",
    color: "from-cyan-400 to-blue-500",
    description: "Discuss climate, favourite seasons, and how weather shapes our mood.",
    part1: [
      "What is your favourite kind of weather?",
      "Does the weather affect your mood?",
      "Do you prefer hot or cold weather?",
      "What do you do on rainy days?",
      "Has the weather in your country changed in recent years?",
    ],
    cueCard: {
      prompt: "Describe a time when the weather ruined your plans.",
      bulletPoints: [
        "When it happened",
        "What the weather was like",
        "What plans were affected",
        "And explain how you felt about it",
      ],
      followUp: [
        "Should countries invest more in weather forecasting?",
        "Is extreme weather becoming more common?",
      ],
    },
    part3: [
      "How does climate shape a country's culture?",
      "Should people adapt to climate change or try to reverse it?",
      "Are extreme weather events a sign of a bigger crisis?",
      "How might climate change affect future generations?",
    ],
    vocabulary: [
      { word: "unpredictable", pos: "adj", definition: "not able to be foreseen", example: "Spring weather here is famously unpredictable." },
      { word: "dreary", pos: "adj", definition: "dull and depressing", example: "A week of dreary grey skies affects my mood." },
      { word: "scorching", pos: "adj", definition: "extremely hot", example: "August afternoons are scorching." },
      { word: "crisp", pos: "adj", definition: "pleasantly dry and cold", example: "I love crisp autumn mornings." },
      { word: "downpour", pos: "noun", definition: "a heavy fall of rain", example: "We got caught in a sudden downpour." },
    ],
    sampleAnswer:
      "I will never forget a camping trip we had to abandon because of an unexpected downpour. We had driven three hours to a national park, set up our tent, and within minutes the sky turned black. The tent flooded, our food was ruined, and we had to drive back soaked. At the time I was miserable, but now it is one of our funniest family stories.",
  },
  {
    id: "education",
    name: "Education",
    emoji: "🎓",
    category: "Society",
    color: "from-indigo-400 to-violet-500",
    description: "Reflect on schools, learning, exams, and the purpose of education.",
    part1: [
      "Did you enjoy school?",
      "What was your favourite subject?",
      "Did you have a favourite teacher?",
      "Would you like to study more in the future?",
      "How important is education in your country?",
    ],
    cueCard: {
      prompt: "Describe a teacher who had a big influence on you.",
      bulletPoints: [
        "Who the teacher was",
        "What subject they taught",
        "What they were like",
        "And explain why they influenced you",
      ],
      followUp: [
        "Should teachers be paid more?",
        "Are exams the best way to assess students?",
      ],
    },
    part3: [
      "Should university education be free?",
      "Is online learning as effective as classroom learning?",
      "How can schools prepare students for the future of work?",
      "Should schools teach life skills like cooking and finance?",
    ],
    vocabulary: [
      { word: "pedagogy", pos: "noun", definition: "the method and practice of teaching", example: "Modern pedagogy emphasises critical thinking." },
      { word: "dedicated", pos: "adj", definition: "committed and devoted", example: "She was a dedicated teacher who stayed after class to help." },
      { word: "curriculum", pos: "noun", definition: "the subjects comprising a course of study", example: "The national curriculum has been updated." },
      { word: "instil", pos: "verb", definition: "to gradually but firmly establish", example: "He instilled in us a love of literature." },
      { word: "formative", pos: "adj", definition: "relating to a person's development", example: "Those were my most formative years." },
    ],
    sampleAnswer:
      "The teacher who influenced me most was my high school literature teacher, Mr Ade. He was demanding but endlessly encouraging. He did not just teach us to analyse texts — he taught us to think, to question, to defend our opinions with evidence. He instilled in me a love of reading that has shaped my entire intellectual life.",
  },
  {
    id: "sports",
    name: "Sports",
    emoji: "⚽",
    category: "Lifestyle",
    color: "from-red-400 to-rose-600",
    description: "Talk about playing, watching, and the values sport teaches us.",
    part1: [
      "Do you like sports?",
      "What sports do you enjoy playing?",
      "Do you watch sports on TV?",
      "Did you play any sports as a child?",
      "Are sports popular in your country?",
    ],
    cueCard: {
      prompt: "Describe a sporting event you attended or watched.",
      bulletPoints: [
        "What the event was",
        "Where it took place",
        "Who you watched it with",
        "And explain how you felt about it",
      ],
      followUp: [
        "Should children play competitive sports?",
        "Are professional athletes paid too much?",
      ],
    },
    part3: [
      "Should hosting mega-events like the Olympics be encouraged?",
      "Has commercialisation harmed the spirit of sport?",
      "How can schools encourage more girls to play sports?",
      "Is esports a real sport?",
    ],
    vocabulary: [
      { word: "thrilling", pos: "adj", definition: "causing excitement and pleasure", example: "The final was absolutely thrilling." },
      { word: "camaraderie", pos: "noun", definition: "mutual trust and friendship among team members", example: "There is incredible camaraderie in our team." },
      { word: "spectator", pos: "noun", definition: "a person who watches a show or event", example: "The stadium held 50,000 spectators." },
      { word: "rigorous", pos: "adj", definition: "extremely thorough and exhaustive", example: "Athletes follow rigorous training schedules." },
      { word: "perseverance", pos: "noun", definition: "persistence in doing something despite difficulty", example: "Sport teaches perseverance better than any classroom." },
    ],
    sampleAnswer:
      "The most thrilling sporting event I ever attended was a national football final at our capital's main stadium. I went with three close friends, and the atmosphere was electric — 60,000 spectators singing, drums pounding. Our team scored in the final minute, and the stadium erupted. I have never felt such raw collective joy before or since.",
  },
  {
    id: "art",
    name: "Art & Creativity",
    emoji: "🖼️",
    category: "Arts & Culture",
    color: "from-fuchsia-400 to-pink-600",
    description: "Discuss paintings, galleries, creativity, and the role of art in society.",
    part1: [
      "Do you like art?",
      "Have you ever been to an art gallery?",
      "Did you enjoy art classes at school?",
      "Can you draw or paint?",
      "Do you think art is important?",
    ],
    cueCard: {
      prompt: "Describe a piece of art (painting, sculpture, etc.) that you like.",
      bulletPoints: [
        "What it is",
        "Where you saw it",
        "What it looks like",
        "And explain why you like it",
      ],
      followUp: [
        "Should art be funded by the government?",
        "Is digital art as valuable as traditional art?",
      ],
    },
    part3: [
      "Does art reflect society or shape it?",
      "Should children study art seriously at school?",
      "Can art change people's opinions?",
      "Why do some paintings sell for millions?",
    ],
    vocabulary: [
      { word: "masterpiece", pos: "noun", definition: "a work of outstanding artistry", example: "Starry Night is considered Van Gogh's masterpiece." },
      { word: "evocative", pos: "adj", definition: "bringing strong images or feelings to mind", example: "Her photographs are deeply evocative." },
      { word: "abstract", pos: "adj", definition: "not representing reality realistically", example: "I struggle to appreciate abstract art." },
      { word: "provocative", pos: "adj", definition: "causing thought or strong reaction", example: "The installation was deliberately provocative." },
      { word: "aesthetic", pos: "adj", definition: "concerned with beauty", example: "The building has great aesthetic appeal." },
    ],
    sampleAnswer:
      "A piece of art I adore is 'The Persistence of Memory' by Salvador Dalí — the famous painting with melting clocks. I first saw it at the MoMA in New York and was struck by how small it was, yet how powerful. The surreal image of time bending and dripping felt deeply evocative. It made me think differently about how we measure our lives.",
  },
];

export const BAND_DESCRIPTORS = [
  {
    band: 9,
    label: "Expert",
    fluency: "Speaks fluently with only rare repetition or self-correction. Speaks coherently with logical development.",
    lexical: "Uses vocabulary with full flexibility and precision in all topics. Uses idiomatic language naturally.",
    grammar: "Uses a full range of structures naturally and appropriately. Produces consistent grammatical accuracy.",
    pronunciation: "Uses a full range of phonological features with control and precision.",
  },
  {
    band: 8,
    label: "Very Good",
    fluency: "Speaks fluently with only occasional repetition. Topic development is coherent and appropriate.",
    lexical: "Uses a wide vocabulary resource readily and flexibly. Uses less common and idiomatic vocabulary skillfully.",
    grammar: "Uses a wide range of structures flexibly. Produces a majority of error-free sentences.",
    pronunciation: "Uses a wide range of phonological features with control and flexibility.",
  },
  {
    band: 7,
    label: "Good",
    fluency: "Speaks at length without noticeable effort. May show language-related hesitation.",
    lexical: "Uses vocabulary resource flexibly. Uses some less common and idiomatic vocabulary.",
    grammar: "Uses a range of complex structures with some flexibility. Frequently produces error-free sentences.",
    pronunciation: "Shows all features of this band with some features of Band 8.",
  },
  {
    band: 6,
    label: "Competent",
    fluency: "Willing to speak at length but may lose coherence. May repeat or self-correct.",
    lexical: "Has a wide enough vocabulary to discuss topics at length. May use paraphrase.",
    grammar: "Uses a mix of simple and complex structures with limited flexibility. Makes mistakes but meaning is clear.",
    pronunciation: "Uses a range of pronunciation features with mixed control.",
  },
  {
    band: 5,
    label: "Modest",
    fluency: "Usually maintains flow but uses repetition, self-correction, and slow speech.",
    lexical: "Manages to talk about familiar topics but uses limited vocabulary.",
    grammar: "Produces basic sentence forms with reasonable accuracy. Limited success with complex structures.",
    pronunciation: "Shows all features of Band 4 and some positive features of Band 6.",
  },
];

// Common filler words / discourse markers to highlight in transcripts
export const FILLER_WORDS = [
  "um", "uh", "er", "ah", "like", "you know", "i mean", "sort of", "kind of",
  "basically", "actually", "literally", "honestly", "right", "okay",
];

export const DISCOURSE_MARKERS = [
  "well", "actually", "to be honest", "i suppose", "on the other hand",
  "for instance", "in addition", "however", "moreover", "as a result",
];

export const TIP_BANK = [
  "Use discourse markers like 'Well...' or 'To be honest...' to buy thinking time.",
  "Expand your answer: explain why, give an example, share a personal story.",
  "Don't memorise answers — examiners are trained to spot rehearsed responses.",
  "Aim for at least 2–3 sentences per Part 1 answer, not just yes/no.",
  "In Part 2, use the cue card bullets as a guide — you don't have to follow them rigidly.",
  "It's okay to hesitate briefly — natural speech includes pauses. Just avoid long silences.",
  "Show off vocabulary: instead of 'very good', try 'remarkable', 'exceptional', or 'outstanding'.",
  "Use the present perfect ('I've lived here for...') to talk about ongoing experiences.",
  "Listen for the tense in the question — answering in the wrong tense is a common mistake.",
  "In Part 3, structure your answer: state a position, give a reason, provide an example.",
  "Don't be afraid to express opinions the examiner might disagree with — clarity matters more.",
  "Practise paraphrasing — if you can't think of a word, describe it instead.",
];
