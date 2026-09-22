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
                // `attachedCharacter` is null when attached to a province or ring, which does not participate.
                cardCondition: (card, context) => !!card.attachedCharacter &&
                    card.attachedCharacter.controller === context.player && card.attachedCharacter.isParticipating()
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
