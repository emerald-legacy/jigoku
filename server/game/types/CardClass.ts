import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type { CardData } from './CardData.js';

export type CardClass<T extends BaseCard = BaseCard> = new (owner: Player, cardData: CardData) => T;

export type CardLibrary = ReadonlyMap<string, CardClass>;
