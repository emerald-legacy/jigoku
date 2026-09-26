import type BaseCard from '../BaseCard.js';
import type { CardType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { ProvinceCard } from '../ProvinceCard.js';

type CardOfOne<K> = K extends CardType.Province ? ProvinceCard : K extends CardType ? DrawCard : BaseCard;

/** The card class a choice declared with `cardType: K` can hold; any card without one. */
export type CardOfType<K> = [K] extends [never] ? BaseCard : K extends readonly (infer E)[] ? CardOfOne<E> : CardOfOne<K>;
