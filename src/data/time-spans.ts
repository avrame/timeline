export type Civilization = 'greek' | 'greek_2' | 'roman' | 'east_roman' | 'ottoman' | 'babylonian' | 'chinese' | 'chinese_2' | 'chinese_3'

export type CivOrder = Civilization[]

export type TimespanData = {
  title: string
  start: string
  end: string
}

export type CivTimespans = {
  [k in Civilization]: TimespanData[]
}

export const civ_order: CivOrder = ['greek', 'greek_2', 'roman', 'east_roman', 'ottoman', 'babylonian', 'chinese', 'chinese_2', 'chinese_3']

export const civ_timespans: CivTimespans = {
  greek: [
    {
      title: 'Neolithic Greece',
      start: '-006800-01-01T19:00:00.000Z',
      end: '-003200-01-01T19:00:00.000Z',
    },
    {
      title: 'Greek Bronze Age',
      start: '-003200-01-01T19:00:00.000Z',
      end: '-000800-01-01T19:00:00.000Z',
    },
    {
      title: 'Ancient Greece',
      start: '-000800-01-01T19:00:00.000Z',
      end: '0600-01-01T19:00:00.000Z',
    },
    {
      title: 'Early Modern Greece',
      start: '0600-01-01T19:00:00.000Z',
      end: '1800-01-01T19:00:00.000Z',
    },
    {
      title: 'Modern Greece',
      start: '1800-01-01T19:00:00.000Z',
      end: '2023-01-01T19:00:00.000Z',
    },
  ],

  greek_2: [
    {
      title: 'Early Helladic',
      start: '-003200-01-01T19:00:00.000Z',
      end: '-002001-01-01T19:00:00.000Z',
    },
    {
      title: 'Middle Helladic',
      start: '-002000-01-01T19:00:00.000Z',
      end: '-001550-01-01T19:00:00.000Z',
    },
    {
      title: 'Late Helladic',
      start: '-001550-01-01T19:00:00.000Z',
      end: '-001050-01-01T19:00:00.000Z',
    },
    {
      title: 'Archaic Period',
      start: '-000785-01-01T19:00:00.000Z',
      end: '-000481-01-01T19:00:00.000Z',
    },
    {
      title: 'Classical Greece',
      start: '-000480-01-01T19:00:00.000Z',
      end: '-000323-01-01T19:00:00.000Z',
    },
    {
      title: 'Hellenistic Greece',
      start: '-000323-01-01T19:00:00.000Z',
      end: '-000146-01-01T19:00:00.000Z',
    },
    {
      title: 'Greco-Roman Greece',
      start: '-000146-01-01T19:00:00.000Z',
      end: '-000030-01-01T19:00:00.000Z',
    },
  ],

  roman: [
    {
      title: 'Roman Kingdom',
      start: '-000753-01-01T19:00:00.000Z',
      end: '-000509-01-01T19:00:00.000Z',
    },
    {
      title: 'Roman Republic',
      start: '-000509-01-01T19:00:00.000Z',
      end: '-000027-01-01T19:00:00.000Z',
    },
    {
      title: 'Roman Empire',
      start: '-000027-01-01T19:00:00.000Z',
      end: '0395-01-01T19:00:00.000Z',
    },
    {
      title: 'Western Roman Empire',
      start: '0395-01-01T19:00:00.000Z',
      end: '0476-01-01T19:00:00.000Z',
    },
  ],

  east_roman: [
    {
      title: 'Eastern Roman Empire',
      start: '0330-01-01T19:00:00.000Z',
      end: '1453-01-01T19:00:00.000Z',
    },
  ],

  ottoman: [
    {
      title: 'Rise',
      start: '1299-01-01T19:00:00.000Z',
      end: '1453-01-01T19:00:00.000Z',
    },
    {
      title: 'Classical',
      start: '1453-01-01T19:00:00.000Z',
      end: '1566-01-01T19:00:00.000Z',
    },
    {
      title: 'Stagnation & Reform',
      start: '1566-01-01T19:00:00.000Z',
      end: '1827-01-01T19:00:00.000Z',
    },
    {
      title: 'Decline & Modernisation',
      start: '1828-01-01T19:00:00.000Z',
      end: '1908-01-01T19:00:00.000Z',
    },
    {
      title: 'Defeat & Dissolution',
      start: '1908-01-01T19:00:00.000Z',
      end: '1922-01-01T19:00:00.000Z',
    }
  ],

  babylonian: [
    {
      title: '1st Babylonian Dynasty',
      start: '-001894-01-01T19:00:00.000Z',
      end: '-001595-01-01T19:00:00.000Z',
    },
    {
      title: 'Kassite Dynasty',
      start: '-001595-01-01T19:00:00.000Z',
      end: '-001155-01-01T19:00:00.000Z',
    },
    {
      title: 'Early Iron Age',
      start: '-001155-01-01T19:00:00.000Z',
      end: '-001026-01-01T19:00:00.000Z',
    },
    {
      title: 'Period of Chaos',
      start: '-001026-01-01T19:00:00.000Z',
      end: '-000911-01-01T19:00:00.000Z',
    },
    {
      title: 'Assyrian Rule',
      start: '-000911-01-01T19:00:00.000Z',
      end: '-000619-01-01T19:00:00.000Z',
    },
    {
      title: 'Neo-Babylonian Empire',
      start: '-000620-01-01T19:00:00.000Z',
      end: '-000529-01-01T19:00:00.000Z',
    },
  ],

  chinese: [
    {
      title: 'Neolithic China',
      start: '-08500-01-01T19:00:00.000Z',
      end: '-002000-01-01T19:00:00.000Z',
    },
    {
      title: 'Ancient China',
      start: '-002070-01-01T19:00:00.000Z',
      end: '-000221-01-01T19:00:00.000Z',
    },
    {
      title: 'Imperial China',
      start: '-000221-01-01T19:00:00.000Z',
      end: '1912-01-01T19:00:00.000Z',
    },
    {
      title: 'Modern China',
      start: '1912-01-01T19:00:00.000Z',
      end: '2023-01-01T19:00:00.000Z',
    },
  ],

  chinese_2: [
    {
      title: 'Xia',
      start: '-002070-01-01T19:00:00.000Z',
      end: '-001600-01-01T19:00:00.000Z',
    },
    {
      title: 'Shang',
      start: '-001600-01-01T19:00:00.000Z',
      end: '-001046-01-01T19:00:00.000Z',
    },
    {
      title: 'Zhou',
      start: '-001046-01-01T19:00:00.000Z',
      end: '-000256-01-01T19:00:00.000Z',
    },
    {
      title: 'Qin',
      start: '-000221-01-01T19:00:00.000Z',
      end: '-000207-01-01T19:00:00.000Z',
    },
    {
      title: 'Han',
      start: '-000206-01-01T19:00:00.000Z',
      end: '0220-01-01T19:00:00.000Z',
    },
    {
      title: 'Three Kingdoms',
      start: '0220-01-01T19:00:00.000Z',
      end: '0280-01-01T19:00:00.000Z',
    },
    {
      title: 'Northern & Southern Dynasties',
      start: '0420-01-01T19:00:00.000Z',
      end: '0589-01-01T19:00:00.000Z',
    },
    {
      title: 'Sui',
      start: '0581-01-01T19:00:00.000Z',
      end: '0618-01-01T19:00:00.000Z',
    },
    {
      title: 'Tang',
      start: '0618-01-01T19:00:00.000Z',
      end: '0907-01-01T19:00:00.000Z',
    },
    {
      title: 'Five Dynasties & Ten Kingdoms',
      start: '0907-01-01T19:00:00.000Z',
      end: '0979-01-01T19:00:00.000Z',
    },
    {
      title: 'Yuan',
      start: '1279-01-01T19:00:00.000Z',
      end: '1368-01-01T19:00:00.000Z',
    },
    {
      title: 'Ming',
      start: '1368-01-01T19:00:00.000Z',
      end: '1644-01-01T19:00:00.000Z',
    },
    {
      title: 'Qing',
      start: '1636-01-01T19:00:00.000Z',
      end: '1912-01-01T19:00:00.000Z',
    },
  ],

  chinese_3: [
    {
      title: 'Jin',
      start: '0266-01-01T19:00:00.000Z',
      end: '0420-01-01T19:00:00.000Z',
    },
    {
      title: 'Western Zhou',
      start: '-001046-01-01T19:00:00.000Z',
      end: '-000771-01-01T19:00:00.000Z',
    },
    {
      title: 'Eastern Zhou',
      start: '-000771-01-01T19:00:00.000Z',
      end: '-000256-01-01T19:00:00.000Z',
    },
    {
      title: 'Song',
      start: '0960-01-01T19:00:00.000Z',
      end: '1279-01-01T19:00:00.000Z',
    },
    {
      title: 'Northern Song',
      start: '0960-01-01T19:00:00.000Z',
      end: '1127-01-01T19:00:00.000Z',
    },
    {
      title: 'Southern Song',
      start: '1127-01-01T19:00:00.000Z',
      end: '1279-01-01T19:00:00.000Z',
    },
  ]
}
