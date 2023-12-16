export type TimelineEventData = {
  title: string
  date: string
  link?: string
}

const events: TimelineEventData[] = [
  {
    title: 'Battle of Marathon',
    date: '-000490-09-10T19:00:00.000Z',
    link: 'https://en.wikipedia.org/wiki/Battle_of_Marathon'
  },
  {
    title: 'Avram Eisner born',
    date: '1980-05-07T19:00:00.000Z'
  },
  {
    title: 'Monali Patel born',
    date: '1982-02-10T19:00:00.000Z'
  }
]

export default events