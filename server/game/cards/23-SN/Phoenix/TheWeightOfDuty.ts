import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Duration, Location, Players } from '../../../Constants.js';
import type BaseCard from '../../../BaseCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

export default class TheWeightOfDuty extends DrawCard {
    static id = 'the-weight-of-duty';

    setupCardAbilities() {
        this.reaction('Honor a character')
            .when({
                onCardAbilityTriggered: (event, context) =>
                    event.player === context.player.opponent &&
                    // chosenCardTargets covers every resolution of the triggering, sub-resolutions included
                    event.context.triggeringContext.chosenCardTargets.some((card) =>
                        this.isOwnShugenjaInPlay(card, context)
                    )
            })
            .target('target', {
                activePromptTitle: 'Choose a character',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('bushi')
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.honor(),
                AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.addKeyword('pride'),
                    duration: Duration.UntilEndOfPhase
                })
            ]));
    }

    private isOwnShugenjaInPlay(card: BaseCard, context: AbilityContext) {
        return (
            card.type === CardType.Character &&
            card.hasTrait('shugenja') &&
            card.controller === context.player &&
            card.location === Location.PlayArea
        );
    }
}
