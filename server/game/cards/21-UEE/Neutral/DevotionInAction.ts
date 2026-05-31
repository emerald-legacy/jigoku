import { CardTypes, Locations, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class DevotionInAction extends DrawCard {
    static id = 'devotion-in-action';

    setupCardAbilities() {
        this.action({
            title: 'Put a character into play',
            condition: (context) =>
                !!(context.game.isDuringConflict() &&
        context.player.opponent &&
        context.game.currentConflict?.hasMoreParticipants(context.player.opponent, () => true)),
            target: {
                cardType: CardTypes.Character,
                location: [Locations.Provinces, Locations.Hand],
                controller: Players.Self,
                cardCondition: (card) => card instanceof DrawCard && card.hasTrait('bushi') && (card.printedCost ?? 0) <= 3,
                gameAction: AbilityDsl.actions.putIntoConflict((context) => ({
                    target: context.target,
                    status: context.target.hasTrait('yojimbo') ? 'honored' : 'ordinary'
                }))
            }
        });
    }
}
