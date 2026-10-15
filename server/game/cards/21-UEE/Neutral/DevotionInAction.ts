import { CardType, Location, Players, Trait } from '../../../Constants.js';
import { putIntoConflict } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DevotionInAction extends DrawCard {
    static id = 'devotion-in-action';

    override setupCardAbilities() {
        this.action('Put a character into play')
            .condition((context) =>
                !!context.game.currentConflict?.hasMoreParticipants(context.player.opponent))
            .target({
                cardType: CardType.Character,
                location: [Location.Provinces, Location.Hand],
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait(Trait.Bushi) && (card.printedCost ?? 0) <= 3
            }, putIntoConflict((context) => ({
                status: context.target.hasTrait(Trait.Yojimbo) ? 'honored' : 'ordinary'
            })));
    }
}
