// A series is an ordered set of projects that build on each other. Projects
// reference it by id and carry their own 1-based `part`; `total` lives on the
// series so it only has to be updated in one place.
export const series = [
  {
    id: 'ai-native',
    name: 'AI-native engineering',
    total: 3,
    blurb:
      'Three builds, each feeding the next: index a codebase, let a local model patch it, then hand the loop to an autonomous agent.',
  },
]

const aiNative = (part) => ({ id: 'ai-native', part })

// `status` drives the card flag and teaser styling:
//   live        - hosted and usable, no flag
//   local       - run from source, no hosted demo
//   coming-soon - not built yet, card is dimmed
export const statusLabels = {
  'coming-soon': 'coming soon',
}

export const projects = [
  {
    id: 'inception-of-context',
    title: 'Inception-of-Context',
    source: 'https://github.com/natalielpx/inception-of-context',
    description: 'Part 1: Inception of Context',
    status: 'coming-soon',
    series: aiNative(1),
  },
  // {
  //   id: 'inception-of-wisdom',
  //   title: 'Inception-of-Wisdom',
  //   description: 'Part 2: Inception of Wisdom',
  //   status: 'coming-soon',
  //   series: aiNative(2),
  // },
  // {
  //   id: 'agent-smith',
  //   title: 'Agent Smith',
  //   description: 'Part 3: Agent Smith',
  //   status: 'coming-soon',
  //   series: aiNative(3),
  // },
  {
    id: 'gomoku',
    title: 'Gomoku',
    source: 'https://github.com/mylastresort/gomoku',
    url: 'https://gomoku.samytamim.com/',
    preview: '/projects/gomoku.png',
    description: 'Five-in-a-row against an AI opponent.',
    status: 'live',
  },
  {
    id: 'music-room',
    title: 'Music Room',
    source: 'https://github.com/mylastresort/music-room',
    url: 'https://music-room.samytamim.com/',
    preview: '/projects/music-room.png',
    description: 'Shared listening room.',
    status: 'coming-soon',
  },
]
