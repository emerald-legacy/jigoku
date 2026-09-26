import type { AbilityContext } from '../../AbilityContext.js';
import type CardAbility from '../../CardAbility.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class HanteiXXXVIII extends DrawCard {
    static id = 'hantei-xxxviii';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition:  (context: AbilityContext) => context.player.opponent && !!context.player.opponent.imperialFavor,
                message: '{0} is discarded from play as its controller\'s opponent has the imperial favor',
                messageArgs: (context: AbilityContext) => [context.source],
                gameAction: AbilityDsl.actions.discardFromPlay()
            })
        });

        this.action('Bow a character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.bow());

        this.interrupt('Choose targets for opponent\'s ability')
            .when({
                onCardAbilityInitiated: (event: EventPayload<EventName.OnCardAbilityInitiated>, context) =>
                    event.ability.hasTargetsChosenByInitiatingPlayer(event.context) && event.context.player === context.player.opponent
            })
            .handler(context => {
                context.event.context.choosingPlayerOverride = context.player;
            })
            .effect('choose targets for {1}\'s {2} ability', context => context ? [context.event.card ?? '', (context.event.ability as CardAbility)?.title ?? ''] : []);
    }
}


export default HanteiXXXVIII;
