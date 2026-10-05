import { CardType, Location, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class DevotionInAction extends DrawCard {
    static id = 'devotion-in-action';

    setupCardAbilities() {
        this.action('Put a character into play')
            .condition((context) =>
                !!context.game.currentConflict?.hasMoreParticipants(context.player.opponent))
            .target({
                cardType: CardType.Character,
                location: [Location.Provinces, Location.Hand],
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('bushi') && (card.printedCost ?? 0) <= 3
            }, AbilityDsl.actions.putIntoConflict((context) => ({
                target: context.target,
                status: context.target.hasTrait('yojimbo') ? 'honored' : 'ordinary'
            })));
    }
}
