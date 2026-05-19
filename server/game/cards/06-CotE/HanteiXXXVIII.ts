import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes } from '../../Constants.js';

class HanteiXXXVIII extends DrawCard {
    static id = 'hantei-xxxviii';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition:  context => context.player.opponent && !!context.player.opponent.imperialFavor,
                message: '{0} is discarded from play as its controller\'s opponent has the imperial favor',
                messageArgs: context => [context.source],
                gameAction: AbilityDsl.actions.discardFromPlay()
            })
        });

        this.action({
            title: 'Bow a character',

            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            }
        });

        this.interrupt({
            title: 'Choose targets for opponent\'s ability',
            when: {
                onCardAbilityInitiated: (event, context) =>
                    event.ability.hasTargetsChosenByInitiatingPlayer(event.context) && event.context.player === context.player.opponent
            },
            effect: 'choose targets for {1}\'s {2} ability',
            effectArgs: context => [context.event.card, context.event.ability.title],
            handler: context => context.event.context.choosingPlayerOverride = context.player
        });
    }
}


export default HanteiXXXVIII;
