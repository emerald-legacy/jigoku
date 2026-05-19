import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CloakOfNight extends DrawCard {
    static id = 'cloak-of-night';

    setupCardAbilities() {
        this.action({
            title: 'Give a participating character +3 glory',

            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect(() => ({
                        effect: AbilityDsl.effects.modifyGlory(3)
                    })),
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'target',
                            restricts: 'opponentsCardAbilities',
                            applyingPlayer: context.player
                        })
                    }))
                ])
            },
            effect: 'give {0} +3 glory and prevent them from being chosen as the target of {1}\'s triggered abilities until the end of the conflict',
            effectArgs: context => [context.player.opponent]
        });
    }

    canPlay(context, playType) {
        if(!context.player.cardsInPlay.some(card => card.getType() === CardTypes.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

export default CloakOfNight;
