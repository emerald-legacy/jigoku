import DrawCard from '../../../DrawCard.js';
import { Players, CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class Spearhead extends DrawCard {
    static id = 'spearhead';

    setupCardAbilities() {
        this.action('Bow a character')
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Attachment,
                // `parentCharacter` is null when attached to a province or ring, which does not participate.
                cardCondition: (card, context) => !!card.parentCharacter &&
                    card.parentCharacter.controller === context.player && card.parentCharacter.isParticipating()
            }))
            .condition(context => context.game.isDuringConflict('military'))
            .target('target', {
                player: Players.Opponent,
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            }, AbilityDsl.actions.bow())
            .cannotTargetFirst();
    }
}


export default Spearhead;
