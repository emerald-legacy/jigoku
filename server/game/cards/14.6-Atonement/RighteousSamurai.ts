import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class RighteousSamurai extends DrawCard {
    static id = 'righteous-samurai';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor a character',
            when: {
                onModifyHonor: (event, context) => {
                    if(event.amount === undefined || event.context === undefined) {
                        return false;
                    }
                    const honorLoss = event.amount < 0;
                    const viaOpponentsEffect = (context.player.opponent === event.context.player);
                    const viaRingEffect = (event.context.source.type === 'ring');
                    const viaCardEffect = event.context.ability.isCardAbility();
                    const honorLossBelongsToController = event.player === context.player;
                    return honorLoss && viaOpponentsEffect && honorLossBelongsToController && (viaRingEffect || viaCardEffect);
                },
                onTransferHonor: (event, context) => {
                    if(event.amount === undefined || event.context === undefined) {
                        return false;
                    }
                    const honorLoss = event.amount > 0;
                    const viaOpponentsEffect = (context.player.opponent === event.context.player);
                    const viaRingEffect = (event.context.source.type === 'ring');
                    const viaCardEffect = event.context.ability.isCardAbility();
                    const honorLossBelongsToController = event.player === context.player;
                    return honorLoss && viaOpponentsEffect && honorLossBelongsToController && (viaRingEffect || viaCardEffect);
                }
            },
            target: {
                cardType: CardType.Character,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}


export default RighteousSamurai;
