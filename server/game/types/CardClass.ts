import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type { CardData } from './CardData.js';

export type CardClass<Card extends BaseCard = BaseCard> = new (owner: Player, cardData: CardData) => Card;

export type CardLibrary = ReadonlyMap<string, CardClass>;
