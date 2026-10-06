import type { AbilityContext } from '../../AbilityContext.js';
import { CardType, Players, Element } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { bow, dishonor, multiple } from '../../GameActions/GameActions.js';
import type DrawCard from '../../DrawCard.js';

const ELEMENT_KEY = 'weight-of-duty-void';

export default class WeightOfDuty extends ProvinceCard {
    static id = 'weight-of-duty';

    setupCardAbilities() {
        this.action('Bow & dishonor a character')
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    card.isParticipating() && this.hasValidTarget(card, context)
            }))
            .condition((context) => context.player.opponent !== undefined)
            .target({
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card, context) =>
                    context.costs.sacrifice && !context.costs.sacrifice.isUnique() ? !card.isUnique() : true
            }, multiple([bow(), dishonor()]))
            .conflictProvinceCondition((province) => province.isElement(this.getCurrentElementSymbol(ELEMENT_KEY)))
            .cannotTargetFirst();
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: ELEMENT_KEY,
            prettyName: 'Ability - Province Element',
            element: Element.Void
        });
        return symbols;
    }

    private hasValidTarget(card: DrawCard, context: AbilityContext) {
        if(card.isUnique()) {
            //uniques will always have a valid target based on the targeting check
            return true;
        }

        return !!context.player.opponent?.cardsInPlay.some(
            (a) =>
                !a.isUnique() && (a.allowGameAction('bow', context) || a.allowGameAction('dishonor', context))
        );
    }
}
