import DrawCard from '../../../DrawCard.js';
import { Players, CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class Spearhead extends DrawCard {
    static id = 'spearhead';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: context => context.game.isDuringConflict('military'),
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardType.Attachment,
                cardCondition: (card, context) => card.parent && card.parent.controller === context.player && card.parent.isParticipating()
            }),
            target: {
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            },
            cannotTargetFirst: true
        });
    }
}


export default Spearhead;
