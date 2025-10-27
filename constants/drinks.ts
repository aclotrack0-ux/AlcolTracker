import { PredefinedDrink } from '@/types/bac';

export const PREDEFINED_DRINKS: Omit<PredefinedDrink, 'count'>[] = [
  {
    type: 'beer',
    name: 'Birra',
    alcoholPercentage: 5,
    volumeMl: 330,
  },
  {
    type: 'wine',
    name: 'Vino',
    alcoholPercentage: 12,
    volumeMl: 150,
  },
  {
    type: 'bitter',
    name: 'Amari',
    alcoholPercentage: 30,
    volumeMl: 30,
  },
  {
    type: 'cocktail',
    name: 'Cocktail',
    alcoholPercentage: 15,
    volumeMl: 200,
  },
  {
    type: 'liquor',
    name: 'Liquori',
    alcoholPercentage: 40,
    volumeMl: 40,
  },
];