import type BaseCard from '../BaseCard.js';
import { CardType } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import type { RoleCard } from '../RoleCard.js';
import type { StrongholdCard } from '../StrongholdCard.js';

type CardOfOne<Types> =
    Types extends CardType.Province ? ProvinceCard
        : Types extends CardType.Stronghold ? StrongholdCard
            : Types extends CardType.Role ? RoleCard
                : Types extends CardType ? DrawCard
                    : BaseCard;

/** What a `cardType` property may hold. */
export type CardTypes = CardType | readonly CardType[] | undefined;

/** The card class a choice declared with `cardType: K` can hold; any card without one. */
export type CardOfType<Types> = [Types] extends [never] ? BaseCard : Types extends readonly (infer Element)[] ? CardOfOne<Element> : CardOfOne<Types>;

export const isCardTypeList = (cardType: CardTypes): cardType is readonly CardType[] => Array.isArray(cardType);

/** Whether a card is of one of the types `cardType: Types` declares, and so of the class `CardOfType<Types>`. */
export function isCardOfType<Types extends CardTypes>(cardType: Types | undefined): (card: BaseCard) => card is CardOfType<Types> {
    const types: readonly CardType[] | undefined = cardType === undefined ? undefined : isCardTypeList(cardType) ? cardType : [cardType];
    return (card: BaseCard): card is CardOfType<Types> => {
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
