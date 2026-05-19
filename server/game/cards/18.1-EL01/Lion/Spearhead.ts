import DrawCard from '../../../drawcard.js';
import { Players, CardTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class Spearhead extends DrawCard {
    static id = 'spearhead';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: context => context.game.isDuringConflict('military'),
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Attachment,
                cardCondition: (card, context) => card.parent && card.parent.controller === context.player && card.parent.isParticipating()
            }),
            target: {
                player: Players.Opponent,
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            },
            cannotTargetFirst: true
        });
    }
}


export default Spearhead;
