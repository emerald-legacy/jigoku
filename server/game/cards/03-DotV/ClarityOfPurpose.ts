import DrawCard from '../../DrawCard.js';
import { Players, CardType, ConflictType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ClarityOfPurpose extends DrawCard {
    static id = 'clarity-of-purpose';

    setupCardAbilities() {
        this.conflictAction('Character cannot be bowed and doesn\'t bow during political conflicts')
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.cardLastingEffect({
                condition: () => this.game.isDuringConflict(ConflictType.Political),
                effect: AbilityDsl.effects.doesNotBow()
            }), AbilityDsl.actions.cardLastingEffect(context => ({
                effect: AbilityDsl.effects.cardCannot({
                    cannot: 'bow',
                    restricts: 'opponentsCardEffects',
                    applyingPlayer: context.player
                })
            })))
            .effect('prevent opponents\' actions from bowing {0} and stop it bowing at the end of a political conflict');
    }
}


export default ClarityOfPurpose;
