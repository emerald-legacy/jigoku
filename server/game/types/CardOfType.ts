import type BaseCard from '../BaseCard.js';
import { CardType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import type { RoleCard } from '../RoleCard.js';
import type { StrongholdCard } from '../StrongholdCard.js';

type CardOfOne<K> =
    K extends CardType.Province ? ProvinceCard
        : K extends CardType.Stronghold ? StrongholdCard
            : K extends CardType.Role ? RoleCard
                : K extends CardType ? DrawCard
                    : BaseCard;

/** The card class a choice declared with `cardType: K` can hold; any card without one. */
export type CardOfType<K> = [K] extends [never] ? BaseCard : K extends readonly (infer E)[] ? CardOfOne<E> : CardOfOne<K>;

const isCardTypeList = (cardType: CardType | readonly CardType[]): cardType is readonly CardType[] => Array.isArray(cardType);

/** Whether a card is of one of the types `cardType: K` declares, and so of the class `CardOfType<K>`. */
export function isCardOfType<K extends CardType | readonly CardType[] | undefined>(cardType: K | undefined): (card: BaseCard) => card is CardOfType<K> {
    const types: readonly CardType[] | undefined = cardType === undefined ? undefined : isCardTypeList(cardType) ? cardType : [cardType];
    return (card: BaseCard): card is CardOfType<K> => {
        if(types === undefined) {
            return true;
        }
        if(!types.includes(card.type)) {
            return false;
        }
        switch(card.type) {
            case CardType.Province:
                return card.isProvinceCard();
            case CardType.Stronghold:
                return card.isStrongholdCard();
            case CardType.Role:
                return card.isRoleCard();
            default:
                return card.isDrawCard();
        }
    };
}
