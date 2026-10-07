import { CardType, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { moveCard, removeFromGame } from '../../../GameActions/GameActions.js';

export default class PrayersOnTheEveOfBattle extends DrawCard {
    static id = 'prayers-on-the-eve-of-battle';

    setupCardAbilities() {
        this.forcedReaction('Reap your rewards')
            .when({
                afterConflict: (_event, context) => !!context.source.parentCharacter
            })
            .if((context) => !!context.source.parentCharacter?.isParticipating() &&
                context.event.conflict.winner === context.source.parentCharacter?.controller)
                .gainFate(1)
                .discardFromPlay((context) => ({ target: context.source }))
            .otherwise()
                .gameAction(removeFromGame((context) => ({ target: context.source })));

        this.reaction('Return to hand')
            .when({
                onConflictPass: (event, context) => context.player.opponent && event.conflict.attackingPlayer === context.player.opponent && context.player.opponent.cardsInPlay.some(card => card.type === CardType.Character && !card.bowed)
            })
            .gameAction(moveCard(context => ({ target: context.source, destination: Location.Hand })))
            .max(AbilityDsl.limit.perConflictOpportunity(1))
            .location(Location.ConflictDiscardPile);
    }
}
