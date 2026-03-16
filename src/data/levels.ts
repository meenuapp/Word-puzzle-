import { Level } from '../types/game';

export const LEVELS: Level[] = [
  {
    "id": 1,
    "difficulty": "Beginner",
    "letters": [
      "C",
      "A",
      "T",
      "B"
    ],
    "words": [
      {
        "word": "BAT",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "ACT",
        "x": 1,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "CAT",
        "x": 1,
        "y": 1,
        "direction": "horizontal"
      }
    ],
    "bonusWords": [
      "CAB",
      "TAB"
    ]
  },
  {
    "id": 2,
    "difficulty": "Beginner",
    "letters": [
      "D",
      "O",
      "G",
      "S"
    ],
    "words": [
      {
        "word": "DOG",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "GOD",
        "x": 2,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "DOGS",
        "x": 2,
        "y": 2,
        "direction": "horizontal"
      }
    ],
    "bonusWords": [
      "SO",
      "GO",
      "DO"
    ]
  },
  {
    "id": 3,
    "difficulty": "Beginner",
    "letters": [
      "S",
      "U",
      "N",
      "P"
    ],
    "words": [
      {
        "word": "SUN",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "UPS",
        "x": 1,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "PUN",
        "x": 1,
        "y": 1,
        "direction": "horizontal"
      }
    ],
    "bonusWords": [
      "US",
      "PUP",
      "PUNS"
    ]
  },
  {
    "id": 4,
    "difficulty": "Beginner",
    "letters": [
      "A",
      "R",
      "T",
      "S"
    ],
    "words": [
      {
        "word": "STAR",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "ART",
        "x": 2,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "RAT",
        "x": 0,
        "y": 2,
        "direction": "horizontal"
      }
    ],
    "bonusWords": [
      "TAR",
      "SAT",
      "ARTS"
    ]
  },
  {
    "id": 5,
    "difficulty": "Beginner",
    "letters": [
      "M",
      "E",
      "A",
      "T"
    ],
    "words": [
      {
        "word": "MEAT",
        "x": 0,
        "y": 2,
        "direction": "horizontal"
      },
      {
        "word": "TEAM",
        "x": 2,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "MAT",
        "x": 2,
        "y": 3,
        "direction": "horizontal"
      },
      {
        "word": "EAT",
        "x": 2,
        "y": 1,
        "direction": "horizontal"
      }
    ],
    "bonusWords": [
      "TEA",
      "ATE",
      "TAME"
    ]
  },
  {
    "id": 6,
    "difficulty": "Easy",
    "letters": [
      "W",
      "O",
      "R",
      "D",
      "S"
    ],
    "words": [
      {
        "word": "SWORD",
        "x": 1,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "WORDS",
        "x": 2,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "ROW",
        "x": 2,
        "y": 2,
        "direction": "horizontal"
      },
      {
        "word": "ROD",
        "x": 0,
        "y": 3,
        "direction": "horizontal"
      }
    ],
    "bonusWords": [
      "SOW",
      "WORD"
    ]
  },
  {
    "id": 7,
    "difficulty": "Easy",
    "letters": [
      "S",
      "M",
      "I",
      "L",
      "E"
    ],
    "words": [
      {
        "word": "SMILE",
        "x": 1,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "MILES",
        "x": 2,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "ISLE",
        "x": 0,
        "y": 2,
        "direction": "horizontal"
      },
      {
        "word": "SLIME",
        "x": 2,
        "y": 4,
        "direction": "horizontal"
      }
    ],
    "bonusWords": [
      "MILE",
      "LIME"
    ]
  },
  {
    "id": 8,
    "difficulty": "Easy",
    "letters": [
      "W",
      "A",
      "T",
      "E",
      "R"
    ],
    "words": [
      {
        "word": "WATER",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "TEAR",
        "x": 2,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "RATE",
        "x": 2,
        "y": 3,
        "direction": "horizontal"
      },
      {
        "word": "RAW",
        "x": 0,
        "y": 0,
        "direction": "vertical"
      }
    ],
    "bonusWords": [
      "WAR",
      "ART",
      "ATE",
      "TAR"
    ]
  },
  {
    "id": 9,
    "difficulty": "Easy",
    "letters": [
      "H",
      "E",
      "A",
      "R",
      "T"
    ],
    "words": [
      {
        "word": "HEART",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "EARTH",
        "x": 1,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "ART",
        "x": 1,
        "y": 1,
        "direction": "horizontal"
      },
      {
        "word": "TEAR",
        "x": 1,
        "y": 3,
        "direction": "horizontal"
      }
    ],
    "bonusWords": [
      "HEAR",
      "RATE",
      "HAT",
      "EAR"
    ]
  },
  {
    "id": 10,
    "difficulty": "Easy",
    "letters": [
      "S",
      "T",
      "O",
      "N",
      "E"
    ],
    "words": [
      {
        "word": "STONE",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "TONES",
        "x": 1,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "ONE",
        "x": 1,
        "y": 1,
        "direction": "horizontal"
      },
      {
        "word": "NET",
        "x": 1,
        "y": 2,
        "direction": "horizontal"
      },
      {
        "word": "SON",
        "x": 0,
        "y": 0,
        "direction": "vertical"
      }
    ],
    "bonusWords": [
      "TONE",
      "NOTE",
      "NOTES",
      "TEN"
    ]
  },
  {
    "id": 11,
    "difficulty": "Medium",
    "letters": [
      "P",
      "L",
      "A",
      "N",
      "E",
      "T"
    ],
    "words": [
      {
        "word": "PLANET",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "PLANT",
        "x": 0,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "LATE",
        "x": 0,
        "y": 1,
        "direction": "horizontal"
      },
      {
        "word": "TALE",
        "x": 0,
        "y": 4,
        "direction": "horizontal"
      },
      {
        "word": "PALE",
        "x": 2,
        "y": 2,
        "direction": "vertical"
      }
    ],
    "bonusWords": [
      "PLANE",
      "PANEL",
      "LEAP",
      "PANT"
    ]
  },
  {
    "id": 12,
    "difficulty": "Medium",
    "letters": [
      "S",
      "P",
      "R",
      "I",
      "N",
      "G"
    ],
    "words": [
      {
        "word": "SPRING",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "RINGS",
        "x": 2,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "SIGN",
        "x": 2,
        "y": 4,
        "direction": "horizontal"
      },
      {
        "word": "PIG",
        "x": 1,
        "y": 0,
        "direction": "vertical"
      }
    ],
    "bonusWords": [
      "RING",
      "SING",
      "SPIN",
      "GRIP"
    ]
  },
  {
    "id": 13,
    "difficulty": "Medium",
    "letters": [
      "B",
      "R",
      "A",
      "N",
      "C",
      "H"
    ],
    "words": [
      {
        "word": "BRANCH",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "RANCH",
        "x": 1,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "CRAB",
        "x": 1,
        "y": 3,
        "direction": "horizontal"
      },
      {
        "word": "BARN",
        "x": 4,
        "y": 3,
        "direction": "vertical"
      },
      {
        "word": "ARCH",
        "x": 1,
        "y": 1,
        "direction": "horizontal"
      }
    ],
    "bonusWords": [
      "BRAN",
      "CHAR"
    ]
  },
  {
    "id": 14,
    "difficulty": "Medium",
    "letters": [
      "M",
      "A",
      "R",
      "K",
      "E",
      "T"
    ],
    "words": [
      {
        "word": "MARKET",
        "x": 1,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "MAKER",
        "x": 1,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "TEAM",
        "x": 0,
        "y": 3,
        "direction": "horizontal"
      },
      {
        "word": "TAKE",
        "x": 6,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "MAKE",
        "x": 3,
        "y": 3,
        "direction": "horizontal"
      }
    ],
    "bonusWords": [
      "MARK",
      "RATE",
      "TEAR",
      "MEAT"
    ]
  },
  {
    "id": 15,
    "difficulty": "Medium",
    "letters": [
      "C",
      "A",
      "S",
      "T",
      "L",
      "E"
    ],
    "words": [
      {
        "word": "CASTLE",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "STALE",
        "x": 2,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "LATE",
        "x": 2,
        "y": 3,
        "direction": "horizontal"
      },
      {
        "word": "TALES",
        "x": 4,
        "y": 3,
        "direction": "vertical"
      },
      {
        "word": "CATS",
        "x": 0,
        "y": 0,
        "direction": "vertical"
      }
    ],
    "bonusWords": [
      "TALE",
      "SALE",
      "SEAT",
      "EAST"
    ]
  },
  {
    "id": 16,
    "difficulty": "Hard",
    "letters": [
      "P",
      "I",
      "C",
      "T",
      "U",
      "R",
      "E"
    ],
    "words": [
      {
        "word": "PICTURE",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "PRICE",
        "x": 0,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "CURE",
        "x": 0,
        "y": 3,
        "direction": "horizontal"
      },
      {
        "word": "TRUE",
        "x": 3,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "EPIC",
        "x": 6,
        "y": 0,
        "direction": "vertical"
      }
    ],
    "bonusWords": [
      "PURE",
      "RICE",
      "TRIP",
      "CUP"
    ]
  },
  {
    "id": 17,
    "difficulty": "Hard",
    "letters": [
      "M",
      "A",
      "C",
      "H",
      "I",
      "N",
      "E"
    ],
    "words": [
      {
        "word": "MACHINE",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "MINCE",
        "x": 0,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "CHAIN",
        "x": 0,
        "y": 3,
        "direction": "horizontal"
      },
      {
        "word": "ACHE",
        "x": 2,
        "y": 3,
        "direction": "vertical"
      },
      {
        "word": "NICE",
        "x": 5,
        "y": 0,
        "direction": "vertical"
      }
    ],
    "bonusWords": [
      "MICE",
      "CHIN",
      "NAME",
      "MINE"
    ]
  },
  {
    "id": 18,
    "difficulty": "Hard",
    "letters": [
      "T",
      "E",
      "A",
      "C",
      "H",
      "E",
      "R"
    ],
    "words": [
      {
        "word": "TEACHER",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "THREE",
        "x": 0,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "EARTH",
        "x": 0,
        "y": 3,
        "direction": "horizontal"
      },
      {
        "word": "CHAT",
        "x": 3,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "RATE",
        "x": 6,
        "y": 0,
        "direction": "vertical"
      }
    ],
    "bonusWords": [
      "TEACH",
      "CHEAT",
      "HEART",
      "REACH",
      "THERE"
    ]
  },
  {
    "id": 19,
    "difficulty": "Hard",
    "letters": [
      "M",
      "O",
      "R",
      "N",
      "I",
      "N",
      "G"
    ],
    "words": [
      {
        "word": "MORNING",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "MINOR",
        "x": 0,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "RING",
        "x": 0,
        "y": 4,
        "direction": "horizontal"
      },
      {
        "word": "IRON",
        "x": 1,
        "y": 4,
        "direction": "vertical"
      },
      {
        "word": "NORM",
        "x": 3,
        "y": 0,
        "direction": "vertical"
      }
    ],
    "bonusWords": [
      "IRONING",
      "GRIN",
      "RING"
    ]
  },
  {
    "id": 20,
    "difficulty": "Hard",
    "letters": [
      "P",
      "A",
      "I",
      "N",
      "T",
      "E",
      "R"
    ],
    "words": [
      {
        "word": "PAINTER",
        "x": 0,
        "y": 0,
        "direction": "horizontal"
      },
      {
        "word": "PRINT",
        "x": 0,
        "y": 0,
        "direction": "vertical"
      },
      {
        "word": "TRAIN",
        "x": 0,
        "y": 4,
        "direction": "horizontal"
      },
      {
        "word": "NEAR",
        "x": 4,
        "y": 4,
        "direction": "vertical"
      },
      {
        "word": "RENT",
        "x": 6,
        "y": 0,
        "direction": "vertical"
      }
    ],
    "bonusWords": [
      "PAINT",
      "RAIN",
      "PART",
      "RATE"
    ]
  }
];
