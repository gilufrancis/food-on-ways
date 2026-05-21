export const creators = [
  {
    id: 'neha',
    name: 'Neha Pillai',
    handle: '@nehaeats',
    youtubeUrl: 'https://youtube.com/@nehaeats',
    tier: 'Tastemaker',
    city: 'Kozhikode',
    bio: 'Chasing the best biriyani across Kerala. 4 years, 200 plates in.',
    avatar: null, // gradient avatar from initials
    color: '#D9542A',
  },
  {
    id: 'arjun',
    name: 'Arjun Menon',
    handle: '@arjunbites',
    youtubeUrl: 'https://youtube.com/@arjunbites',
    tier: 'Explorer',
    city: 'Kochi',
    bio: 'Fort Kochi local. Specialty: things grandmothers make.',
    avatar: null,
    color: '#C8A36C',
  },
  {
    id: 'sara',
    name: 'Sara Iqbal',
    handle: '@saracooks',
    youtubeUrl: 'https://youtube.com/@saracooks',
    tier: 'Tastemaker',
    city: 'Kozhikode',
    bio: 'Moplah cooking, slow trips, late nights.',
    avatar: null,
    color: '#C56173',
  },
  {
    id: 'ravi',
    name: 'Ravi Krishnan',
    handle: '@ravikrishnan',
    youtubeUrl: 'https://youtube.com/@ravikrishnan',
    tier: 'Explorer',
    city: 'Thrissur',
    bio: 'Filter coffee + spreadsheet kind of guy.',
    avatar: null,
    color: '#9A8470',
  },
  {
    id: 'leela',
    name: 'Leela Varma',
    handle: '@leelavarma',
    youtubeUrl: 'https://youtube.com/@leelavarma',
    tier: 'Editor',
    city: 'Alappuzha',
    bio: 'Toddy shops, boatmen lunches, backwater finds.',
    avatar: null,
    color: '#7A8E45',
  },
];

export const TIER_COLOR = {
  Tastemaker: { bg: 'var(--amber-soft)', text: '#6E4A0F' },
  Editor:     { bg: 'var(--green-soft)', text: 'var(--green)' },
  Explorer:   { bg: 'var(--surface-3)',  text: 'var(--ink-3)' },
};

export function getCreator(id) {
  return creators.find(c => c.id === id);
}
