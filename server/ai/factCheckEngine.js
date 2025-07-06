const factCheckEngine = {
  check: (sentence) => {
    const corrections = [];
    const lowerSentence = sentence.toLowerCase();

    // Knowledge base of facts and corrections
    const knowledgeBase = [
      {
        triggers: ['earth is flat', 'earth flat'],
        correction: {
          start: 0,
          end: sentence.length,
          suggestion: 'The Earth is an oblate spheroid (slightly flattened at the poles).',
          explanation: 'NASA satellite images, gravity measurements and centuries of astronomical observation show Earth is almost spherical.',
          confidence: 0.95,
          sources: [
            'https://solarsystem.nasa.gov/planet/earth',
            'https://science.nasa.gov/earth/facts'
          ]
        }
      },
      {
        triggers: ['water boils at 0', 'water freezes at 100'],
        correction: {
          start: 0,
          end: sentence.length,
          suggestion: 'Water boils at 100°C (212°F) and freezes at 0°C (32°F) at standard atmospheric pressure.',
          explanation: 'At sea level atmospheric pressure (1 atm), water has a boiling point of 100°C and freezing point of 0°C.',
          confidence: 0.98,
          sources: [
            'https://physics.info/boiling/',
            'https://en.wikipedia.org/wiki/Properties_of_water'
          ]
        }
      },
      {
        triggers: ['great wall china space', 'great wall visible space'],
        correction: {
          start: 0,
          end: sentence.length,
          suggestion: 'The Great Wall of China is not visible from space with the naked eye.',
          explanation: 'This is a common myth. Astronauts have confirmed that the Great Wall is not visible from low Earth orbit without aid.',
          confidence: 0.92,
          sources: [
            'https://www.nasa.gov/vision/space/workinginspace/great_wall.html',
            'https://www.snopes.com/fact-check/great-wall-of-china-space/'
          ]
        }
      },
      {
        triggers: ['humans use 10% brain', 'only use 10% brain'],
        correction: {
          start: 0,
          end: sentence.length,
          suggestion: 'Humans use virtually all of their brain, not just 10%.',
          explanation: 'Neuroimaging shows that we use nearly every part of our brain, and even damage to small areas can have profound effects.',
          confidence: 0.96,
          sources: [
            'https://www.scientificamerican.com/article/do-people-only-use-10-percent-of-their-brains/',
            'https://www.mayoclinic.org/healthy-lifestyle/adult-health/expert-answers/10-percent-of-brain-myth/faq-20058442'
          ]
        }
      },
      {
        triggers: ['lightning never strikes twice', 'lightning same place'],
        correction: {
          start: 0,
          end: sentence.length,
          suggestion: 'Lightning can and often does strike the same place multiple times.',
          explanation: 'The Empire State Building is struck by lightning about 25 times per year. Tall structures are frequently hit multiple times.',
          confidence: 0.94,
          sources: [
            'https://www.weather.gov/safety/lightning-myths',
            'https://www.nssl.noaa.gov/education/svrwx101/lightning/faq/'
          ]
        }
      },
      {
        triggers: ['goldfish 3 second memory', 'goldfish memory 3 seconds'],
        correction: {
          start: 0,
          end: sentence.length,
          suggestion: 'Goldfish have much longer memories than 3 seconds, possibly months.',
          explanation: 'Studies show goldfish can remember things for at least 3 months and can be trained to respond to different colors, sounds, and cues.',
          confidence: 0.89,
          sources: [
            'https://www.bbc.com/news/magazine-19321067',
            'https://www.livescience.com/goldfish-memory.html'
          ]
        }
      }
    ];

    // Check each knowledge base entry
    knowledgeBase.forEach(entry => {
      entry.triggers.forEach(trigger => {
        if (lowerSentence.includes(trigger)) {
          corrections.push(entry.correction);
        }
      });
    });

    return corrections;
  }
};

module.exports = factCheckEngine;
