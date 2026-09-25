import { CardType, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class PrayersOnTheEveOfBattle extends DrawCard {
    static id = 'prayers-on-the-eve-of-battle';

    setupCardAbilities() {
        this.forcedReaction('Reap your rewards')
            .when({
                afterConflict: (event, context) => !!context.source.parentCharacter
            })
            .gameAction(AbilityDsl.actions.conditional((context) => ({
                condition: !!context.source.parentCharacter?.isParticipating() &&
                    context.event.conflict?.winner === context.source.parentCharacter?.controller,
                trueGameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.gainFate({
                        amount: 1,
                        target: context.player
                    }),
                    AbilityDsl.actions.discardFromPlay({
                        target: context.source
                    })
                ]),
                falseGameAction: AbilityDsl.actions.removeFromGame({
                    target: context.source
                })
            })));

        this.reaction('Return to hand')
            .when({
                onConflictPass: (event, context) => context.player.opponent && event.conflict.attackingPlayer === context.player.opponent && context.player.opponent.cardsInPlay.some(card => card.type === CardType.Character && !card.bowed)
            })
            .gameAction(AbilityDsl.actions.moveCard(context => ({ target: context.source, destination: Location.Hand })))
            .max(AbilityDsl.limit.perConflictOpportunity(1))
            .location(Location.ConflictDiscardPile);
    }
}
