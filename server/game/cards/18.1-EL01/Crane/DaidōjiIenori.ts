import DrawCard from '../../../DrawCard.js';
import {
    cannotReceiveDishonorToken,
    cannotReceiveHonorToken,
    cannotReceiveTaintedToken,
    setMilitarySkill,
    setPoliticalSkill
} from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';

class DaidojiIenori extends DrawCard {
    static id = 'daidoji-ienori';

    setupCardAbilities() {
        this.conflictAction('Set a participating character to 3/3')
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => {
                const effect = [
                    setMilitarySkill(3),
                    setPoliticalSkill(3)
                ];
                if(context.source.isHonored) {
                    effect.push(cannotReceiveDishonorToken());
                    effect.push(cannotReceiveHonorToken());
                    effect.push(cannotReceiveTaintedToken());
                }
                return {
                    effect: effect
                };
            }))
            .chatText('set the skills of {0} to 3{1}/3{2}{3}', (context) => ['military', 'political', context.source.isHonored ? ' and prevent them from receiving status tokens' : '']);
    }
}


export default DaidojiIenori;
