import { AbilityContext } from '../../AbilityContext.js';
import { CardType, Players, Element } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';
import BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';

const ELEMENT_KEY = 'weight-of-duty-void';

export default class WeightOfDuty extends ProvinceCard {
    static id = 'weight-of-duty';

    setupCardAbilities() {
        this.action('Bow & dishonor a character')
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card: DrawCard, context: AbilityContext) =>
                    card.isParticipating() && this.#hasValidTarget(card, context)
            }))
            .condition((context) => context.player.opponent !== undefined)
            .target('target', {
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    context.costs.sacrifice && !context.costs.sacrifice.isUnique() ? !card.isUnique() : true
            }, AbilityDsl.actions.multiple([AbilityDsl.actions.bow(), AbilityDsl.actions.dishonor()]))
            .conflictProvinceCondition((province) => province.isElement(this.getCurrentElementSymbol(ELEMENT_KEY)))
            .cannotTargetFirst();
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
