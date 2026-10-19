import { CardType, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { perConflictOpportunity } from '../../../AbilityLimit.js';

export default class PrayersOnTheEveOfBattle extends DrawCard {
    static id = 'prayers-on-the-eve-of-battle';

    override setupCardAbilities() {
        this.forcedReaction('Reap your rewards')
            .when({
                afterConflict: (_event, context) => !!context.source.parentCharacter
            })
            .if((context) => !!context.source.parentCharacter && context.event.conflict.isOnWinningSide(context.source.parentCharacter))
                .gainFate(1)
                .discardFromPlay()
            .otherwise()
                .removeFromGame();

        this.reaction('Return to hand')
            .when({
                onConflictPass: (event, context) => context.player.opponent && event.conflict.attackingPlayer === context.player.opponent && context.player.opponent.cardsInPlay.some((card) => card.type === CardType.Character && !card.bowed)
            })
            .location(Location.ConflictDiscardPile)
            .moveCard((context) => ({ target: context.source, destination: Location.Hand }))
            .max(perConflictOpportunity(1));
    }
}
