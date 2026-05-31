import DrawCard from '../../DrawCard.js';
import { CardTypes, Durations, Locations, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ForebearersEchoes extends DrawCard {
    static id = 'forebearer-s-echoes';

    setupCardAbilities() {
        this.action({
            title: 'Put a character into play',
            condition: context => context.game.isDuringConflict('military'),
            target: {
                activePromptTitle: 'Choose a character from your dynasty discard pile',
                location: Locations.DynastyDiscardPile,
                controller: Players.Self,
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.joint([
                    AbilityDsl.actions.putIntoConflict(context => ({
                        target: context.target
                    })),
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        target: context.target,
                        duration: Durations.UntilEndOfPhase,
                        location: [Locations.DynastyDiscardPile, Locations.PlayArea],
                        effect: AbilityDsl.effects.delayedEffect({
                            when: {
                                onConflictFinished: () => true
                            },
                            message: '{1} returns to the bottom of the dynasty deck due to the delayed effect of {0}',
                            messageArgs: [context.source, context.target],
                            gameAction: AbilityDsl.actions.returnToDeck({ bottom: true })
                        })
                    }))
                ])
            },
            effect: 'put {0} into play in the conflict and apply a lasting effect to {0}'
        });
    }
}


export default ForebearersEchoes;
