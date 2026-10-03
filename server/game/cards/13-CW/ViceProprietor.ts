import { CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class ViceProprietor extends DrawCard {
    static id = 'vice-proprietor';

    public setupCardAbilities() {
        this.action('Bow a character')
            .cost(AbilityDsl.costs.dishonorSelf())
            .condition((context) => context.source.isParticipating() && context.player.opponent !== undefined)
            .target('target', {
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.bow());
    }
}
