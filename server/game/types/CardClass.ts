import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import type { CardData } from './CardData.js';

/** A card implementation: a `BaseCard` subclass built from its owner and card data. */
export type CardClass<T extends BaseCard = BaseCard> = new (owner: Player, cardData: CardData) => T;

/** Card implementations by card id. */
export type CardLibrary = ReadonlyMap<string, CardClass>;
