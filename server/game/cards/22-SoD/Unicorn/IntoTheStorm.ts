import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Durations, Players } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';

export default class IntoTheStorm extends DrawCard {
    static id = 'into-the-storm';

    public setupCardAbilities() {
        this.action({
            title: 'Increase the cost to play events',
            effect: 'increase the cost of events this conflict by 1{1}',
            effectArgs: context => [
                context.player.isCharacterTraitInPlay('scout') ? ' and gain 1 fate' : ''
            ],
            condition: context => context.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.playerLastingEffect((context) => ({
                    targetController: Players.Any,
                    effect: AbilityDsl.effects.increaseCost({
                        amount: 1,
                        match: (card: any) => card.type === CardTypes.Event
                    }),
                    duration: Durations.Custom,
                    until: {
                        onCardPlayed: event => event.player === context.player && event.card.type === CardTypes.Event && event.card !== context.source,
                        onConflictFinished: () => true
                    },
                    endingMessage: 'The storm abates, events no longer cost 1 more'
                })),
                AbilityDsl.actions.conditional(context => ({
                    condition: context => context.player.isCharacterTraitInPlay('scout'),
                    trueGameAction: AbilityDsl.actions.gainFate({
                        target: context.player,
                        amount: 1
                    }),
                    falseGameAction: AbilityDsl.actions.noAction()
                }))
            ])
        });
    }
}
