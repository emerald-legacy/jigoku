import { CardType, CharacterStatus, Location, Players, Trait } from '../../../Constants.js';
import { putIntoConflict } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DevotionInAction extends DrawCard {
    static id = 'devotion-in-action';

    override setupCardAbilities() {
        this.conflictAction('Put a character into play')
            .ifCondition((context) =>
                !!context.game.currentConflict?.hasMoreParticipants(context.player.opponent))
            .target({
                cardType: CardType.Character,
                location: [Location.Provinces, Location.Hand],
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait(Trait.Bushi) && card.costAtMost(3)
            }, putIntoConflict((context) => (context.target.hasTrait(Trait.Yojimbo) ? { status: CharacterStatus.Honored } : {})));
    }
}
