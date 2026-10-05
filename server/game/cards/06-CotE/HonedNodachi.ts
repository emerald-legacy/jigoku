import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Players, ConflictType } from '../../Constants.js';

class HonedNodachi extends DrawCard {
    static id = 'honed-nodachi';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'bushi'
        });

        this.reaction('Remove a fate from attached character and force opponent to discard a participating character')
            .when({
                afterConflict: (event, context) => context.source.parentCharacter && context.source.parentCharacter.isParticipating() &&
                                                   event.conflict.winner === context.source.parentCharacter.controller &&
                                                   event.conflict.conflictType === ConflictType.Military
            })
            .cost(AbilityDsl.costs.removeFateFromParent())
            .target({
                activePromptTitle: 'Choose a character to discard',
                cardType: CardType.Character,
                player: Players.Opponent,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.discardFromPlay());
    }
}


export default HonedNodachi;
