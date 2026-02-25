import { Players, CardTypes } from '../../Constants';
import AbilityDsl from '../../abilitydsl';
import DrawCard from '../../drawcard';

export default class BlatantSwindler extends DrawCard {
    static id = 'blatant-swindler';

    public setupCardAbilities() {
        this.action({
            title: 'Move home a character',
            cost: AbilityDsl.costs.giveHonorToOpponent(1),
            condition: (context) => context.source.isParticipating() && context.player.opponent !== undefined,
            target: {
                player: Players.Opponent,
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}
