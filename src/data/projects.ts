import type { Project } from '../types/project';

export const PROJECTS: Project[] = [
  {
    type: 'web',
    id: 'tezis',
    title: 'tezis',
    year: 2025,
    stack: ['React', 'Vite', 'TypeScript'],
    description:
      'Web application — демо-площадка для работы с тезисами. TODO: уточнить описание.',
    liveUrl: 'https://tezis.111.88.153.18.nip.io',
    posterSrc: '/previews/placeholder.svg',
    // videoSrc: '/previews/tezis.mp4', — добавить когда будет запись
  },
  {
    type: 'web',
    id: 'frontend-seven',
    title: 'frontend-seven',
    year: 2025,
    stack: ['React', 'Vercel'],
    description:
      'Web application — фронтенд-эксперимент на Vercel. TODO: уточнить описание.',
    liveUrl: 'https://frontend-seven-omega-17.vercel.app/',
    posterSrc: '/previews/placeholder.svg',
  },
  {
    type: 'telegram',
    id: 'marketplace-kwork',
    title: 'marketplace-kwork',
    year: 2025,
    stack: ['Python', 'aiogram', 'SQLite'],
    description:
      'Demo-маркетплейс фриланс-услуг в Telegram — каталог категорий, профили исполнителей, отклики.',
    botUsername: '@test_marketplace_kwork_bot',
    botUrl: 'https://t.me/test_marketplace_kwork_bot',
    chatScript: [
      { from: 'user', text: '/start', timestamp: '12:30' },
      {
        from: 'bot',
        text: 'Добро пожаловать в marketplace. Выберите категорию услуг:',
        timestamp: '12:30',
        buttons: [
          ['Разработка', 'Дизайн'],
          ['Тексты', 'Переводы'],
          ['Все категории'],
        ],
      },
      { from: 'user', text: 'Разработка', timestamp: '12:31' },
      {
        from: 'bot',
        text: 'Разработка · 42 исполнителя. Отсортировать по:',
        timestamp: '12:31',
        buttons: [['Рейтингу', 'Цене', 'Новизне']],
      },
    ],
  },
  {
    type: 'telegram',
    id: 'ticket-seller',
    title: 'ticket-seller',
    year: 2025,
    stack: ['Python', 'aiogram', 'PostgreSQL'],
    description:
      'Продажа билетов на мероприятия через Telegram — афиша, выбор места, оплата (stub).',
    botUsername: '@demo_ticket_seller_bot',
    botUrl: 'https://t.me/demo_ticket_seller_bot',
    chatScript: [
      { from: 'user', text: '/start', timestamp: '18:02' },
      {
        from: 'bot',
        text: 'Афиша на эту неделю:',
        timestamp: '18:02',
        buttons: [
          ['Концерт · Пт 20:00'],
          ['Спектакль · Сб 19:00'],
          ['Стендап · Вс 20:00'],
        ],
      },
      { from: 'user', text: 'Концерт · Пт 20:00', timestamp: '18:03' },
      {
        from: 'bot',
        text: 'Партер от 2000 ₽ · Амфитеатр от 1200 ₽. Выберите:',
        timestamp: '18:03',
        buttons: [['Партер', 'Амфитеатр']],
      },
    ],
  },
];
