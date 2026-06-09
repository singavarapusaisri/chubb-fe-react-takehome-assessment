import fs from 'fs';
import { randomUUID } from 'crypto';

const lineOfBusiness = ['Property', 'Casualty', 'A&H', 'Marine'];
const statuses = ['Active', 'Expired', 'Pending', 'Cancelled'];
const currencies = ['USD', 'SGD', 'HKD', 'AUD', 'JPY', 'THB'];
const regions = ['Singapore', 'Hong Kong', 'Australia', 'Japan', 'Thailand', 'Indonesia', 'Malaysia', 'Philippines'];
const companyNames = [
  'Pacific Risk Partners',
  'Lotus Capital Holdings',
  'EverGreen Energy',
  'Sakura Financial Services',
  'Indochina Logistics',
  'Ionix Technologies',
  'Silverline Insurance',
  'Zenith Shipping',
  'Phoenix Health Group',
  'Skyward Real Estate',
  'Galaxy Retail Co.',
  'Nova Infrastructure',
  'Bluewave Marine',
  'Aurora Risk Solutions',
  'Emerald Hospitality',
  'Tiger Commerce',
  'Golden Triangle Trading',
  'Harborview Energy',
  'Orchid Pharmaceuticals',
  'Capital Bridge Advisors'
];
const personalNames = [
  'Aria Tan',
  'Kei Nakamura',
  'Samir Patel',
  'Mei Ling Chen',
  'Chaiyaporn Srisuk',
  'Nadia Rahman',
  'Daniela Cruz',
  'Marcus Lee',
  'Lina Wong',
  'Ethan Smith',
  'Ayesha Khan',
  'Ryosuke Ito',
  'Sofia Lim',
  'Hazel Ng',
  'Jun Park',
  'Isaac Tanaka',
  'Priya Nair',
  'Adrian Ho',
  'Nina Marquez',
  'Noah Chen'
];
const underwriters = [
  'Michelle Tan',
  'Jonathan Koh',
  'Emily Wong',
  'Nathan Lim',
  'Priya Verma',
  'Jayden Choi',
  'Samantha Lee',
  'Ravi Sharma',
  'Hiroshi Yamamoto',
  'Amanda Ng',
  'Carmen Ho',
  'Felix Lau',
  'Olivia Nguyen',
  'Lucas Chan',
  'Isabel Soto',
  'Minh Tran',
  'Siti Aisyah',
  'Wai Meng',
  'Sabine Koh',
  'Marcus Ong'
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min, max, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
}

function randomDate(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().slice(0, 10);
}

function createPolicy(index) {
  const effectiveDate = randomDate(new Date('2022-01-01'), new Date('2025-06-30'));
  const start = new Date(effectiveDate);
  const expiryDate = new Date(start);
  expiryDate.setMonth(expiryDate.getMonth() + randomNumber(6, 36));

  const policyholderName = Math.random() > 0.35
    ? randomItem(companyNames)
    : randomItem(personalNames);

  return {
    id: randomUUID(),
    policyNumber: `POL-${String(index + 1).padStart(6, '0')}`,
    policyholderName,
    lineOfBusiness: randomItem(lineOfBusiness),
    status: randomItem(statuses),
    premiumAmount: randomNumber(1000, 5000000, 2),
    currency: randomItem(currencies),
    effectiveDate,
    expiryDate: expiryDate.toISOString().slice(0, 10),
    region: randomItem(regions),
    underwriter: randomItem(underwriters),
    flaggedForReview: Math.random() < 0.1
  };
}

const policies = Array.from({ length: 200 }, (_, index) => createPolicy(index));
const db = { policies };

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log('db.json created with', policies.length, 'records');
