import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { CardTypes, Locations } from '../../Constants';

class AppealToSympathy extends DrawCard {
    static id = 'appeal-to-sympathy';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: (event) => event.card.type === CardTypes.Event
            },
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.conditional({
                    condition: (context) => context.event.card.isConflict,
                    trueGameAction: AbilityDsl.actions.moveCard((context) => ({
                        target: context.event.card,
                        destination: Locations.ConflictDeck
                    })),
                    falseGameAction: AbilityDsl.actions.moveCard((context) => ({
                        target: context.event.card,
                        destination: Locations.DynastyDiscardPile
                    }))
                })
            ]),
            effect: 'cancel the effects of {1} and {2}',
            effectArgs: (context) => [
                context.event.card,
                context.event.card.isConflict
                    ? 'return it to the top of its owner\'s conflict deck'
                    : 'move it to its owner\'s dynasty discard pile'
            ]
        });
    }
}


export default AppealToSympathy;
