import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location } from '../../Constants.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

class AppealToSympathy extends DrawCard {
    static id = 'appeal-to-sympathy';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: (event) => event.card.type === CardType.Event
            })
            .gameAction(AbilityDsl.actions.multiple([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.conditional({
                    condition: (context) => !!(context as TriggeredAbilityContext).event.card?.isConflict,
                    trueGameAction: AbilityDsl.actions.moveCard((context: TriggeredAbilityContext<DrawCard, DrawCard>) => ({
                        target: context.event.card,
                        destination: Location.ConflictDeck
                    })),
                    falseGameAction: AbilityDsl.actions.moveCard((context: TriggeredAbilityContext<DrawCard, DrawCard>) => ({
                        target: context.event.card,
                        destination: Location.DynastyDiscardPile
                    }))
                })
            ]))
            .effect('cancel the effects of {1} and {2}', (context) => {
                const card = context.event.card;
                return [
                    card ?? '',
                    card?.isConflict
                        ? 'return it to the top of its owner\'s conflict deck'
                        : 'move it to its owner\'s dynasty discard pile'
                ];
            })
            .cannotBeMirrored();
    }
}


export default AppealToSympathy;
