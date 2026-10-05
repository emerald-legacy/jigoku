import { CardType, ConflictType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { DuelsThisConflict } from '../DuelsThisConflict.js';

export default class KakitasFinalStance extends DrawCard {
    static id = 'kakita-s-final-stance';

    public setupCardAbilities() {
        const duelParticipants = DuelsThisConflict.participants(this.game);
        this.action('Character cannot be bowed and doesn\'t bow during resolution')
            .condition(() => this.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                condition: () => duelParticipants.has(context.target),
                effect: AbilityDsl.effects.doesNotBow()
            })), AbilityDsl.actions.cardLastingEffect((context) => ({
                effect: AbilityDsl.effects.cardCannot({
                    cannot: 'bow',
                    restricts: 'opponentsCardEffects',
                    applyingPlayer: context.player
                })
            })))
            .effect('prevent opponents\' actions from bowing {0} and stop it bowing at the end of the conflict if it is involved in a duel');
    }
}
