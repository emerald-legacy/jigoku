import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class HanteiXXXVIII extends DrawCard {
    static id = 'hantei-xxxviii';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition: (context) => context.player.opponent && !!context.player.opponent.imperialFavor,
                message: '{0} is discarded from play as its controller\'s opponent has the imperial favor',
                messageArgs: (context) => [context.source],
                gameAction: AbilityDsl.actions.discardFromPlay()
            })
        });

        this.action('Bow a character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.bow());

        this.interrupt('Choose targets for opponent\'s ability')
            .when({
                onCardAbilityInitiated: (event, context) =>
                    event.ability.hasTargetsChosenByInitiatingPlayer(event.context) && event.context.player === context.player.opponent
            })
            .handler(context => {
                context.event.context.choosingPlayerOverride = context.player;
            })
            .effect('choose targets for {1}\'s {2} ability', context => [context.event.card, context.event.ability.title]);
    }
}


export default HanteiXXXVIII;
