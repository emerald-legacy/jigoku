import { AbilityContext } from '../../AbilityContext.js';
import { CardType, Players, TargetMode, Element } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';
import BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';

const ELEMENT_KEY = 'weight-of-duty-void';

export default class WeightOfDuty extends ProvinceCard {
    static id = 'weight-of-duty';

    setupCardAbilities() {
        this.action({
            title: 'Bow & dishonor a character',
            condition: (context) => context.player.opponent !== undefined,
            conflictProvinceCondition: (province) => province.isElement(this.getCurrentElementSymbol(ELEMENT_KEY)),
            cannotTargetFirst: true,
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card: DrawCard, context: AbilityContext) =>
                    card.isParticipating() && this.#hasValidTarget(card, context)
            }),
            target: {
                controller: Players.Opponent,
                cardType: CardType.Character,
                mode: TargetMode.Single,
                cardCondition: (card, context) =>
                    context.costs.sacrifice && !context.costs.sacrifice.isUnique() ? !card.isUnique() : true,
                gameAction: AbilityDsl.actions.multiple([AbilityDsl.actions.bow(), AbilityDsl.actions.dishonor()])
            }
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: ELEMENT_KEY,
            prettyName: 'Ability - Province Element',
            element: Element.Void
        });
        return symbols;
    }

    #hasValidTarget(card: DrawCard, context: AbilityContext) {
        if(card.isUnique()) {
            //uniques will always have a valid target based on the targeting check
            return true;
        }

        return !!context.player.opponent?.cardsInPlay.some(
            (a: BaseCard) =>
                !a.isUnique() && (a.allowGameAction('bow', context) || a.allowGameAction('dishonor', context))
        );
    }
}
